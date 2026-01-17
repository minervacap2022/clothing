import React from 'react';
import { SmartOutfitRecommendation, ClothingItem } from '../types/smartClothing';
import { 
  Layers, 
  Target, 
  TrendingUp, 
  Info, 
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Shirt,
  Crown,
  Footprints
} from 'lucide-react';

interface SmartOutfitDisplayProps {
  recommendation: SmartOutfitRecommendation;
}

export const SmartOutfitDisplay: React.FC<SmartOutfitDisplayProps> = ({ recommendation }) => {
  const getTemperatureRangeDisplay = () => {
    const rangeMap = {
      'frigid': '严寒',
      'cold': '寒冷',
      'cool': '寒凉',
      'cool_mild': '偏冷凉爽',
      'mild': '适中凉爽',
      'warm': '温和',
      'hot': '温暖'
    };
    return rangeMap[recommendation.temperatureRange] || '未知';
  };

  const getTemperatureRangeColor = () => {
    const colorMap = {
      'frigid': 'from-blue-600 to-purple-600',
      'cold': 'from-blue-500 to-blue-600',
      'cool': 'from-cyan-500 to-blue-500',
      'cool_mild': 'from-green-400 to-cyan-400',
      'mild': 'from-green-500 to-cyan-500',
      'warm': 'from-orange-500 to-yellow-500',
      'hot': 'from-red-500 to-orange-500'
    };
    return colorMap[recommendation.temperatureRange] || 'from-gray-400 to-gray-500';
  };

  const getResultStatus = () => {
    if (recommendation.difference === 0) {
      return { text: '完美匹配', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    } else if (recommendation.difference <= 1) {
      return { text: '优秀匹配', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    } else if (recommendation.difference <= 2) {
      return { text: '良好匹配', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    } else {
      return { text: '可接受匹配', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    }
  };

  const renderClothingItem = (item: ClothingItem) => (
    <div 
      key={item.id}
      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg transition-all hover:shadow-md"
    >
      <span className="font-medium text-gray-800">{item.name}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          {item.minTemp}°C ~ {item.maxTemp}°C
        </span>
        <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded font-medium">
          +{item.warmthValue}
        </span>
      </div>
    </div>
  );

  const renderLayeredTops = () => {
    const { layeredTops } = recommendation;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">上衣分层搭配</h3>
        </div>
        
        {/* 基础层 */}
        {layeredTops.base.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              基础层（贴身必选）
            </div>
            <div className="space-y-2 ml-5">
              {layeredTops.base.map(renderClothingItem)}
            </div>
          </div>
        )}
        
        {/* 中间层 */}
        {layeredTops.middle.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              中间层（保暖增加）
            </div>
            <div className="space-y-2 ml-5">
              {layeredTops.middle.map(renderClothingItem)}
            </div>
          </div>
        )}
        
        {/* 外层 */}
        {layeredTops.outer.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              外层（防风防水）
            </div>
            <div className="space-y-2 ml-5">
              {layeredTops.outer.map(renderClothingItem)}
            </div>
          </div>
        )}
        
        {/* 无中间层或外层时的说明 */}
        {layeredTops.middle.length === 0 && layeredTops.outer.length === 0 && (
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border">
            当前温度下仅需要基础层即可，无需额外叠穿
          </div>
        )}
      </div>
    );
  };

  const status = getResultStatus();

  return (
    <div className="p-6 md:p-8">
      {/* 温度区间和结果概览 */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">智能推荐结果</h2>
            <div className="flex items-center gap-3 mt-1">
              <Thermometer className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{recommendation.temperature}°C</span>
              <span className={`px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r ${getTemperatureRangeColor()}`}>
                {getTemperatureRangeDisplay()}条件
              </span>
            </div>
          </div>
        </div>

        {/* 保暖值信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{recommendation.targetWarmth}</div>
            <div className="text-sm text-blue-600 font-medium">目标保暖值</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600">{recommendation.totalWarmth}</div>
            <div className="text-sm text-green-600 font-medium">实际保暖值</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">{recommendation.difference}</div>
            <div className="text-sm text-orange-600 font-medium">差异值</div>
          </div>
          <div className={`p-4 rounded-xl text-center border ${status.bgColor} ${status.borderColor}`}>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className={`text-sm font-bold ${status.color}`}>{status.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 穿搭组合详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 上衣分层 */}
        <div className="lg:col-span-2">
          {renderLayeredTops()}
        </div>

        {/* 下装 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">下装搭配</h3>
          </div>
          
          {recommendation.bottoms.inner.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                内层（加强保暖）
              </div>
              <div className="space-y-2 ml-5">
                {recommendation.bottoms.inner.map(renderClothingItem)}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              外层（必选）
            </div>
            <div className="space-y-2 ml-5">
              {recommendation.bottoms.regular.map(renderClothingItem)}
            </div>
          </div>
        </div>

        {/* 配饰和鞋子 */}
        <div className="space-y-6">
          {/* 配饰 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">配饰</h3>
              <span className="text-sm text-gray-500">({recommendation.accessories.length}件)</span>
            </div>
            {recommendation.accessories.length > 0 ? (
              <div className="space-y-2">
                {recommendation.accessories.map(renderClothingItem)}
              </div>
            ) : (
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border">
                当前温度下无需特殊配饰
              </div>
            )}
          </div>

          {/* 鞋子 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Footprints className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-800">鞋子</h3>
            </div>
            {renderClothingItem(recommendation.shoes)}
          </div>
        </div>
      </div>

      {/* 推荐逻辑说明 */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-800 mb-3">推荐逻辑说明</h4>
            <ul className="space-y-2">
              {recommendation.reasoningLogic.map((logic, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></span>
                  <span>{logic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 警告和建议 */}
      {recommendation.warnings.length > 0 && (
        <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mt-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-800 mb-3">温馨提示</h4>
              <ul className="space-y-2">
                {recommendation.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 穿搭小贴士 */}
      <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
            <span className="text-emerald-600 text-sm font-bold">✓</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-emerald-800 mb-3">穿搭小贴士</h4>
            <ul className="text-sm text-emerald-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2"></span>
                <span>叠穿时请遵循 "基础层 → 中间层 → 外层" 的穿着顺序</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2"></span>
                <span>根据个人体质和活动强度适当调整穿着</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2"></span>
                <span>注意天气变化，及时增减衣物以保持舒适</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2"></span>
                <span>选择透气性好的材质，避免过度出汗或闷热</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};