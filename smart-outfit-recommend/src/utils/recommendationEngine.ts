import { ClothingItem, OutfitRecommendation, RecommendationConfig } from '../types/clothing';
import { tops, bottoms, accessories, shoes } from '../data/clothing';

/**
 * 智能穿搭推荐引擎
 */
export class RecommendationEngine {
  private config: RecommendationConfig;

  constructor(temperature: number) {
    this.config = {
      temperature,
      targetWarmth: 40 - temperature,
      maxDifference: 3
    };
  }

  /**
   * 获取穿搭推荐组合（所有符合条件的组合）
   */
  getRecommendations(): OutfitRecommendation[] {
    const allCombinations = this.generateAllCombinations();
    const validCombinations = allCombinations.filter(combo => this.isValidCombination(combo));
    
    if (validCombinations.length === 0) {
      return [];
    }

    // 按照保暖值差异排序，返回所有符合条件的组合
    return validCombinations
      .sort((a, b) => a.difference - b.difference)
      .slice(0, 20); // 最多返回20个组合，避免过多选项
  }

  /**
   * 获取最优推荐（兼容性方法）
   */
  getRecommendation(): OutfitRecommendation | null {
    const recommendations = this.getRecommendations();
    return recommendations.length > 0 ? recommendations[0] : null;
  }

  /**
   * 生成所有可能的穿搭组合
   */
  private generateAllCombinations(): OutfitRecommendation[] {
    const combinations: OutfitRecommendation[] = [];
    
    // 生成上衣组合（最多4件，遵循叠穿规则）
    const topsCombinations = this.generateTopsCombinations();
    
    // 生成裤子组合（最多2件）
    const bottomsCombinations = this.generateBottomsCombinations();
    
    // 生成配饰组合
    const accessoriesCombinations = this.generateAccessoriesCombinations();
    
    // 组合所有类别
    for (const topsCombo of topsCombinations) {
      for (const bottomsCombo of bottomsCombinations) {
        for (const accessoriesCombo of accessoriesCombinations) {
          for (const shoe of shoes) {
            const totalWarmth = [...topsCombo, ...bottomsCombo, ...accessoriesCombo, shoe]
              .reduce((sum, item) => sum + item.warmthValue, 0);
            
            const combination: OutfitRecommendation = {
              tops: topsCombo,
              bottoms: bottomsCombo,
              accessories: accessoriesCombo,
              shoes: shoe,
              totalWarmth,
              targetWarmth: this.config.targetWarmth,
              difference: Math.abs(totalWarmth - this.config.targetWarmth)
            };
            
            combinations.push(combination);
          }
        }
      }
    }
    
    return combinations;
  }

  /**
   * 生成上衣组合（遵循叠穿规则）
   */
  private generateTopsCombinations(): ClothingItem[][] {
    const combinations: ClothingItem[][] = [];
    const baseTops = tops.filter(item => item.layer === 'base');
    const middleTops = tops.filter(item => item.layer === 'middle');
    const outerTops = tops.filter(item => item.layer === 'outer');
    
    // 单件上衣
    for (const top of tops) {
      combinations.push([top]);
    }
    
    // 两件上衣组合
    for (const base of baseTops) {
      for (const middle of middleTops) {
        combinations.push([base, middle]);
      }
      for (const outer of outerTops) {
        combinations.push([base, outer]);
      }
    }
    
    for (const middle of middleTops) {
      for (const outer of outerTops) {
        combinations.push([middle, outer]);
      }
    }
    
    // 三件上衣组合
    for (const base of baseTops) {
      for (const middle of middleTops) {
        for (const outer of outerTops) {
          combinations.push([base, middle, outer]);
        }
      }
    }
    
    return combinations;
  }

  /**
   * 生成裤子组合
   */
  private generateBottomsCombinations(): ClothingItem[][] {
    const combinations: ClothingItem[][] = [];
    const regularBottoms = bottoms.filter(item => !item.layer);
    const baseBottoms = bottoms.filter(item => item.layer === 'base');
    
    // 单件裤子
    for (const bottom of bottoms) {
      combinations.push([bottom]);
    }
    
    // 两件裤子组合（秋裤+外裤）
    for (const base of baseBottoms) {
      for (const regular of regularBottoms) {
        combinations.push([base, regular]);
      }
    }
    
    return combinations;
  }

  /**
   * 生成配饰组合
   */
  private generateAccessoriesCombinations(): ClothingItem[][] {
    const combinations: ClothingItem[][] = [];
    const hats = accessories.filter(item => item.accessoryType === 'hat');
    const scarfs = accessories.filter(item => item.accessoryType === 'scarf');
    const gloves = accessories.filter(item => item.accessoryType === 'gloves');
    const socks = accessories.filter(item => item.accessoryType === 'socks');
    
    // 生成所有可能的配饰组合（每种类型最多选一个）
    const hatOptions = [null, ...hats];
    const scarfOptions = [null, ...scarfs];
    const gloveOptions = [null, ...gloves];
    const sockOptions = [null, ...socks];
    
    for (const hat of hatOptions) {
      for (const scarf of scarfOptions) {
        for (const glove of gloveOptions) {
          for (const sock of sockOptions) {
            const combo = [hat, scarf, glove, sock].filter(item => item !== null) as ClothingItem[];
            combinations.push(combo);
          }
        }
      }
    }
    
    return combinations;
  }

  /**
   * 验证组合是否合理
   */
  private isValidCombination(combination: OutfitRecommendation): boolean {
    // 检查保暖值差异
    if (combination.difference > this.config.maxDifference) {
      return false;
    }
    
    // 检查是否有荒谬组合
    if (this.hasAbsurdCombination(combination)) {
      return false;
    }
    
    // 检查叠穿规则
    if (!this.followsLayeringRules(combination)) {
      return false;
    }
    
    return true;
  }

  /**
   * 检查是否有荒谬组合
   */
  private hasAbsurdCombination(combination: OutfitRecommendation): boolean {
    const temp = this.config.temperature;
    
    // 极端温度检查
    if (temp <= 0) {
      // 0度以下必须有厚外套
      const hasThickOuterwear = combination.tops.some(top => 
        ['down-jacket', 'cotton-coat'].includes(top.id)
      );
      if (!hasThickOuterwear) return true;
      
      // 不能穿凉鞋
      if (combination.shoes.id === 'sandals') return true;
    }
    
    if (temp >= 25) {
      // 25度以上不能穿羽绒服或棉服
      const hasHeavyOuterwear = combination.tops.some(top => 
        ['down-jacket', 'cotton-coat'].includes(top.id)
      );
      if (hasHeavyOuterwear) return true;
      
      // 不能穿雪地靴
      if (combination.shoes.id === 'snow-boots') return true;
    }
    
    if (temp >= 20) {
      // 20度以上不穿厚毛衣
      const hasThickSweater = combination.tops.some(top => top.id === 'thick-sweater');
      if (hasThickSweater) return true;
    }
    
    if (temp <= 5) {
      // 5度以下不穿短裤
      const hasShorts = combination.bottoms.some(bottom => bottom.id === 'shorts');
      if (hasShorts) return true;
    }
    
    return false;
  }

  /**
   * 检查是否遵循叠穿规则
   */
  private followsLayeringRules(combination: OutfitRecommendation): boolean {
    // 上衣最多4件
    if (combination.tops.length > 4) return false;
    
    // 裤子最多2件
    if (combination.bottoms.length > 2) return false;
    
    // 配饰类型不能重复（除了不能同时有薄围巾和厚围巾）
    const scarfs = combination.accessories.filter(acc => acc.accessoryType === 'scarf');
    if (scarfs.length > 1) return false;
    
    // 其他配饰类型检查
    const accessoryTypes = combination.accessories.map(acc => acc.accessoryType);
    const uniqueTypes = [...new Set(accessoryTypes)];
    if (accessoryTypes.length !== uniqueTypes.length) return false;
    
    return true;
  }
}