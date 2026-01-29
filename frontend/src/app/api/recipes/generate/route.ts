import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// Types
interface RecipeGenerationRequest {
    meal_type?: string;
    cuisine_preference?: string;
    cooking_time?: string;
    specific_ingredients?: string[];
    exclude_ingredients?: string[];
    calorie_range?: { min: number; max: number };
    servings?: number;
    user_preferences?: {
        dietary_restrictions?: string[];
        allergens?: string[];
        skill_level?: string;
        equipment?: string[];
    };
}

interface GeneratedRecipe {
    title: string;
    description: string;
    cuisine_type: string;
    prep_time: number;
    cook_time: number;
    servings: number;
    difficulty: string;
    ingredients: Array<{ name: string; amount: number; unit: string }>;
    instructions: string[];
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
    };
    dietary_tags: string[];
    cost_estimate: number;
    match_percentage: number;
}

const USE_AI = process.env.OPENAI_API_KEY ? true : false;

export async function POST(request: NextRequest) {
    try {
        const body: RecipeGenerationRequest = await request.json();

        // If no API key, use mock data
        if (!USE_AI) {
            return NextResponse.json({
                success: true,
                data: {
                    recipes: getMockRecipes(body),
                    generation_id: `gen_${Date.now()}`,
                    source: "mock",
                },
            });
        }

        // Generate with AI
        const recipes = await generateRecipesWithAI(body);

        return NextResponse.json({
            success: true,
            data: {
                recipes,
                generation_id: `gen_${Date.now()}`,
                source: "ai",
            },
        });
    } catch (error) {
        console.error("Recipe generation error:", error);

        // Fallback to mock data on error
        return NextResponse.json({
            success: true,
            data: {
                recipes: getMockRecipes({} as RecipeGenerationRequest),
                generation_id: `gen_${Date.now()}`,
                source: "fallback",
            },
        });
    }
}

async function generateRecipesWithAI(body: RecipeGenerationRequest): Promise<GeneratedRecipe[]> {
    const prompt = buildPrompt(body);

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { text } = await generateText({
            model: openai("gpt-4o-mini") as any,
            prompt,
            temperature: 0.7,
            maxTokens: 4000,
        });

        // Parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("No valid JSON found in response");
    } catch (err) {
        console.error("Failed to generate with AI:", err);
        return getMockRecipes(body);
    }
}

function buildPrompt(body: RecipeGenerationRequest): string {
    const constraints = [];

    if (body.meal_type) constraints.push(`Meal type: ${body.meal_type}`);
    if (body.cuisine_preference) constraints.push(`Cuisine: ${body.cuisine_preference}`);
    if (body.cooking_time) constraints.push(`Max cooking time: ${body.cooking_time}`);
    if (body.servings) constraints.push(`Servings: ${body.servings}`);
    if (body.specific_ingredients?.length) {
        constraints.push(`Must include ingredients: ${body.specific_ingredients.join(", ")}`);
    }
    if (body.exclude_ingredients?.length) {
        constraints.push(`Must NOT include: ${body.exclude_ingredients.join(", ")}`);
    }
    if (body.calorie_range) {
        constraints.push(`Calorie range: ${body.calorie_range.min}-${body.calorie_range.max} calories per serving`);
    }
    if (body.user_preferences?.dietary_restrictions?.length) {
        constraints.push(`Dietary restrictions: ${body.user_preferences.dietary_restrictions.join(", ")}`);
    }
    if (body.user_preferences?.allergens?.length) {
        constraints.push(`Allergens to avoid: ${body.user_preferences.allergens.join(", ")}`);
    }
    if (body.user_preferences?.skill_level) {
        constraints.push(`Cooking skill level: ${body.user_preferences.skill_level}`);
    }

    return `You are a professional chef and nutritionist. Generate 3 unique, delicious recipes based on the following requirements:

${constraints.length > 0 ? constraints.join("\n") : "No specific constraints - suggest popular healthy recipes."}

Return ONLY a valid JSON array with exactly 3 recipes in this format:
[
  {
    "title": "Recipe Name",
    "description": "Brief appetizing description (1-2 sentences)",
    "cuisine_type": "cuisine type",
    "prep_time": number in minutes,
    "cook_time": number in minutes,
    "servings": ${body.servings || 2},
    "difficulty": "easy" | "medium" | "hard",
    "ingredients": [
      { "name": "Ingredient", "amount": number, "unit": "unit" }
    ],
    "instructions": ["Step 1...", "Step 2..."],
    "nutrition": {
      "calories": number per serving,
      "protein": grams,
      "carbs": grams,
      "fat": grams,
      "fiber": grams
    },
    "dietary_tags": ["vegetarian", "gluten-free", etc],
    "cost_estimate": estimated cost in USD,
    "match_percentage": 85-99 based on how well it matches requirements
  }
]

Ensure all nutrition values are realistic and accurate. Make the recipes practical for home cooking.`;
}

function getMockRecipes(body: RecipeGenerationRequest): GeneratedRecipe[] {
    const recipes: GeneratedRecipe[] = [
        {
            title: "Mediterranean Quinoa Bowl",
            description: "A vibrant, protein-packed bowl with fresh vegetables and tangy feta",
            cuisine_type: "mediterranean",
            prep_time: 15,
            cook_time: 20,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Quinoa", amount: 1, unit: "cups" },
                { name: "Cherry Tomatoes", amount: 1, unit: "cups" },
                { name: "Cucumber", amount: 1, unit: "whole" },
                { name: "Red Onion", amount: 0.5, unit: "whole" },
                { name: "Feta Cheese", amount: 0.5, unit: "cups" },
                { name: "Olive Oil", amount: 3, unit: "tablespoons" },
                { name: "Lemon Juice", amount: 2, unit: "tablespoons" },
                { name: "Fresh Parsley", amount: 0.25, unit: "cups" },
            ],
            instructions: [
                "Rinse quinoa under cold water and cook according to package instructions.",
                "While quinoa cooks, dice cucumber, halve cherry tomatoes, and thinly slice red onion.",
                "Make dressing by whisking together olive oil and lemon juice with salt and pepper.",
                "Let quinoa cool slightly, then combine with vegetables in a large bowl.",
                "Drizzle with dressing, top with crumbled feta and fresh parsley.",
                "Serve immediately or refrigerate for a cold salad.",
            ],
            nutrition: {
                calories: 380,
                protein: 14,
                carbs: 42,
                fat: 18,
                fiber: 6,
            },
            dietary_tags: ["vegetarian", "gluten-free"],
            cost_estimate: 8.50,
            match_percentage: 95,
        },
        {
            title: "Honey Garlic Salmon",
            description: "Perfectly glazed salmon with a sweet and savory honey garlic sauce",
            cuisine_type: "asian",
            prep_time: 10,
            cook_time: 15,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Salmon Fillets", amount: 2, unit: "pieces" },
                { name: "Honey", amount: 3, unit: "tablespoons" },
                { name: "Soy Sauce", amount: 2, unit: "tablespoons" },
                { name: "Garlic Cloves", amount: 4, unit: "cloves" },
                { name: "Olive Oil", amount: 1, unit: "tablespoons" },
                { name: "Green Onions", amount: 2, unit: "whole" },
            ],
            instructions: [
                "Pat salmon fillets dry and season with salt and pepper.",
                "Mix honey, soy sauce, and minced garlic in a small bowl.",
                "Heat olive oil in an oven-safe skillet over medium-high heat.",
                "Sear salmon skin-side up for 3 minutes until golden.",
                "Flip salmon, pour honey garlic sauce around it.",
                "Transfer to 400°F oven and bake 8-10 minutes until cooked through.",
                "Garnish with sliced green onions and serve.",
            ],
            nutrition: {
                calories: 420,
                protein: 35,
                carbs: 22,
                fat: 20,
                fiber: 1,
            },
            dietary_tags: ["high-protein", "dairy-free"],
            cost_estimate: 14.00,
            match_percentage: 88,
        },
        {
            title: "Chickpea Curry",
            description: "Creamy coconut curry with tender chickpeas and aromatic spices",
            cuisine_type: "indian",
            prep_time: 10,
            cook_time: 25,
            servings: body.servings || 4,
            difficulty: "easy",
            ingredients: [
                { name: "Chickpeas (canned)", amount: 2, unit: "cups" },
                { name: "Coconut Milk", amount: 1, unit: "cups" },
                { name: "Diced Tomatoes", amount: 1, unit: "cups" },
                { name: "Onion", amount: 1, unit: "whole" },
                { name: "Garlic Cloves", amount: 3, unit: "cloves" },
                { name: "Curry Powder", amount: 2, unit: "tablespoons" },
                { name: "Fresh Spinach", amount: 2, unit: "cups" },
                { name: "Basmati Rice", amount: 1, unit: "cups" },
            ],
            instructions: [
                "Cook basmati rice according to package instructions.",
                "Sauté diced onion in oil until softened, about 5 minutes.",
                "Add minced garlic and curry powder, cook 1 minute until fragrant.",
                "Add diced tomatoes and cook 3 minutes.",
                "Stir in chickpeas and coconut milk, simmer 15 minutes.",
                "Add spinach and cook until wilted, about 2 minutes.",
                "Serve curry over rice, garnished with fresh cilantro.",
            ],
            nutrition: {
                calories: 340,
                protein: 12,
                carbs: 48,
                fat: 12,
                fiber: 9,
            },
            dietary_tags: ["vegan", "dairy-free", "high-fiber"],
            cost_estimate: 6.00,
            match_percentage: 92,
        },
    ];

    // Filter by cuisine if specified
    if (body.cuisine_preference) {
        return recipes.filter(r => r.cuisine_type === body.cuisine_preference);
    }

    return recipes;
}
