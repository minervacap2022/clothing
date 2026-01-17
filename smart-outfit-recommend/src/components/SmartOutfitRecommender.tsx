import React, { useState } from 'react';
import { SmartRecommendationEngine } from '../utils/smartRecommendationEngine';
import { SmartOutfitRecommendations, RecommendationState } from '../types/smartClothing';
import { TemperatureInput } from './TemperatureInput';
import { SmartOutfitDisplay } from './SmartOutfitDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { Wardrobe } from './Wardrobe';

export const SmartOutfitRecommender: React.FC = () => {
  const [state, setState] = useState<RecommendationState>({
    isLoading: false,
    recommendations: null,
    error: null,
    hasResult: false
  });

  const handleTemperatureSubmit = async (temperature: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // 模拟智能分析过程
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const engine = new SmartRecommendationEngine(temperature);
      const recommendations = engine.getMultipleRecommendations();
      
      if (!recommendations || recommendations.recommendations.length === 0) {
        setState({
          isLoading: false,
          recommendations: null,
          error: `在温度 ${temperature}°C 下无法生成合理的穿搭方案。请检查温度范围是否合理（-30°C 到 30°C）。`,
          hasResult: false
        });
      } else {
        setState({
          isLoading: false,
          recommendations,
          error: null,
          hasResult: true
        });
      }
    } catch (err) {
      setState({
        isLoading: false,
        recommendations: null,
        error: '智能推荐系统出现故障，请稍后重试。如问题持续，请检查温度输入。',
        hasResult: false
      });
    }
  };

  const handleReset = () => {
    setState({
      isLoading: false,
      recommendations: null,
      error: null,
      hasResult: false
    });
  };

  const handleChangeOutfit = () => {
    if (state.recommendations && state.recommendations.recommendations.length > 1) {
      const currentIndex = state.recommendations.currentIndex;
      const nextIndex = (currentIndex + 1) % state.recommendations.recommendations.length;
      
      setState(prev => ({
        ...prev,
        recommendations: {
          ...prev.recommendations!,
          currentIndex: nextIndex
        }
      }));
    }
  };

  const currentRecommendation = state.recommendations 
    ? state.recommendations.recommendations[state.recommendations.currentIndex]
    : null;

  const hasMultipleOptions = state.recommendations 
    ? state.recommendations.recommendations.length > 1
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg">
              <span className="text-2xl font-bold text-white">AI</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                乱穿衣
              </h1>
              <p className="text-lg text-orange-600 font-medium">Smart Outfit Recommendation V2.0</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            基于"二八月，乱穿衣"谚语灵感的智能推荐系统，采用真实世界穿搭逻辑，
            避免不合理组合，提供分层穿搭方案，让您告别季节交替时的穿衣困扰
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-5xl mx-auto">
          {/* 温度输入区域 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-orange-100">
            <TemperatureInput 
              onSubmit={handleTemperatureSubmit} 
              disabled={state.isLoading}
              onReset={handleReset}
              hasResult={state.hasResult}
            />
          </div>

          {/* 智能分析状态 */}
          {state.isLoading && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-blue-100">
              <LoadingSpinner />
              <div className="mt-6 space-y-2">
                <p className="text-lg font-medium text-gray-800">智能穿搭分析中</p>
                <p className="text-gray-600">正在根据温度区间分析合理穿搭组合...</p>
                <div className="flex justify-center items-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* 错误信息 */}
          {state.error && (
            <div className="mb-8">
              <ErrorMessage message={state.error} onRetry={handleReset} />
            </div>
          )}

          {/* 智能推荐结果 */}
          {currentRecommendation && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
              <SmartOutfitDisplay recommendation={currentRecommendation} />
              
              {/* 换一换按钮 */}
              {hasMultipleOptions && (
                <div className="px-6 pb-6">
                  <button
                    onClick={handleChangeOutfit}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    换一换 ({state.recommendations!.currentIndex + 1}/{state.recommendations!.recommendations.length})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 衣柜参考组件 */}
          <Wardrobe />
        </div>

        {/* 页脚 */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>乱穿衣 V2.0 | 告别二八月乱穿衣的困扰</span>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};