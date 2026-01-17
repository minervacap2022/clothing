// 温度区间枚举
export enum TemperatureRange {
  FRIGID = 'frigid',        // 严寒 (-30°C ~ -10°C)
  COLD = 'cold',            // 寒冷 (-10°C ~ 0°C) 
  COOL = 'cool',            // 寒凉 (0°C ~ 10°C)
  COOL_MILD = 'cool_mild',  // 偏冷凉爽 (10°C ~ 16°C)
  MILD = 'mild',            // 适中凉爽 (17°C ~ 20°C)
  WARM = 'warm',            // 温和 (20°C ~ 25°C)
  HOT = 'hot'               // 温暖 (25°C+)
}

// 衣物层次枚举
export enum ClothingLayer {
  BASE = 'base',           // 基础层（贴身）
  MIDDLE = 'middle',       // 中间层
  OUTER = 'outer',         // 外层
  INNER = 'inner',         // 内层（裤子用）
  REGULAR = 'regular'      // 常规层（裤子用）
}

// 配饰类型枚举
export enum AccessoryType {
  HAT = 'hat',
  SCARF = 'scarf', 
  GLOVES = 'gloves',
  SOCKS = 'socks'
}

// 衣物类别枚举
export enum ClothingCategory {
  TOPS = 'tops',
  BOTTOMS = 'bottoms', 
  ACCESSORIES = 'accessories',
  SHOES = 'shoes'
}

// 新的衣物单品接口
export interface ClothingItem {
  id: string;
  name: string;
  warmthValue: number;
  category: ClothingCategory;
  layer?: ClothingLayer;
  accessoryType?: AccessoryType;
  minTemp: number;          // 适用最低温度
  maxTemp: number;          // 适用最高温度
  isRequired: boolean;      // 在适用温度范围内是否必选
}

// 温度区间配置
export interface TemperatureRangeConfig {
  range: TemperatureRange;
  minTemp: number;
  maxTemp: number;
  requiredCategories: {
    tops: {
      base: boolean;
      middle: number;        // 最少需要几件中间层
      outer: boolean;
    };
    bottoms: {
      inner: boolean;
      regular: boolean;
    };
    accessories: AccessoryType[];
    shoes: boolean;
  };
}

// 分层穿搭结果
export interface LayeredOutfit {
  base: ClothingItem[];     // 基础层
  middle: ClothingItem[];   // 中间层
  outer: ClothingItem[];    // 外层
}

// 重构后的推荐结果
export interface SmartOutfitRecommendation {
  temperature: number;
  temperatureRange: TemperatureRange;
  layeredTops: LayeredOutfit;
  bottoms: {
    inner: ClothingItem[];
    regular: ClothingItem[];
  };
  accessories: ClothingItem[];
  shoes: ClothingItem;
  totalWarmth: number;
  targetWarmth: number;
  difference: number;
  reasoningLogic: string[];
  warnings: string[];
}

// 多方案推荐结果
export interface SmartOutfitRecommendations {
  temperature: number;
  temperatureRange: TemperatureRange;
  targetWarmth: number;
  recommendations: SmartOutfitRecommendation[];
  currentIndex: number;
}

// 推荐状态
export interface RecommendationState {
  isLoading: boolean;
  recommendations: SmartOutfitRecommendations | null;
  error: string | null;
  hasResult: boolean;
}