import { ClothingItem } from '../types/clothing';

// 上衣类数据
export const tops: ClothingItem[] = [
  { id: 'thermal-underwear', name: '保暖内衣', warmthValue: 5, category: 'tops', layer: 'base' },
  { id: 'long-sleeve-tee', name: '长袖T恤', warmthValue: 3, category: 'tops', layer: 'base' },
  { id: 'thin-sweater', name: '薄毛衣', warmthValue: 6, category: 'tops', layer: 'middle' },
  { id: 'thick-sweater', name: '厚毛衣', warmthValue: 10, category: 'tops', layer: 'middle' },
  { id: 'hoodie', name: '卫衣', warmthValue: 8, category: 'tops', layer: 'middle' },
  { id: 'jacket', name: '夹克', warmthValue: 12, category: 'tops', layer: 'outer' },
  { id: 'trench-coat', name: '风衣', warmthValue: 10, category: 'tops', layer: 'outer' },
  { id: 'down-jacket', name: '羽绒服', warmthValue: 20, category: 'tops', layer: 'outer' },
  { id: 'cotton-coat', name: '棉服', warmthValue: 18, category: 'tops', layer: 'outer' }
];

// 裤子类数据
export const bottoms: ClothingItem[] = [
  { id: 'shorts', name: '短裤', warmthValue: 2, category: 'bottoms' },
  { id: 'thin-pants', name: '薄裤子', warmthValue: 5, category: 'bottoms' },
  { id: 'jeans', name: '牛仔裤', warmthValue: 8, category: 'bottoms' },
  { id: 'thick-pants', name: '厚裤子', warmthValue: 12, category: 'bottoms' },
  { id: 'long-underwear', name: '秋裤', warmthValue: 6, category: 'bottoms', layer: 'base' }
];

// 配饰类数据
export const accessories: ClothingItem[] = [
  { id: 'hat', name: '帽子', warmthValue: 3, category: 'accessories', accessoryType: 'hat' },
  { id: 'thin-scarf', name: '薄围巾', warmthValue: 2, category: 'accessories', accessoryType: 'scarf' },
  { id: 'thick-scarf', name: '厚围巾', warmthValue: 5, category: 'accessories', accessoryType: 'scarf' },
  { id: 'gloves', name: '手套', warmthValue: 3, category: 'accessories', accessoryType: 'gloves' },
  { id: 'thin-socks', name: '薄袜子', warmthValue: 1, category: 'accessories', accessoryType: 'socks' },
  { id: 'thick-socks', name: '厚袜子', warmthValue: 3, category: 'accessories', accessoryType: 'socks' }
];

// 鞋子类数据
export const shoes: ClothingItem[] = [
  { id: 'sandals', name: '凉鞋', warmthValue: 1, category: 'shoes' },
  { id: 'flats', name: '单鞋', warmthValue: 2, category: 'shoes' },
  { id: 'leather-shoes', name: '皮鞋', warmthValue: 3, category: 'shoes' },
  { id: 'sneakers', name: '运动鞋', warmthValue: 4, category: 'shoes' },
  { id: 'boots', name: '靴子', warmthValue: 6, category: 'shoes' },
  { id: 'snow-boots', name: '雪地靴', warmthValue: 8, category: 'shoes' }
];

// 所有衣物数据
export const allClothing = [...tops, ...bottoms, ...accessories, ...shoes];