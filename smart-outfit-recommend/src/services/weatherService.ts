interface LocationInfo {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface WeatherInfo {
  temperature: number;
  description: string;
  city: string;
  country: string;
  humidity: number;
  feelsLike: number;
}

export class WeatherService {
  // 检测是否为移动设备
  private static isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // 使用免费的IP定位API
  private static async getUserLocation(): Promise<LocationInfo> {
    try {
      // 首选：ipapi.co（支持HTTPS和CORS）- 适用于所有设备
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时
      
      try {
        const response = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          return {
            city: data.city || '未知城市',
            region: data.region || '',
            country: data.country_name || '',
            latitude: data.latitude,
            longitude: data.longitude
          };
        }
      } catch (e) {
        clearTimeout(timeoutId);
        console.log('ipapi.co failed or timed out');
      }

      // 如果IP定位失败，移动设备尝试使用浏览器地理位置API
      if (WeatherService.isMobileDevice()) {
        try {
          return await WeatherService.getBrowserLocation();
        } catch (error) {
          console.log('Browser geolocation also failed');
        }
      }
      
      throw new Error('All location services failed');
    } catch (error) {
      console.error('Error getting user location:', error);
      // 返回默认位置（北京）
      return {
        city: '北京',
        region: '北京',
        country: '中国',
        latitude: 39.9042,
        longitude: 116.4074
      };
    }
  }

  // 备选方案：使用浏览器地理位置API
  private static async getBrowserLocation(): Promise<LocationInfo> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // 反向地理编码获取城市名称（添加超时）
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=zh-CN,zh;q=0.9,en;q=0.8`,
              {
                headers: {
                  'Accept': 'application/json'
                },
                signal: controller.signal
              }
            );
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              throw new Error('Failed to get location name');
            }
            
            const data = await response.json();
            
            resolve({
              city: data.address?.city || data.address?.town || data.address?.county || '未知城市',
              region: data.address?.state || '',
              country: data.address?.country || '',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          } catch (error) {
            // 如果反向地理编码失败，至少返回坐标
            resolve({
              city: '当前位置',
              region: '',
              country: '',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          timeout: 5000, // 减少超时时间到5秒
          enableHighAccuracy: false,
          maximumAge: 300000 // 缓存位置5分钟
        }
      );
    });
  }

  // 获取天气信息
  private static async getWeatherByCoords(lat: number, lon: number, city: string, country: string): Promise<WeatherInfo> {
    try {
      // 使用Open-Meteo API（免费，无需API密钥）
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to get weather data');
      }
      
      const data = await response.json();
      
      // Open-Meteo返回的天气代码映射
      const weatherCodeToDescription = (code: number): string => {
        const weatherCodes: { [key: number]: string } = {
          0: '晴天',
          1: '大部晴朗',
          2: '局部多云',
          3: '多云',
          45: '有雾',
          48: '冰雾',
          51: '小雨',
          53: '中雨',
          55: '大雨',
          61: '小阵雨',
          63: '中阵雨',
          65: '大阵雨',
          71: '小雪',
          73: '中雪',
          75: '大雪',
          77: '雪粒',
          80: '小阵雨',
          81: '中阵雨',
          82: '大阵雨',
          95: '雷暴',
          96: '冰雹雷暴',
          99: '强冰雹雷暴'
        };
        return weatherCodes[code] || '未知天气';
      };
      
      return {
        temperature: Math.round(data.current_weather.temperature),
        description: weatherCodeToDescription(data.current_weather.weathercode),
        city: city,
        country: country,
        humidity: data.current_weather?.relative_humidity || 0,
        feelsLike: Math.round(data.current_weather.temperature) // Open-Meteo不提供体感温度，使用实际温度
      };
    } catch (error) {
      console.error('Error getting weather data from Open-Meteo:', error);
      // 备选方案：使用wttr.in API（更简单但功能有限）
      return WeatherService.getWeatherFromWttr(city);
    }
  }

  // 备选天气API
  private static async getWeatherFromWttr(city: string): Promise<WeatherInfo> {
    try {
      const response = await fetch(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to get weather from wttr.in');
      }
      
      const data = await response.json();
      const current = data.current_condition[0];
      
      return {
        temperature: parseInt(current.temp_C),
        description: current.weatherDesc[0].value,
        city: data.nearest_area[0].areaName[0].value,
        country: data.nearest_area[0].country[0].value,
        humidity: parseInt(current.humidity),
        feelsLike: parseInt(current.FeelsLikeC)
      };
    } catch (error) {
      throw new Error('Unable to fetch weather data');
    }
  }

  // 添加超时包装函数
  private static async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      )
    ]);
  }

  // 主要的公开方法：自动获取当前温度
  public static async getCurrentTemperature(): Promise<WeatherInfo> {
    try {
      // 1. 获取用户位置（移动端更短超时）
      const isMobile = WeatherService.isMobileDevice();
      const location = await WeatherService.withTimeout(
        WeatherService.getUserLocation(),
        isMobile ? 4000 : 6000  // 移动端4秒，PC端6秒
      );
      
      // 2. 根据位置获取天气（更短超时）
      const weather = await WeatherService.withTimeout(
        WeatherService.getWeatherByCoords(
          location.latitude,
          location.longitude,
          location.city,
          location.country
        ),
        3000  // 最多3秒
      );
      
      return weather;
    } catch (error) {
      console.error('Error in getCurrentTemperature:', error);
      throw new Error('无法获取当前位置的温度信息。请手动输入温度。');
    }
  }

  // 根据城市名称获取天气（供手动搜索使用）
  public static async getTemperatureByCity(cityName: string): Promise<WeatherInfo> {
    try {
      // 使用Nominatim进行地理编码
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!geoResponse.ok) {
        throw new Error('Failed to geocode city');
      }
      
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        throw new Error('City not found');
      }
      
      const location = geoData[0];
      
      return WeatherService.getWeatherByCoords(
        parseFloat(location.lat),
        parseFloat(location.lon),
        cityName,
        location.display_name.split(',').pop()?.trim() || ''
      );
    } catch (error) {
      console.error('Error getting weather by city:', error);
      // 尝试直接使用wttr.in
      return WeatherService.getWeatherFromWttr(cityName);
    }
  }
}
