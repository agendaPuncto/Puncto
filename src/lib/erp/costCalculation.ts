import { Product } from '@/types/restaurant';
import { InventoryItem } from '@/types/inventory';

export interface RecipeIngredient {
  inventoryItemId: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  productId: string;
  name: string;
  servings: number; // Yield
  ingredients: RecipeIngredient[];
  laborCost?: number; // Estimated prep time cost in cents
  totalCost: number; // Calculated in cents
}

/**
 * Calculate cost per serving for a recipe
 */
export function calculateRecipeCost(
  recipe: Recipe,
  ingredients: Map<string, InventoryItem>
): number {
  let ingredientCost = 0;

  recipe.ingredients.forEach((ingredient) => {
    const item = ingredients.get(ingredient.inventoryItemId);
    if (item) {
      // Convert quantity to match item unit (simplified - in production, handle unit conversions)
      const costPerUnit = item.cost;
      ingredientCost += costPerUnit * ingredient.quantity;
    }
  });

  const laborCost = recipe.laborCost || 0;
  const totalCost = ingredientCost + laborCost;
  const costPerServing = Math.round(totalCost / recipe.servings);

  return costPerServing;
}

/**
 * Calculate suggested price based on target margin
 */
export function calculateSuggestedPrice(
  costPerServing: number,
  targetMargin: number = 0.3 // 30% margin
): number {
  // Price = Cost / (1 - Margin)
  const suggestedPrice = Math.round(costPerServing / (1 - targetMargin));
  return suggestedPrice;
}

/**
 * Calculate cost breakdown for a product
 */
export function calculateCostBreakdown(
  product: Product,
  recipe: Recipe | null,
  ingredients: Map<string, InventoryItem>
): {
  ingredientCost: number;
  laborCost: number;
  totalCost: number;
  currentPrice: number;
  suggestedPrice: number;
  margin: number;
} {
  const ingredientCost = recipe
    ? recipe.ingredients.reduce((sum, ing) => {
        const item = ingredients.get(ing.inventoryItemId);
        return sum + (item ? item.cost * ing.quantity : 0);
      }, 0) / recipe.servings
    : 0;

  const laborCost = recipe?.laborCost ? recipe.laborCost / recipe.servings : 0;
  const totalCost = Math.round(ingredientCost + laborCost);
  const currentPrice = product.price;
  const suggestedPrice = calculateSuggestedPrice(totalCost);
  const margin = currentPrice > 0 ? (currentPrice - totalCost) / currentPrice : 0;

  return {
    ingredientCost: Math.round(ingredientCost),
    laborCost: Math.round(laborCost),
    totalCost,
    currentPrice,
    suggestedPrice,
    margin,
  };
}
