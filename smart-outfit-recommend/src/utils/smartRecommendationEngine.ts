import {
  SmartOutfitRecommendation,
  SmartOutfitRecommendations,
  ClothingItem,
  ClothingCategory,
  ClothingLayer,
  AccessoryType,
  TemperatureRange,
  TemperatureRangeConfig,
  LayeredOutfit
} from '../types/smartClothing';
import {
  smartTops,
  smartBottoms,
  smartAccessories,
  smartShoes,
  temperatureRangeConfigs
} from '../data/smartClothing';

/**
 * 智能穿搭推荐引擎 V2.1
 * 基于真实世界穿搭逻辑，支持多方案推荐
 */
export class SmartRecommendationEngine {
  private temperature: number;
  private temperatureRange: TemperatureRange;
  private rangeConfig: TemperatureRangeConfig;

  constructor(temperature: number) {
    this.temperature = temperature;
    this.temperatureRange = this.determineTemperatureRange(temperature);
    this.rangeConfig = this.getTemperatureRangeConfig();
  }

  /**
   * 获取智能穿搭推荐（单个方案，兼容性方法）
   */
  getSmartRecommendation(): SmartOutfitRecommendation | null {
    const multipleRecommendations = this.getMultipleRecommendations();
    return multipleRecommendations && multipleRecommendations.recommendations.length > 0 
      ? multipleRecommendations.recommendations[0] 
      : null;
  }

  /**
   * 获取多个智能穿搭推荐方案
   */
  getMultipleRecommendations(): SmartOutfitRecommendations | null {
    try {
      const allRecommendations = this.generateAllValidRecommendations();
      
      if (allRecommendations.length === 0) {
        // 容错机制：放宽保暖值要求
        console.warn(`温度 ${this.temperature}°C 无法生成标准推荐，尝试容错模式`);
        const fallbackRecommendations = this.generateFallbackRecommendations();
        
        if (fallbackRecommendations.length === 0) {
          return null;
        }
        
        return {
          temperature: this.temperature,
          temperatureRange: this.temperatureRange,
          targetWarmth: 40 - this.temperature,
          recommendations: fallbackRecommendations,
          currentIndex: 0
        };
      }

      // 按保暖值差异排序，选取最优的几个方案
      allRecommendations.sort((a, b) => a.difference - b.difference);
      const bestRecommendations = allRecommendations.slice(0, 3); // 最多返3个方案

      return {
        temperature: this.temperature,
        temperatureRange: this.temperatureRange,
        targetWarmth: 40 - this.temperature,
        recommendations: bestRecommendations,
        currentIndex: 0
      };

    } catch (error) {
      console.error('推荐引擎错误:', error);
      return null;
    }
  }

  /**
   * 生成所有有效的推荐方案
   */
  private generateAllValidRecommendations(): SmartOutfitRecommendation[] {
    const validRecommendations: SmartOutfitRecommendation[] = [];
    const targetWarmth = 40 - this.temperature;
    const maxDifference = 3;

    // 生成所有可能的上衣组合
    const topsOptions = this.generateAllTopsOptions();
    
    // 生成所有可能的下装组合
    const bottomsOptions = this.generateAllBottomsOptions();
    
    // 生成所有可能的配饰组合
    const accessoriesOptions = this.generateAllAccessoriesOptions();
    
    // 获取可选鞋子
    const availableShoes = this.getAvailableShoes();

    // 组合所有可能性
    for (const topsOption of topsOptions) {
      for (const bottomsOption of bottomsOptions) {
        for (const accessoriesOption of accessoriesOptions) {
          for (const shoe of availableShoes) {
            const totalWarmth = this.calculateTotalWarmth(
              topsOption,
              bottomsOption,
              accessoriesOption,
              shoe
            );

            const difference = Math.abs(totalWarmth - targetWarmth);
            
            // 只保留差异在允许范围内的组合
            if (difference <= maxDifference) {
              const reasoningLogic = this.generateReasoningLogic(
                topsOption,
                bottomsOption,
                accessoriesOption,
                shoe
              );

              const warnings = this.generateWarnings(totalWarmth);

              validRecommendations.push({
                temperature: this.temperature,
                temperatureRange: this.temperatureRange,
                layeredTops: topsOption,
                bottoms: bottomsOption,
                accessories: accessoriesOption,
                shoes: shoe,
                totalWarmth,
                targetWarmth,
                difference,
                reasoningLogic,
                warnings
              });
            }
          }
        }
      }
    }

    return validRecommendations;
  }

  /**
   * 容错推荐生成 - 放宽保暖值要求
   */
  private generateFallbackRecommendations(): SmartOutfitRecommendation[] {
    const validRecommendations: SmartOutfitRecommendation[] = [];
    const targetWarmth = 40 - this.temperature;

    // 放宽保暖值差异到10
    const maxDifference = 10;

    // 生成所有可能的上衣组合
    const topsOptions = this.generateAllTopsOptions();
    
    // 生成所有可能的下装组合
    const bottomsOptions = this.generateAllBottomsOptions();
    
    // 生成所有可能的配饰组合
    const accessoriesOptions = this.generateAllAccessoriesOptions();
    
    // 获取可选鞋子
    let availableShoes = this.getAvailableShoes();
    
    // 如果没有可用鞋子，使用所有鞋子
    if (availableShoes.length === 0) {
      availableShoes = smartShoes;
    }

    // 简化组合生成，只取前几个选项
    const limitedTopsOptions = topsOptions.slice(0, 3);
    const limitedBottomsOptions = bottomsOptions.slice(0, 3);
    const limitedAccessoriesOptions = accessoriesOptions.slice(0, 3);
    const limitedShoesOptions = availableShoes.slice(0, 2);

    // 组合所有可能性
    for (const topsOption of limitedTopsOptions) {
      for (const bottomsOption of limitedBottomsOptions) {
        for (const accessoriesOption of limitedAccessoriesOptions) {
          for (const shoe of limitedShoesOptions) {
            const totalWarmth = this.calculateTotalWarmth(
              topsOption,
              bottomsOption,
              accessoriesOption,
              shoe
            );

            const difference = Math.abs(totalWarmth - targetWarmth);
            
            // 放宽的差异要求
            if (difference <= maxDifference) {
              const reasoningLogic = this.generateReasoningLogic(
                topsOption,
                bottomsOption,
                accessoriesOption,
                shoe
              );

              const warnings = this.generateWarnings(totalWarmth);
              warnings.push('此推荐为容错模式，建议根据实际情况调整');

              validRecommendations.push({
                temperature: this.temperature,
                temperatureRange: this.temperatureRange,
                layeredTops: topsOption,
                bottoms: bottomsOption,
                accessories: accessoriesOption,
                shoes: shoe,
                totalWarmth,
                targetWarmth,
                difference,
                reasoningLogic,
                warnings
              });
            }
          }
        }
      }
    }

    return validRecommendations.sort((a, b) => a.difference - b.difference).slice(0, 3);
  }

  /**
   * 生成所有上衣选项
   */
  private generateAllTopsOptions(): LayeredOutfit[] {
    const options: LayeredOutfit[] = [];
    
    // 获取可选的基础层
    const baseOptions = this.getAvailableBaseLayers();
    
    // 获取可选的中间层
    const middleOptions = this.getAvailableMiddleLayers();
    
    // 获取可选的外层
    const outerOptions = this.getAvailableOuterLayers();
    
    const requiredMiddleCount = this.rangeConfig.requiredCategories.tops.middle;
    const requiresOuter = this.rangeConfig.requiredCategories.tops.outer;

    for (const base of baseOptions) {
      // 生成中间层组合
      const middleCombinations = this.generateMiddleLayerCombinations(middleOptions, requiredMiddleCount);
      
      for (const middleCombo of middleCombinations) {
        if (requiresOuter) {
          // 必须有外层
          for (const outer of outerOptions) {
            options.push({
              base: [base],
              middle: middleCombo,
              outer: [outer]
            });
          }
        } else {
          // 可选外层
          options.push({
            base: [base],
            middle: middleCombo,
            outer: []
          });
          
          // 也可以有外层
          for (const outer of outerOptions) {
            options.push({
              base: [base],
              middle: middleCombo,
              outer: [outer]
            });
          }
        }
      }
    }

    return options;
  }

  /**
   * 获取所有可用的基础层
   */
  private getAvailableBaseLayers(): ClothingItem[] {
    return smartTops.filter(item => 
      item.layer === ClothingLayer.BASE &&
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );
  }

  /**
   * 获取所有可用的中间层
   */
  private getAvailableMiddleLayers(): ClothingItem[] {
    return smartTops.filter(item => 
      item.layer === ClothingLayer.MIDDLE &&
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );
  }

  /**
   * 获取所有可用的外层
   */
  private getAvailableOuterLayers(): ClothingItem[] {
    return smartTops.filter(item => 
      item.layer === ClothingLayer.OUTER &&
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );
  }

  /**
   * 生成中间层组合
   */
  private generateMiddleLayerCombinations(middleOptions: ClothingItem[], requiredCount: number): ClothingItem[][] {
    const combinations: ClothingItem[][] = [];
    
    if (requiredCount === 0) {
      combinations.push([]);
      // 也可以有可选的中间层
      for (const item of middleOptions) {
        combinations.push([item]);
      }
      return combinations;
    }
    
    // 需要指定数量的中间层
    if (requiredCount === 1) {
      for (const item of middleOptions) {
        combinations.push([item]);
      }
    } else if (requiredCount === 2) {
      // 两件中间层的组合
      for (let i = 0; i < middleOptions.length; i++) {
        for (let j = i + 1; j < middleOptions.length; j++) {
          combinations.push([middleOptions[i], middleOptions[j]]);
        }
      }
    }
    
    return combinations;
  }

  /**
   * 生成所有下装选项
   */
  private generateAllBottomsOptions(): { inner: ClothingItem[], regular: ClothingItem[] }[] {
    const options: { inner: ClothingItem[], regular: ClothingItem[] }[] = [];
    
    // 获取可用的内层和常规层
    const innerOptions = smartBottoms.filter(item => 
      item.layer === ClothingLayer.INNER &&
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );
    
    const regularOptions = smartBottoms.filter(item => 
      item.layer === ClothingLayer.REGULAR &&
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );
    
    // 生成组合
    const requiresInner = this.rangeConfig.requiredCategories.bottoms.inner;
    
    for (const regular of regularOptions) {
      if (requiresInner) {
        // 必须有内层
        for (const inner of innerOptions) {
          options.push({
            inner: [inner],
            regular: [regular]
          });
        }
      } else {
        // 可选内层
        options.push({
          inner: [],
          regular: [regular]
        });
        
        // 也可以有内层
        for (const inner of innerOptions) {
          options.push({
            inner: [inner],
            regular: [regular]
          });
        }
      }
    }
    
    return options;
  }

  /**
   * 生成所有配饰选项
   */
  private generateAllAccessoriesOptions(): ClothingItem[][] {
    const options: ClothingItem[][] = [];
    const requiredTypes = this.rangeConfig.requiredCategories.accessories;
    
    // 获取每种类型的可用配饰
    const availableAccessories: { [key: string]: ClothingItem[] } = {};
    
    for (const accessoryType of Object.values(AccessoryType)) {
      availableAccessories[accessoryType] = smartAccessories.filter(item => 
        item.accessoryType === accessoryType &&
        this.temperature >= item.minTemp &&
        this.temperature <= item.maxTemp
      );
    }
    
    // 生成所有可能的组合
    const generateCombinations = (types: AccessoryType[], currentCombo: ClothingItem[]): void => {
      if (types.length === 0) {
        options.push([...currentCombo]);
        return;
      }
      
      const currentType = types[0];
      const remainingTypes = types.slice(1);
      const availableItems = availableAccessories[currentType] || [];
      
      if (requiredTypes.includes(currentType)) {
        // 必选配饰
        for (const item of availableItems) {
          generateCombinations(remainingTypes, [...currentCombo, item]);
        }
      } else {
        // 可选配饰
        generateCombinations(remainingTypes, currentCombo); // 不选
        for (const item of availableItems) {
          generateCombinations(remainingTypes, [...currentCombo, item]);
        }
      }
    };
    
    generateCombinations(Object.values(AccessoryType), []);
    return options;
  }

  /**
   * 获取可用鞋子
   */
  private getAvailableShoes(): ClothingItem[] {
    return smartShoes.filter(item => 
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );
  }
  private determineTemperatureRange(temperature: number): TemperatureRange {
    if (temperature < -10) return TemperatureRange.FRIGID;    // -30度到-11度
    if (temperature < 0) return TemperatureRange.COLD;        // -10度到-1度
    if (temperature < 10) return TemperatureRange.COOL;       // 0度到9度
    if (temperature < 17) return TemperatureRange.COOL_MILD;  // 10-16度：偏冷凉爽
    if (temperature < 21) return TemperatureRange.MILD;       // 17-20度：适中凉爽
    if (temperature < 25) return TemperatureRange.WARM;       // 21-24度
    return TemperatureRange.HOT;                              // 25度以上
  }

  /**
   * 获取温度区间配置
   */
  private getTemperatureRangeConfig(): TemperatureRangeConfig {
    const config = temperatureRangeConfigs.find(c => c.range === this.temperatureRange);
    if (!config) {
      throw new Error(`找不到温度区间 ${this.temperatureRange} 的配置`);
    }
    return config;
  }

  /**
   * 选择分层上衣
   */
  private selectLayeredTops(): LayeredOutfit | null {
    // 选择基础层（必选）
    const baseLayer = this.selectBaseLayer();
    if (!baseLayer) return null;

    // 选择中间层
    const middleLayers = this.selectMiddleLayers();

    // 选择外层
    const outerLayer = this.selectOuterLayer();

    return {
      base: [baseLayer],
      middle: middleLayers,
      outer: outerLayer ? [outerLayer] : []
    };
  }

  /**
   * 选择基础层
   */
  private selectBaseLayer(): ClothingItem | null {
    const baseTops = smartTops.filter(item => 
      item.layer === ClothingLayer.BASE &&
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );

    // 按温度区间选择最适合的基础层
    if (this.temperature <= 10) {
      return baseTops.find(item => item.id === 'thermal-underwear') || baseTops[0] || null;
    } else if (this.temperature <= 25) {
      return baseTops.find(item => item.id === 'long-sleeve-tee') || baseTops[0] || null;
    } else {
      return baseTops.find(item => item.id === 'short-sleeve-tee') || baseTops[0] || null;
    }
  }

  /**
   * 选择中间层
   */
  private selectMiddleLayers(): ClothingItem[] {
    const requiredMiddleCount = this.rangeConfig.requiredCategories.tops.middle;
    if (requiredMiddleCount === 0) return [];

    const availableMiddle = smartTops.filter(item => 
      item.layer === ClothingLayer.MIDDLE &&
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );

    // 按保暖值排序，选择最适合的
    availableMiddle.sort((a, b) => {
      const tempDiffA = Math.abs((a.minTemp + a.maxTemp) / 2 - this.temperature);
      const tempDiffB = Math.abs((b.minTemp + b.maxTemp) / 2 - this.temperature);
      return tempDiffA - tempDiffB;
    });

    return availableMiddle.slice(0, Math.min(requiredMiddleCount, 2));
  }

  /**
   * 选择外层
   */
  private selectOuterLayer(): ClothingItem | null {
    if (!this.rangeConfig.requiredCategories.tops.outer) {
      return null; // 该温度下不需要外层
    }

    const availableOuter = smartTops.filter(item => 
      item.layer === ClothingLayer.OUTER &&
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );

    if (availableOuter.length === 0) return null;

    // 选择最适合的外层
    return availableOuter.reduce((best, current) => {
      const bestTempDiff = Math.abs((best.minTemp + best.maxTemp) / 2 - this.temperature);
      const currentTempDiff = Math.abs((current.minTemp + current.maxTemp) / 2 - this.temperature);
      return currentTempDiff < bestTempDiff ? current : best;
    });
  }

  /**
   * 选择下装
   */
  private selectBottoms(): { inner: ClothingItem[], regular: ClothingItem[] } | null {
    // 选择内层（秋裤）
    const inner: ClothingItem[] = [];
    if (this.rangeConfig.requiredCategories.bottoms.inner) {
      const longUnderwear = smartBottoms.find(item => 
        item.layer === ClothingLayer.INNER &&
        this.temperature >= item.minTemp &&
        this.temperature <= item.maxTemp
      );
      if (longUnderwear) {
        inner.push(longUnderwear);
      }
    }

    // 选择外层（必选）
    const availableRegular = smartBottoms.filter(item => 
      item.layer === ClothingLayer.REGULAR &&
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );

    if (availableRegular.length === 0) return null;

    // 选择最适合的外裤
    const regular = availableRegular.reduce((best, current) => {
      const bestTempDiff = Math.abs((best.minTemp + best.maxTemp) / 2 - this.temperature);
      const currentTempDiff = Math.abs((current.minTemp + current.maxTemp) / 2 - this.temperature);
      return currentTempDiff < bestTempDiff ? current : best;
    });

    return { inner, regular: [regular] };
  }

  /**
   * 选择配饰
   */
  private selectAccessories(): ClothingItem[] {
    const selectedAccessories: ClothingItem[] = [];
    const requiredTypes = this.rangeConfig.requiredCategories.accessories;

    for (const requiredType of requiredTypes) {
      const availableItems = smartAccessories.filter(item => 
        item.accessoryType === requiredType &&
        this.temperature >= item.minTemp &&
        this.temperature <= item.maxTemp
      );

      if (availableItems.length > 0) {
        // 选择最适合的
        const bestItem = availableItems.reduce((best, current) => {
          const bestTempDiff = Math.abs((best.minTemp + best.maxTemp) / 2 - this.temperature);
          const currentTempDiff = Math.abs((current.minTemp + current.maxTemp) / 2 - this.temperature);
          return currentTempDiff < bestTempDiff ? current : best;
        });
        selectedAccessories.push(bestItem);
      }
    }

    return selectedAccessories;
  }

  /**
   * 选择鞋子
   */
  private selectShoes(): ClothingItem | null {
    const availableShoes = smartShoes.filter(item => 
      this.temperature >= item.minTemp &&
      this.temperature <= item.maxTemp
    );

    if (availableShoes.length === 0) return null;

    // 选择最适合的鞋子
    return availableShoes.reduce((best, current) => {
      const bestTempDiff = Math.abs((best.minTemp + best.maxTemp) / 2 - this.temperature);
      const currentTempDiff = Math.abs((current.minTemp + current.maxTemp) / 2 - this.temperature);
      return currentTempDiff < bestTempDiff ? current : best;
    });
  }

  /**
   * 计算总保暖值
   */
  private calculateTotalWarmth(
    layeredTops: LayeredOutfit,
    bottoms: { inner: ClothingItem[], regular: ClothingItem[] },
    accessories: ClothingItem[],
    shoes: ClothingItem
  ): number {
    let total = 0;
    
    // 上衣层次
    total += layeredTops.base.reduce((sum, item) => sum + item.warmthValue, 0);
    total += layeredTops.middle.reduce((sum, item) => sum + item.warmthValue, 0);
    total += layeredTops.outer.reduce((sum, item) => sum + item.warmthValue, 0);
    
    // 下装
    total += bottoms.inner.reduce((sum, item) => sum + item.warmthValue, 0);
    total += bottoms.regular.reduce((sum, item) => sum + item.warmthValue, 0);
    
    // 配饰和鞋子
    total += accessories.reduce((sum, item) => sum + item.warmthValue, 0);
    total += shoes.warmthValue;
    
    return total;
  }

  /**
   * 生成推荐逻辑说明
   */
  private generateReasoningLogic(
    layeredTops: LayeredOutfit,
    bottoms: { inner: ClothingItem[], regular: ClothingItem[] },
    accessories: ClothingItem[],
    shoes: ClothingItem
  ): string[] {
    const logic: string[] = [];
    const tempRangeName = this.getTemperatureRangeName();
    
    logic.push(`当前温度 ${this.temperature}°C 属于${tempRangeName}区间`);
    
    // 基础层逻辑
    if (layeredTops.base.length > 0) {
      const baseItem = layeredTops.base[0];
      logic.push(`选择 "${baseItem.name}" 作为基础层，适用温度范围 ${baseItem.minTemp}°C ~ ${baseItem.maxTemp}°C`);
    }
    
    // 中间层逻辑
    if (layeredTops.middle.length > 0) {
      const middleNames = layeredTops.middle.map(item => `"${item.name}"`).join('、');
      logic.push(`${tempRangeName}条件下增加中间层：${middleNames}`);
    }
    
    // 外层逻辑
    if (layeredTops.outer.length > 0) {
      const outerItem = layeredTops.outer[0];
      logic.push(`${tempRangeName}环境必须穿着外层 "${outerItem.name}" 防风保暖`);
    }
    
    // 下装逻辑
    if (bottoms.inner.length > 0) {
      logic.push(`低温环境下加穿秋裤增加保暖`);
    }
    
    // 配饰逻辑
    if (accessories.length > 0) {
      const accessoryNames = accessories.map(item => `"${item.name}"`).join('、');
      logic.push(`${tempRangeName}条件下配备必要配饰：${accessoryNames}`);
    }
    
    // 鞋子逻辑
    logic.push(`根据温度选择适合的鞋子 "${shoes.name}"`);
    
    return logic;
  }

  /**
   * 生成警告信息
   */
  private generateWarnings(totalWarmth: number): string[] {
    const warnings: string[] = [];
    const targetWarmth = 40 - this.temperature;
    const difference = Math.abs(totalWarmth - targetWarmth);
    
    if (difference > 3) {
      warnings.push('保暖值与目标值差异较大，可能需要根据个人体质调整');
    }
    
    if (this.temperature < 0 && totalWarmth < 25) {
      warnings.push('低温环境下请特别注意防寒保暖');
    }
    
    if (this.temperature > 25 && totalWarmth > 10) {
      warnings.push('热天请注意透气性，防止中暑');
    }
    
    return warnings;
  }

  /**
   * 获取温度区间名称
   */
  private getTemperatureRangeName(): string {
    switch (this.temperatureRange) {
      case TemperatureRange.FRIGID: return '严寒';
      case TemperatureRange.COLD: return '寒冷';
      case TemperatureRange.COOL: return '寒凉';
      case TemperatureRange.COOL_MILD: return '偏冷凉爽';
      case TemperatureRange.MILD: return '适中凉爽';
      case TemperatureRange.WARM: return '温和';
      case TemperatureRange.HOT: return '温暖';
      default: return '未知';
    }
  }
}