import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shirt, Crown, Footprints, Scissors } from 'lucide-react';

// 衣物数据 - 按用户要求重新分类
const wardrobeData = {
  '上衣类': {
    icon: Shirt,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    items: [
      { name: '短袖T恤', warmth: 1 },
      { name: '长袖T恤', warmth: 3 },
      { name: '长袖衬衫', warmth: 2 },
      { name: '保暖内衣', warmth: 5 },
      { name: '薄毛衣', warmth: 4 },
      { name: '厚毛衣', warmth: 7 },
      { name: '卫衣', warmth: 5 },
      { name: '薄夹克', warmth: 3 },
      { name: '夹克', warmth: 6 },
      { name: '风衣', warmth: 4 },
      { name: '棉服', warmth: 12 },
      { name: '羽绒服', warmth: 15 }
    ]
  },
  '下装类': {
    icon: Scissors,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    items: [
      { name: '短裤', warmth: 1 },
      { name: '薄裤子', warmth: 2 },
      { name: '牛仔裤', warmth: 4 },
      { name: '厚裤子', warmth: 6 },
      { name: '秋裤', warmth: 3 }
    ]
  },
  '鞋袜类': {
    icon: Footprints,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    items: [
      { name: '凉鞋', warmth: 0 },
      { name: '单鞋', warmth: 1 },
      { name: '皮鞋', warmth: 2 },
      { name: '运动鞋', warmth: 3 },
      { name: '靴子', warmth: 4 },
      { name: '雪地靴', warmth: 6 },
      { name: '薄袜子', warmth: 1 },
      { name: '厚袜子', warmth: 2 }
    ]
  },
  '配饰类': {
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    items: [
      { name: '薄帽', warmth: 1 },
      { name: '毛线帽', warmth: 3 },
      { name: '丝巾', warmth: 1 },
      { name: '围巾', warmth: 3 },
      { name: '厚围巾', warmth: 5 },
      { name: '手套', warmth: 2 }
    ]
  }
};

interface ClothingItemProps {
  name: string;
  warmth: number;
}

const ClothingItemCard: React.FC<ClothingItemProps> = ({ name, warmth }) => {
  const getWarmthColor = (value: number) => {
    if (value <= 2) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (value <= 5) return 'bg-green-100 text-green-800 border-green-200';
    if (value <= 8) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getWarmthLabel = (value: number) => {
    if (value <= 2) return '低保暖';
    if (value <= 5) return '中保暖';
    if (value <= 8) return '高保暖';
    return '极高保暖';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
      <span className="font-medium text-gray-800">{name}</span>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getWarmthColor(warmth)}`}>
          {getWarmthLabel(warmth)}
        </span>
        <span className="text-lg font-bold text-orange-600">
          {warmth}
        </span>
      </div>
    </div>
  );
};

export const Wardrobe: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const allExpanded = expandedCategories.size === Object.keys(wardrobeData).length;
  const noneExpanded = expandedCategories.size === 0;

  const toggleAllCategories = () => {
    if (allExpanded) {
      setExpandedCategories(new Set());
    } else {
      setExpandedCategories(new Set(Object.keys(wardrobeData)));
    }
  };

  return (
    <div className="mt-16 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl overflow-hidden">
      {/* 标题栏 */}
      <div className="bg-white border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">服装保暖值参考</h3>
              <p className="text-sm text-gray-600">查看所有衣物的保暖值和分类信息</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {isExpanded ? '收起' : '展开'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>
      </div>

      {/* 展开内容 */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* 控制栏 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              点击类别查看详细信息
            </div>
            <button
              onClick={toggleAllCategories}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              {allExpanded ? '收起全部' : '展开全部'}
            </button>
          </div>

          {/* 类别网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(wardrobeData).map(([categoryName, categoryData]) => {
              const Icon = categoryData.icon;
              const isExpanded = expandedCategories.has(categoryName);
              
              return (
                <div key={categoryName} className={`border ${categoryData.borderColor} rounded-xl overflow-hidden bg-white`}>
                  {/* 类别标题 */}
                  <button
                    onClick={() => toggleCategory(categoryName)}
                    className={`w-full flex items-center justify-between p-4 ${categoryData.bgColor} hover:opacity-80 transition-all duration-200`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${categoryData.color}`} />
                      <span className={`font-bold ${categoryData.color}`}>{categoryName}</span>
                      <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                        {categoryData.items.length}件
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className={`w-4 h-4 ${categoryData.color}`} />
                    ) : (
                      <ChevronDown className={`w-4 h-4 ${categoryData.color}`} />
                    )}
                  </button>

                  {/* 类别内容 */}
                  {isExpanded && (
                    <div className="p-4 space-y-2">
                      {categoryData.items.map((item, index) => (
                        <ClothingItemCard
                          key={index}
                          name={item.name}
                          warmth={item.warmth}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 保暖值说明 */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-3">保暖值说明</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-blue-800">低保暖 (0-2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-800">中保暖 (3-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-800">高保暖 (6-8)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-red-800">极高保暖 (9+)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};