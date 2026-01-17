import { 
  ClothingItem, 
  ClothingCategory, 
  ClothingLayer, 
  AccessoryType,
  TemperatureRange,
  TemperatureRangeConfig
} from '../types/smartClothing';

// 重构后的衣物数据库 - 基于真实穿搭逻辑，修复极端温度范围

// 上衣类 - 按层次分类
export const smartTops: ClothingItem[] = [
  // 基础层（贴身必选1件）
  { 
    id: 'thermal-underwear', 
    name: '保暖内衣', 
    warmthValue: 5, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.BASE,
    minTemp: -30, 
    maxTemp: 10, 
    isRequired: true 
  },
  { 
    id: 'long-sleeve-tee', 
    name: '长袖T恤', 
    warmthValue: 3, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.BASE,
    minTemp: 10, 
    maxTemp: 25, 
    isRequired: true 
  },
  { 
    id: 'short-sleeve-tee', 
    name: '短袖T恤', 
    warmthValue: 1, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.BASE,
    minTemp: 25, 
    maxTemp: 30, 
    isRequired: true 
  },

  // 中间层（0-2件，可叠加）
  { 
    id: 'long-sleeve-shirt', 
    name: '长袖衬衫', 
    warmthValue: 2, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.MIDDLE,
    minTemp: -15, 
    maxTemp: 20, 
    isRequired: false 
  },
  { 
    id: 'thin-sweater', 
    name: '薄毛衣', 
    warmthValue: 4, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.MIDDLE,
    minTemp: 8, 
    maxTemp: 18, 
    isRequired: false 
  },
  { 
    id: 'thick-sweater', 
    name: '厚毛衣', 
    warmthValue: 7, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.MIDDLE,
    minTemp: -30, 
    maxTemp: 10, 
    isRequired: false 
  },
  { 
    id: 'hoodie', 
    name: '卫衣', 
    warmthValue: 5, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.MIDDLE,
    minTemp: 5, 
    maxTemp: 18, 
    isRequired: false 
  },

  // 新增：超厚毛衣（为极寒天气提供更多选择）
  { 
    id: 'extra-thick-sweater', 
    name: '超厚毛衣', 
    warmthValue: 9, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.MIDDLE,
    minTemp: -30, 
    maxTemp: 5, 
    isRequired: false 
  },

  // 外层（0-1件，防护层）
  { 
    id: 'thin-jacket', 
    name: '薄夹克', 
    warmthValue: 3, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.OUTER,
    minTemp: 12, 
    maxTemp: 25, 
    isRequired: false 
  },
  { 
    id: 'jacket', 
    name: '夹克', 
    warmthValue: 6, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.OUTER,
    minTemp: 5, 
    maxTemp: 16, 
    isRequired: false 
  },
  { 
    id: 'trench-coat', 
    name: '风衣', 
    warmthValue: 4, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.OUTER,
    minTemp: 10, 
    maxTemp: 20, 
    isRequired: false 
  },
  { 
    id: 'cotton-coat', 
    name: '棉服', 
    warmthValue: 12, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.OUTER,
    minTemp: -20, 
    maxTemp: 5, 
    isRequired: false 
  },
  { 
    id: 'down-jacket', 
    name: '羽绒服', 
    warmthValue: 15, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.OUTER,
    minTemp: -30, 
    maxTemp: 0, 
    isRequired: false 
  },

  // 新增：加厚棉服（为极寒天气提供更多选择）
  { 
    id: 'heavy-cotton-coat', 
    name: '加厚棉服', 
    warmthValue: 13, 
    category: ClothingCategory.TOPS,
    layer: ClothingLayer.OUTER,
    minTemp: -30, 
    maxTemp: -5, 
    isRequired: false 
  }
];

// 下装类
export const smartBottoms: ClothingItem[] = [
  // 内层
  { 
    id: 'long-underwear', 
    name: '秋裤', 
    warmthValue: 3, 
    category: ClothingCategory.BOTTOMS,
    layer: ClothingLayer.INNER,
    minTemp: -30, 
    maxTemp: 15, 
    isRequired: false 
  },

  // 外层（必选1件）
  { 
    id: 'shorts', 
    name: '短裤', 
    warmthValue: 1, 
    category: ClothingCategory.BOTTOMS,
    layer: ClothingLayer.REGULAR,
    minTemp: 25, 
    maxTemp: 30, 
    isRequired: true 
  },
  { 
    id: 'thin-pants', 
    name: '薄裤子', 
    warmthValue: 2, 
    category: ClothingCategory.BOTTOMS,
    layer: ClothingLayer.REGULAR,
    minTemp: 20, 
    maxTemp: 30, 
    isRequired: true 
  },
  { 
    id: 'jeans', 
    name: '牛仔裤', 
    warmthValue: 4, 
    category: ClothingCategory.BOTTOMS,
    layer: ClothingLayer.REGULAR,
    minTemp: 0, 
    maxTemp: 25, 
    isRequired: true 
  },
  { 
    id: 'thick-pants', 
    name: '厚裤子', 
    warmthValue: 6, 
    category: ClothingCategory.BOTTOMS,
    layer: ClothingLayer.REGULAR,
    minTemp: -30, 
    maxTemp: 10, 
    isRequired: true 
  }
];

// 配饰类（每种最多1件） - 按用户要求重新分类
export const smartAccessories: ClothingItem[] = [
  // 帽子类
  { 
    id: 'thin-hat', 
    name: '薄帽', 
    warmthValue: 1, 
    category: ClothingCategory.ACCESSORIES,
    accessoryType: AccessoryType.HAT,
    minTemp: 10, 
    maxTemp: 25, 
    isRequired: false 
  },
  { 
    id: 'wool-hat', 
    name: '毛线帽', 
    warmthValue: 3, 
    category: ClothingCategory.ACCESSORIES,
    accessoryType: AccessoryType.HAT,
    minTemp: -30, 
    maxTemp: 10, 
    isRequired: false 
  },
  
  // 围巾类
  { 
    id: 'silk-scarf', 
    name: '丝巾', 
    warmthValue: 1, 
    category: ClothingCategory.ACCESSORIES,
    accessoryType: AccessoryType.SCARF,
    minTemp: 15, 
    maxTemp: 30, 
    isRequired: false 
  },
  { 
    id: 'scarf', 
    name: '围巾', 
    warmthValue: 3, 
    category: ClothingCategory.ACCESSORIES,
    accessoryType: AccessoryType.SCARF,
    minTemp: -10, 
    maxTemp: 15, 
    isRequired: false 
  },
  { 
    id: 'thick-scarf', 
    name: '厚围巾', 
    warmthValue: 5, 
    category: ClothingCategory.ACCESSORIES,
    accessoryType: AccessoryType.SCARF,
    minTemp: -30, 
    maxTemp: 5, 
    isRequired: false 
  },
  
  // 手套类
  { 
    id: 'gloves', 
    name: '手套', 
    warmthValue: 2, 
    category: ClothingCategory.ACCESSORIES,
    accessoryType: AccessoryType.GLOVES,
    minTemp: -30, 
    maxTemp: 10, 
    isRequired: false 
  },
  
  // 袜子类
  { 
    id: 'thin-socks', 
    name: '薄袜子', 
    warmthValue: 1, 
    category: ClothingCategory.ACCESSORIES,
    accessoryType: AccessoryType.SOCKS,
    minTemp: 15, 
    maxTemp: 30, 
    isRequired: true 
  },
  { 
    id: 'thick-socks', 
    name: '厚袜子', 
    warmthValue: 2, 
    category: ClothingCategory.ACCESSORIES,
    accessoryType: AccessoryType.SOCKS,
    minTemp: -30, 
    maxTemp: 15, 
    isRequired: true 
  }
];

// 鞋子类（必选1件）
export const smartShoes: ClothingItem[] = [
  { 
    id: 'sandals', 
    name: '凉鞋', 
    warmthValue: 0, 
    category: ClothingCategory.SHOES,
    minTemp: 25, 
    maxTemp: 30, 
    isRequired: true 
  },
  { 
    id: 'flats', 
    name: '单鞋', 
    warmthValue: 1, 
    category: ClothingCategory.SHOES,
    minTemp: 20, 
    maxTemp: 30, 
    isRequired: true 
  },
  { 
    id: 'leather-shoes', 
    name: '皮鞋', 
    warmthValue: 2, 
    category: ClothingCategory.SHOES,
    minTemp: 15, 
    maxTemp: 25, 
    isRequired: true 
  },
  { 
    id: 'sneakers', 
    name: '运动鞋', 
    warmthValue: 3, 
    category: ClothingCategory.SHOES,
    minTemp: 5, 
    maxTemp: 25, 
    isRequired: true 
  },
  { 
    id: 'boots', 
    name: '靴子', 
    warmthValue: 4, 
    category: ClothingCategory.SHOES,
    minTemp: -15, 
    maxTemp: 15, 
    isRequired: true 
  },
  { 
    id: 'snow-boots', 
    name: '雪地靴', 
    warmthValue: 6, 
    category: ClothingCategory.SHOES,
    minTemp: -30, 
    maxTemp: 5, 
    isRequired: true 
  }
];

// 温度区间配置 - 修复来覆盖-40度到+40度
export const temperatureRangeConfigs: TemperatureRangeConfig[] = [
  {
    range: TemperatureRange.FRIGID,
    minTemp: -30,
    maxTemp: -10,
    requiredCategories: {
      tops: { base: true, middle: 2, outer: true },
      bottoms: { inner: true, regular: true },
      accessories: [AccessoryType.HAT, AccessoryType.SCARF, AccessoryType.GLOVES, AccessoryType.SOCKS],
      shoes: true
    }
  },
  {
    range: TemperatureRange.COLD,
    minTemp: -10,
    maxTemp: 0,
    requiredCategories: {
      tops: { base: true, middle: 1, outer: true },
      bottoms: { inner: true, regular: true },
      accessories: [AccessoryType.HAT, AccessoryType.SCARF, AccessoryType.GLOVES, AccessoryType.SOCKS],
      shoes: true
    }
  },
  {
    range: TemperatureRange.COOL,
    minTemp: 0,
    maxTemp: 10,
    requiredCategories: {
      tops: { base: true, middle: 1, outer: false },
      bottoms: { inner: false, regular: true },
      accessories: [AccessoryType.SOCKS],
      shoes: true
    }
  },
  {
    range: TemperatureRange.COOL_MILD,
    minTemp: 10,
    maxTemp: 16,
    requiredCategories: {
      tops: { base: true, middle: 1, outer: false },
      bottoms: { inner: false, regular: true },
      accessories: [AccessoryType.SOCKS],
      shoes: true
    }
  },
  {
    range: TemperatureRange.MILD,
    minTemp: 17,
    maxTemp: 20,
    requiredCategories: {
      tops: { base: true, middle: 0, outer: false },
      bottoms: { inner: false, regular: true },
      accessories: [AccessoryType.SOCKS],
      shoes: true
    }
  },
  {
    range: TemperatureRange.WARM,
    minTemp: 20,
    maxTemp: 25,
    requiredCategories: {
      tops: { base: true, middle: 0, outer: false },
      bottoms: { inner: false, regular: true },
      accessories: [AccessoryType.SOCKS],
      shoes: true
    }
  },
  {
    range: TemperatureRange.HOT,
    minTemp: 25,
    maxTemp: 30,
    requiredCategories: {
      tops: { base: true, middle: 0, outer: false },
      bottoms: { inner: false, regular: true },
      accessories: [AccessoryType.SOCKS],
      shoes: true
    }
  }
];

// 所有衣物数据
export const allSmartClothing = [...smartTops, ...smartBottoms, ...smartAccessories, ...smartShoes];