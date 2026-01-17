import React from 'react';
import { OutfitRecommendation, ClothingItem } from '../types/clothing';
import { Shirt, Scissors, Crown, Footprints, Target, TrendingUp } from 'lucide-react';

interface OutfitDisplayProps {
  recommendation: OutfitRecommendation;
}

export const OutfitDisplay: React.FC<OutfitDisplayProps> = ({ recommendation }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tops': return <Shirt className="w-5 h-5" />;
      case 'bottoms': return <Scissors className="w-5 h-5" />;
      case 'accessories': return <Crown className="w-5 h-5" />;
      case 'shoes': return <Footprints className="w-5 h-5" />;
      default: return null;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'tops': return '上衣';
      case 'bottoms': return '下装';
      case 'accessories': return '配饰';
      case 'shoes': return '鞋子';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tops': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'bottoms': return 'bg-green-50 text-green-700 border-green-200';
      case 'accessories': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'shoes': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderClothingItems = (items: ClothingItem[], category: string) => {
    if (items.length === 0) {
      return (
        <div className="text-gray-500 text-sm italic">
          无需此类物品
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg"
          >
            <span className="font-medium text-gray-800">{item.name}</span>
            <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
              +{item.warmthValue}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const getResultStatus = () => {
    if (recommendation.difference === 0) {
      return { text: '完美匹配', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else if (recommendation.difference <= 1) {
      return { text: '优秀匹配', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    } else if (recommendation.difference <= 2) {
      return { text: '良好匹配', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    } else {
      return { text: '可接受匹配', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    }
  };

  const status = getResultStatus();

  return (
    <div className="p-6 md:p-8">
      {/* 结果概览 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">推荐结果</h2>
            <p className="text-gray-600">为您精心选配的穿搭方案</p>
          </div>
        </div>

        {/* 保暖值信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{recommendation.targetWarmth}</div>
            <div className="text-sm text-blue-600 font-medium">目标保暖值</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{recommendation.totalWarmth}</div>
            <div className="text-sm text-green-600 font-medium">实际保暖值</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{recommendation.difference}</div>
            <div className="text-sm text-orange-600 font-medium">差异值</div>
          </div>
          <div className={`p-4 rounded-lg text-center ${status.bgColor}`}>
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-5 h-5" />
              <span className={`text-sm font-bold ${status.color}`}>{status.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 穿搭组合详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 上衣 */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 p-3 rounded-lg border ${getCategoryColor('tops')}`}>
            {getCategoryIcon('tops')}
            <h3 className="font-semibold">{getCategoryTitle('tops')}</h3>
            <span className="ml-auto text-xs bg-white px-2 py-1 rounded">
              {recommendation.tops.length} 件
            </span>
          </div>
          {renderClothingItems(recommendation.tops, 'tops')}
        </div>

        {/* 下装 */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 p-3 rounded-lg border ${getCategoryColor('bottoms')}`}>
            {getCategoryIcon('bottoms')}
            <h3 className="font-semibold">{getCategoryTitle('bottoms')}</h3>
            <span className="ml-auto text-xs bg-white px-2 py-1 rounded">
              {recommendation.bottoms.length} 件
            </span>
          </div>
          {renderClothingItems(recommendation.bottoms, 'bottoms')}
        </div>

        {/* 配饰 */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 p-3 rounded-lg border ${getCategoryColor('accessories')}`}>
            {getCategoryIcon('accessories')}
            <h3 className="font-semibold">{getCategoryTitle('accessories')}</h3>
            <span className="ml-auto text-xs bg-white px-2 py-1 rounded">
              {recommendation.accessories.length} 件
            </span>
          </div>
          {renderClothingItems(recommendation.accessories, 'accessories')}
        </div>

        {/* 鞋子 */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 p-3 rounded-lg border ${getCategoryColor('shoes')}`}>
            {getCategoryIcon('shoes')}
            <h3 className="font-semibold">{getCategoryTitle('shoes')}</h3>
            <span className="ml-auto text-xs bg-white px-2 py-1 rounded">
              1 件
            </span>
          </div>
          {renderClothingItems([recommendation.shoes], 'shoes')}
        </div>
      </div>

      {/* 提示信息 */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-amber-600 text-sm font-bold">!</span>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-amber-800">穿搭建议</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• 叠穿时请按照内层→中层→外层的顺序穿着</li>
              <li>• 根据个人体质和活动强度适当调整</li>
              <li>• 注意天气变化，及时增减衣物</li>
              <li>• 选择透气性好的材质，保持舒适</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};