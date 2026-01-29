"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Badge } from "@/components/ui";
import type {
    DietaryRestriction,
    CuisineType,
    SpiceLevel,
    CookingTime,
    KitchenEquipment,
    SkillLevel,
    GoalType,
} from "@/types";

// Step configuration
const TOTAL_STEPS = 4;

// Dietary restrictions options
const dietaryOptions: { id: DietaryRestriction; label: string; emoji: string }[] = [
    { id: "vegetarian", label: "Vegetarian", emoji: "🥬" },
    { id: "vegan", label: "Vegan", emoji: "🌱" },
    { id: "gluten-free", label: "Gluten-Free", emoji: "🌾" },
    { id: "dairy-free", label: "Dairy-Free", emoji: "🥛" },
    { id: "keto", label: "Keto", emoji: "🥑" },
    { id: "paleo", label: "Paleo", emoji: "🍖" },
    { id: "halal", label: "Halal", emoji: "☪️" },
    { id: "kosher", label: "Kosher", emoji: "✡️" },
    { id: "nut-free", label: "Nut-Free", emoji: "🥜" },
    { id: "shellfish-free", label: "Shellfish-Free", emoji: "🦐" },
    { id: "low-sodium", label: "Low Sodium", emoji: "🧂" },
    { id: "low-sugar", label: "Low Sugar", emoji: "🍬" },
];

// Cuisine options
const cuisineOptions: { id: CuisineType; label: string; emoji: string }[] = [
    { id: "italian", label: "Italian", emoji: "🍝" },
    { id: "mexican", label: "Mexican", emoji: "🌮" },
    { id: "asian", label: "Asian", emoji: "🍜" },
    { id: "mediterranean", label: "Mediterranean", emoji: "🫒" },
    { id: "american", label: "American", emoji: "🍔" },
    { id: "indian", label: "Indian", emoji: "🍛" },
    { id: "french", label: "French", emoji: "🥐" },
    { id: "japanese", label: "Japanese", emoji: "🍣" },
    { id: "chinese", label: "Chinese", emoji: "🥡" },
    { id: "thai", label: "Thai", emoji: "🍲" },
    { id: "greek", label: "Greek", emoji: "🥙" },
    { id: "korean", label: "Korean", emoji: "🍱" },
];

// Equipment options
const equipmentOptions: { id: KitchenEquipment; label: string; emoji: string }[] = [
    { id: "oven", label: "Oven", emoji: "🔥" },
    { id: "stovetop", label: "Stovetop", emoji: "🍳" },
    { id: "microwave", label: "Microwave", emoji: "📡" },
    { id: "air-fryer", label: "Air Fryer", emoji: "🌪️" },
    { id: "slow-cooker", label: "Slow Cooker", emoji: "🥘" },
    { id: "instant-pot", label: "Instant Pot", emoji: "⚡" },
    { id: "grill", label: "Grill", emoji: "🔥" },
    { id: "blender", label: "Blender", emoji: "🥤" },
    { id: "food-processor", label: "Food Processor", emoji: "⚙️" },
];

// Goal options
const goalOptions: { id: GoalType; label: string; description: string }[] = [
    { id: "weight-loss", label: "Weight Loss", description: "Reduce calories, increase satiety" },
    { id: "muscle-gain", label: "Muscle Gain", description: "High protein, moderate carbs" },
    { id: "maintenance", label: "Maintenance", description: "Balanced nutrition" },
    { id: "heart-health", label: "Heart Health", description: "Low sodium, healthy fats" },
    { id: "diabetes-management", label: "Diabetes Management", description: "Low glycemic, balanced" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);

    // Form state
    const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
    const [allergens, setAllergens] = useState<string>("");
    const [calories, setCalories] = useState(2000);
    const [goalType, setGoalType] = useState<GoalType>("maintenance");
    const [mealsPerDay, setMealsPerDay] = useState(3);
    const [cuisines, setCuisines] = useState<CuisineType[]>([]);
    const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>("medium");
    const [cookingTime, setCookingTime] = useState<CookingTime>("medium");
    const [servings, setServings] = useState(2);
    const [equipment, setEquipment] = useState<KitchenEquipment[]>(["oven", "stovetop", "microwave"]);
    const [skillLevel, setSkillLevel] = useState<SkillLevel>("intermediate");

    const toggleDietaryRestriction = (id: DietaryRestriction) => {
        setDietaryRestrictions((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const toggleCuisine = (id: CuisineType) => {
        setCuisines((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const toggleEquipment = (id: KitchenEquipment) => {
        setEquipment((prev) =>
            prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((prev) => prev + 1);
        } else {
            // Save preferences and redirect to dashboard
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSkip = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((prev) => prev + 1);
        } else {
            router.push("/");
        }
    };

    const handleComplete = async () => {
        // TODO: Save to Supabase
        const preferences = {
            dietary_restrictions: dietaryRestrictions,
            allergens: allergens.split(",").map((a) => a.trim()).filter(Boolean),
            nutritional_goals: {
                calories,
                protein: Math.round(calories * 0.25 / 4), // 25% from protein
                carbs: Math.round(calories * 0.50 / 4), // 50% from carbs
                fat: Math.round(calories * 0.25 / 9), // 25% from fat
                goal_type: goalType,
                meals_per_day: mealsPerDay,
            },
            taste_preferences: {
                cuisines,
                spice_level: spiceLevel,
                cooking_time: cookingTime,
                dislikes: [],
            },
            household_info: {
                servings,
                equipment,
                skill_level: skillLevel,
            },
        };

        console.log("Saving preferences:", preferences);

        // Navigate to generate first recipe
        router.push("/generate?first=true");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Progress Bar */}
            <div className="sticky top-0 z-40 bg-background border-b px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                        Step {currentStep} of {TOTAL_STEPS}
                    </span>
                    <button
                        onClick={handleSkip}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        Skip for now
                    </button>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-5 py-6 overflow-y-auto">
                {/* Step 1: Dietary Restrictions */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-fade-up">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Any dietary restrictions? 🥗
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Select all that apply. We'll make sure your recipes are safe and delicious.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {dietaryOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => toggleDietaryRestriction(option.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                                        dietaryRestrictions.includes(option.id)
                                            ? "border-primary bg-primary/10"
                                            : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <span className="text-2xl">{option.emoji}</span>
                                    <span className="font-medium text-sm">{option.label}</span>
                                    {dietaryRestrictions.includes(option.id) && (
                                        <Check className="w-4 h-4 text-primary ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Any allergies? (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={allergens}
                                onChange={(e) => setAllergens(e.target.value)}
                                placeholder="e.g., peanuts, shellfish, eggs"
                                className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Nutritional Goals */}
                {currentStep === 2 && (
                    <div className="space-y-6 animate-fade-up">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                What are your goals? 🎯
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Help us personalize your nutrition targets.
                            </p>
                        </div>

                        {/* Goal Type */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-foreground">
                                Your primary goal
                            </label>
                            {goalOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setGoalType(option.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                        goalType === option.id
                                            ? "border-primary bg-primary/10"
                                            : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <div className="text-left">
                                        <p className="font-medium">{option.label}</p>
                                        <p className="text-sm text-muted-foreground">{option.description}</p>
                                    </div>
                                    {goalType === option.id && (
                                        <Check className="w-5 h-5 text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Calorie Target */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Daily calorie target: <span className="text-primary font-bold">{calories} kcal</span>
                            </label>
                            <input
                                type="range"
                                min={1200}
                                max={4000}
                                step={100}
                                value={calories}
                                onChange={(e) => setCalories(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>1200</span>
                                <span>4000</span>
                            </div>
                        </div>

                        {/* Meals per day */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Meals per day
                            </label>
                            <div className="flex gap-2">
                                {[2, 3, 4, 5, 6].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setMealsPerDay(num)}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl border-2 font-medium transition-all",
                                            mealsPerDay === num
                                                ? "border-primary bg-primary text-white"
                                                : "border-muted hover:border-primary/50"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Taste Preferences */}
                {currentStep === 3 && (
                    <div className="space-y-6 animate-fade-up">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                What do you love to eat? 😋
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Select your favorite cuisines and preferences.
                            </p>
                        </div>

                        {/* Cuisines */}
                        <div className="grid grid-cols-3 gap-2">
                            {cuisineOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => toggleCuisine(option.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                        cuisines.includes(option.id)
                                            ? "border-primary bg-primary/10"
                                            : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <span className="text-3xl">{option.emoji}</span>
                                    <span className="text-xs font-medium">{option.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Spice Level */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Spice tolerance 🌶️
                            </label>
                            <div className="flex gap-2">
                                {(["mild", "medium", "hot"] as SpiceLevel[]).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSpiceLevel(level)}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl border-2 font-medium capitalize transition-all",
                                            spiceLevel === level
                                                ? "border-primary bg-primary text-white"
                                                : "border-muted hover:border-primary/50"
                                        )}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cooking Time */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                How much time do you have? ⏱️
                            </label>
                            <div className="space-y-2">
                                {[
                                    { id: "quick" as CookingTime, label: "Quick", desc: "Under 30 minutes" },
                                    { id: "medium" as CookingTime, label: "Medium", desc: "30-60 minutes" },
                                    { id: "elaborate" as CookingTime, label: "Elaborate", desc: "Over 60 minutes" },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setCookingTime(option.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                            cookingTime === option.id
                                                ? "border-primary bg-primary/10"
                                                : "border-muted hover:border-primary/50"
                                        )}
                                    >
                                        <div className="text-left">
                                            <p className="font-medium">{option.label}</p>
                                            <p className="text-sm text-muted-foreground">{option.desc}</p>
                                        </div>
                                        {cookingTime === option.id && (
                                            <Check className="w-5 h-5 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Household Info */}
                {currentStep === 4 && (
                    <div className="space-y-6 animate-fade-up">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Almost there! 🏠
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Tell us about your kitchen and cooking style.
                            </p>
                        </div>

                        {/* Servings */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                How many people do you usually cook for?
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 4, 6].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setServings(num)}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl border-2 font-medium transition-all",
                                            servings === num
                                                ? "border-primary bg-primary text-white"
                                                : "border-muted hover:border-primary/50"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Equipment */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                What equipment do you have?
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {equipmentOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => toggleEquipment(option.id)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                            equipment.includes(option.id)
                                                ? "border-primary bg-primary/10"
                                                : "border-muted hover:border-primary/50"
                                        )}
                                    >
                                        <span className="text-2xl">{option.emoji}</span>
                                        <span className="text-xs font-medium text-center">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Skill Level */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Your cooking skill level
                            </label>
                            <div className="space-y-2">
                                {[
                                    { id: "beginner" as SkillLevel, label: "Beginner", desc: "Just starting out" },
                                    { id: "intermediate" as SkillLevel, label: "Intermediate", desc: "Comfortable with basics" },
                                    { id: "advanced" as SkillLevel, label: "Advanced", desc: "Love a challenge" },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSkillLevel(option.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                            skillLevel === option.id
                                                ? "border-primary bg-primary/10"
                                                : "border-muted hover:border-primary/50"
                                        )}
                                    >
                                        <div className="text-left">
                                            <p className="font-medium">{option.label}</p>
                                            <p className="text-sm text-muted-foreground">{option.desc}</p>
                                        </div>
                                        {skillLevel === option.id && (
                                            <Check className="w-5 h-5 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="sticky bottom-0 bg-background border-t p-4 flex gap-3">
                {currentStep > 1 && (
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleBack}
                        className="flex-1"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                )}
                <Button
                    size="lg"
                    onClick={handleNext}
                    className="flex-1"
                >
                    {currentStep === TOTAL_STEPS ? (
                        <>
                            <ChefHat className="w-4 h-4 mr-2" />
                            Start Cooking!
                        </>
                    ) : (
                        <>
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
