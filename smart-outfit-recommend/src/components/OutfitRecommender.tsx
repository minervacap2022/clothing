import React, { useState } from 'react';
import { RecommendationEngine } from '../utils/recommendationEngine';
import { OutfitRecommendation } from '../types/clothing';
import { TemperatureInput } from './TemperatureInput';
import { OutfitDisplay } from './OutfitDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface RecommendationState {
  isLoading: boolean;
  recommendation: OutfitRecommendation | null;
  error: string | null;
  hasResult: boolean;
}

export const OutfitRecommender: React.FC = () => {
  const [state, setState] = useState<RecommendationState>({
    isLoading: false,
    recommendation: null,
    error: null,
    hasResult: false
  });

  const handleTemperatureSubmit = async (temperature: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 模拟异步处理过程
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const engine = new RecommendationEngine(temperature);
      const recommendation = engine.getRecommendation();
      
      if (!recommendation) {
        setState({
          isLoading: false,
          recommendation: null,
          error: `在温度 ${temperature}°C 下找不到合适的穿搭组合。请调整温度范围或放宽筛选条件。`,
          hasResult: false
        });
      } else {
        setState({
          isLoading: false,
          recommendation,
          error: null,
          hasResult: true
        });
      }
    } catch (err) {
      setState({
        isLoading: false,
        recommendation: null,
        error: '推荐系统出现错误，请稍后重试。',
        hasResult: false
      });
    }
  };

  const handleReset = () => {
    setState({
      isLoading: false,
      recommendation: null,
      error: null,
      hasResult: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            智能穿搭推荐系统
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            输入当前温度，获得个性化的穿搭建议，保暖值精确匹配，体验温暖舒适的穿着
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-4xl mx-auto">
          {/* 温度输入区域 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <TemperatureInput 
              onSubmit={handleTemperatureSubmit} 
              disabled={state.isLoading}
              onReset={handleReset}
              hasResult={state.hasResult}
            />
          </div>

          {/* 加载状态 */}
          {state.isLoading && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <LoadingSpinner />
              <p className="text-gray-600 mt-4">正在分析温度，生成个性化穿搭方案...</p>
            </div>
          )}

          {/* 错误信息 */}
          {state.error && (
            <div className="mb-8">
              <ErrorMessage message={state.error} onRetry={handleReset} />
            </div>
          )}

          {/* 推荐结果 */}
          {state.recommendation && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <OutfitDisplay recommendation={state.recommendation} />
            </div>
          )}
        </div>

        {/* 页脚 */}
        <div className="text-center mt-12 text-gray-500">
          <p>智能穿搭推荐系统 | 专业的穿着顾问</p>
        </div>
      </div>
    </div>
  );
};