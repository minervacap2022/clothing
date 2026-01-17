// 衣物基础类型
export interface ClothingItem {
  id: string;
  name: string;
  warmthValue: number;
  category: 'tops' | 'bottoms' | 'accessories' | 'shoes';
  layer?: 'base' | 'middle' | 'outer'; // 用于上衣叠穿
  accessoryType?: 'hat' | 'scarf' | 'gloves' | 'socks'; // 用于配饰分类
}

// 推荐结果类型
export interface OutfitRecommendation {
  tops: ClothingItem[];
  bottoms: ClothingItem[];
  accessories: ClothingItem[];
  shoes: ClothingItem;
  totalWarmth: number;
  targetWarmth: number;
  difference: number;
}

// 推荐配置类型
export interface RecommendationConfig {
  temperature: number;
  targetWarmth: number;
  maxDifference: number;
}

// 叠穿规则类型
export interface LayeringRules {
  maxTopsLayers: number;
  maxBottomsLayers: number;
  requiredBaseLayers: string[];
  invalidCombinations: string[][];
}

// 推荐状态类型
export interface RecommendationState {
  isLoading: boolean;
  recommendations: OutfitRecommendation[];
  currentIndex: number;
  error: string | null;
  hasResult: boolean;
}