import React, { useState, useCallback, useEffect } from 'react';
import { Thermometer, RotateCcw, Search, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { WeatherService } from '../services/weatherService';

interface TemperatureInputProps {
  onSubmit: (temperature: number) => void;
  disabled?: boolean;
  onReset?: () => void;
  hasResult?: boolean;
}

interface LocationWeatherInfo {
  temperature: number;
  city: string;
  country: string;
  description: string;
}

export const TemperatureInput: React.FC<TemperatureInputProps> = ({
  onSubmit,
  disabled = false,
  onReset,
  hasResult = false
}) => {
  const [temperature, setTemperature] = useState<number>(20);
  const [manualInput, setManualInput] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false); // 改为false，不阻塞初始UI
  const [locationInfo, setLocationInfo] = useState<LocationWeatherInfo | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [citySearch, setCitySearch] = useState<string>('');
  const [isSearchingCity, setIsSearchingCity] = useState<boolean>(false);

  // 自动获取位置和温度
  const fetchLocationTemperature = useCallback(async (shouldAutoSubmit = true) => {
    setIsLoadingLocation(true);
    setLocationError('');
    
    try {
      const weatherInfo = await WeatherService.getCurrentTemperature();
      setLocationInfo({
        temperature: weatherInfo.temperature,
        city: weatherInfo.city,
        country: weatherInfo.country,
        description: weatherInfo.description
      });
      setTemperature(weatherInfo.temperature);
      setManualInput('');
      
      // 自动提交获取推荐（如果需要且还没有结果）
      if (shouldAutoSubmit && !hasResult) {
        // 稍微延迟以确保UI更新
        setTimeout(() => {
          onSubmit(weatherInfo.temperature);
        }, 300);
      }
    } catch (err) {
      console.error('Failed to get location temperature:', err);
      setLocationError('无法自动获取位置温度，请手动输入温度');
    } finally {
      setIsLoadingLocation(false);
    }
  }, [hasResult, onSubmit]);

  // 根据城市搜索温度
  const handleCitySearch = useCallback(async () => {
    if (!citySearch.trim()) return;
    
    setIsSearchingCity(true);
    setLocationError('');
    
    try {
      const weatherInfo = await WeatherService.getTemperatureByCity(citySearch);
      setLocationInfo({
        temperature: weatherInfo.temperature,
        city: weatherInfo.city,
        country: weatherInfo.country,
        description: weatherInfo.description
      });
      setTemperature(weatherInfo.temperature);
      setManualInput('');
      setCitySearch('');
    } catch (err) {
      setLocationError(`无法获取 ${citySearch} 的天气信息`);
    } finally {
      setIsSearchingCity(false);
    }
  }, [citySearch]);

  // 组件加载时自动获取位置温度（非阻塞）
  useEffect(() => {
    // 不阻塞初始渲染，让UI先显示
    const timer = setTimeout(() => {
      // 静默获取位置并自动提交
      fetchLocationTemperature(true).catch(err => {
        console.log('Background location fetch failed:', err);
      });
    }, 500); // 较短延迟，让UI快速响应
    
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const temp = parseFloat(e.target.value);
    setTemperature(temp);
    setManualInput('');
    setError('');
    // 清除位置信息，表示用户手动调整了
    setLocationInfo(null);
  }, []);

  const handleManualInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setManualInput(e.target.value);
    if (error) setError('');
    // 清除位置信息
    setLocationInfo(null);
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalTemp = temperature;
    
    // 如果有手动输入，优先使用手动输入
    if (showManualInput && manualInput.trim()) {
      const manualTemp = parseFloat(manualInput);
      if (isNaN(manualTemp)) {
        setError('请输入有效的温度数值');
        return;
      }
      if (manualTemp < -30 || manualTemp > 30) {
        setError('温度范围应在 -30°C 到 30°C 之间');
        return;
      }
      finalTemp = manualTemp;
    }
    
    setError('');
    onSubmit(finalTemp);
  };

  const handleReset = () => {
    setTemperature(20);
    setManualInput('');
    setShowManualInput(false);
    setError('');
    setLocationInfo(null);
    setCitySearch('');
    onReset?.();
    // 重新获取当前位置温度（不自动提交）
    fetchLocationTemperature(false);
  };

  const getTemperatureColor = (temp: number): string => {
    if (temp <= -10) return 'from-blue-600 to-purple-600';
    if (temp <= 0) return 'from-blue-500 to-blue-600';
    if (temp <= 10) return 'from-cyan-500 to-blue-500';
    if (temp <= 16) return 'from-green-400 to-cyan-400';
    if (temp <= 20) return 'from-green-500 to-cyan-500';
    if (temp <= 25) return 'from-orange-400 to-yellow-400';
    return 'from-red-500 to-orange-500';
  };

  const getTemperatureRangeName = (temp: number): string => {
    if (temp <= -10) return '严寒';
    if (temp <= 0) return '寒冷';
    if (temp <= 10) return '寒凉';
    if (temp <= 16) return '偏冷凉爽';
    if (temp <= 20) return '适中凉爽';
    if (temp <= 25) return '温和';
    return '温暖';
  };

  const currentTemp = showManualInput && manualInput.trim() ? (parseFloat(manualInput) || temperature) : temperature;
  const tempColorClass = getTemperatureColor(currentTemp);
  const tempRangeName = getTemperatureRangeName(currentTemp);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${tempColorClass} rounded-full shadow-lg`}>
            <Thermometer className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">环境温度检测</h2>
            <p className="text-gray-600">
              {isLoadingLocation ? '正在获取您所在位置的温度...' : '自动检测或手动调整温度'}
            </p>
          </div>
        </div>
        
        {/* 刷新位置按钮 */}
        {!isLoadingLocation && (
          <button
            type="button"
            onClick={() => fetchLocationTemperature()}
            disabled={disabled}
            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="重新获取位置温度"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 位置信息显示 */}
      {isLoadingLocation && (
        <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <div>
            <p className="text-sm font-medium text-blue-900">正在获取位置信息...</p>
            <p className="text-xs text-blue-700">自动检测您所在地的实时温度</p>
          </div>
        </div>
      )}

      {locationInfo && !isLoadingLocation && (
        <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">
                {locationInfo.city}, {locationInfo.country}
              </p>
              <p className="text-xs text-green-700">
                当前温度: {locationInfo.temperature}°C · {locationInfo.description}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-white font-bold bg-gradient-to-r ${getTemperatureColor(locationInfo.temperature)} shadow-md`}>
            {locationInfo.temperature}°C
          </div>
        </div>
      )}

      {locationError && !isLoadingLocation && (
        <div className="bg-amber-50 rounded-lg p-4">
          <p className="text-sm text-amber-800">{locationError}</p>
        </div>
      )}

      {/* 城市搜索 */}
      <div className="border-t border-gray-200 pt-4">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          搜索其他城市温度
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
            placeholder="输入城市名称（如：北京、Shanghai）"
            disabled={disabled || isSearchingCity}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
          <button
            type="button"
            onClick={handleCitySearch}
            disabled={disabled || isSearchingCity || !citySearch.trim()}
            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSearchingCity ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            搜索
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 温度滑动条 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              温度滑动条调节
            </label>
            <div className={`px-4 py-2 rounded-full text-white font-bold bg-gradient-to-r ${tempColorClass} shadow-md`}>
              {currentTemp}°C
            </div>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={temperature}
              onChange={handleSliderChange}
              disabled={disabled}
              className="w-full h-3 bg-gradient-to-r from-blue-200 via-green-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, 
                  #bfdbfe 0%, #bfdbfe 25%, 
                  #a7f3d0 25%, #a7f3d0 50%, 
                  #fed7aa 50%, #fed7aa 75%, 
                  #fca5a5 75%, #fca5a5 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>-30°C</span>
              <span className={`font-medium text-center ${
                tempColorClass.includes('blue') ? 'text-blue-600' : 
                tempColorClass.includes('cyan') ? 'text-cyan-600' :
                tempColorClass.includes('green') ? 'text-green-600' :
                tempColorClass.includes('yellow') ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {tempRangeName}条件
              </span>
              <span>30°C</span>
            </div>
          </div>
        </div>

        {/* 手动输入选项 */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              精确手动输入
            </label>
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              disabled={disabled}
            >
              {showManualInput ? '使用滑动条' : '手动输入'}
            </button>
          </div>
          
          {showManualInput && (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="-30"
                  max="30"
                  value={manualInput}
                  onChange={handleManualInputChange}
                  disabled={disabled}
                  placeholder="例如：14.5"
                  className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 text-lg font-medium">°C</span>
                </div>
              </div>
              {error && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={disabled}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Search className="w-5 h-5" />
            {disabled ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                智能分析中...
              </>
            ) : (
              '获取智能穿搭建议'
            )}
          </button>
          
          {hasResult && (
            <button
              type="button"
              onClick={handleReset}
              disabled={disabled}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              重新选择
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// 自定义滑动条样式
if (typeof document !== 'undefined') {
  const styleId = 'temperature-slider-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .slider::-webkit-slider-thumb {
        appearance: none;
        height: 24px;
        width: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
      }

      .slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      }

      .slider::-moz-range-thumb {
        height: 24px;
        width: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .slider:focus {
        outline: none;
      }

      .slider::-webkit-slider-track {
        height: 12px;
        border-radius: 6px;
      }
    `;
    document.head.appendChild(style);
  }
}