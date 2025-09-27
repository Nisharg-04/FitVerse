import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Apple,
  Plus,
  Camera,
  Utensils,
  PieChart,
  Calendar,
  Target,
  X,
  Zap,
  TrendingUp,
  Edit3,
  Scan,
  History,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import CameraFeed from "../FitnessCameraFeed";

const MealAnalyzer = () => {
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanningFor, setScanningFor] = useState("food");
  const [isAddMealDialogOpen, setIsAddMealDialogOpen] = useState(false);
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [formData, setFormData] = useState({
    consumptionTime: new Date().toISOString().split("T")[0],
    mealType: "Lunch",
    foodItem: "",
    calories: "",
    carbs: "",
    protein: "",
    sugar: "",
    fat: "",
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showHistoryModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset body scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showHistoryModal]);

  const todaysMeals = {
    breakfast: [
      {
        name: "Oatmeal with Berries",
        calories: 350,
        protein: 12,
        carbs: 58,
        fat: 8,
      },
      { name: "Greek Yogurt", calories: 130, protein: 15, carbs: 9, fat: 6 },
    ],
    lunch: [
      {
        name: "Grilled Chicken Salad",
        calories: 420,
        protein: 35,
        carbs: 12,
        fat: 18,
      },
      { name: "Brown Rice", calories: 220, protein: 5, carbs: 45, fat: 2 },
    ],
    dinner: [
      {
        name: "Salmon with Vegetables",
        calories: 380,
        protein: 28,
        carbs: 15,
        fat: 22,
      },
    ],
    snacks: [
      { name: "Almonds", calories: 160, protein: 6, carbs: 6, fat: 14 },
      { name: "Apple", calories: 80, protein: 0, carbs: 21, fat: 0 },
    ],
  };

  const totalCalories = Object.values(todaysMeals)
    .flat()
    .reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = Object.values(todaysMeals)
    .flat()
    .reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = Object.values(todaysMeals)
    .flat()
    .reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = Object.values(todaysMeals)
    .flat()
    .reduce((sum, meal) => sum + meal.fat, 0);

  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
  };

  const mealTimes = [
    { name: "Breakfast", value: "breakfast", icon: "🌅" },
    { name: "Lunch", value: "lunch", icon: "🌞" },
    { name: "Dinner", value: "dinner", icon: "🌙" },
    { name: "Snacks", value: "snacks", icon: "🍎" },
  ];

  const suggestedMeals = [
    {
      name: "Protein Smoothie",
      calories: 250,
      protein: 25,
      description: "Post-workout recovery",
    },
    {
      name: "Quinoa Bowl",
      calories: 380,
      protein: 15,
      description: "High fiber lunch",
    },
    {
      name: "Grilled Fish",
      calories: 320,
      protein: 30,
      description: "Lean dinner option",
    },
  ];

  const handleAddMeal = () => {
    setIsAddMealDialogOpen(true);
  };

  const handleScanFood = () => {
    setIsAddMealDialogOpen(false);
    setScanningFor("food");
    setIsCameraOpen(true);
  };

  const handleManualAdd = () => {
    setIsAddMealDialogOpen(false);
    setIsManualFormOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCloseDialog = () => {
    setIsAddMealDialogOpen(false);
  };

  const handleCloseManualForm = () => {
    setIsManualFormOpen(false);
    setFormData({
      consumptionTime: new Date().toISOString().split("T")[0],
      mealType: "Lunch",
      foodItem: "",
      calories: "",
      carbs: "",
      protein: "",
      sugar: "",
      fat: "",
    });
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    // If history modal is open, refresh the data
    if (showHistoryModal) {
      fetchNutritionHistory();
    }
  };

  // Fetch nutrition history from API
  const fetchNutritionHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch(
        "http://localhost:8000/api/nutrition/getNutritionHistory",
        {
          method: "GET",
          credentials: "include", // Include cookies for session management
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        setNutritionHistory(result.data || []);
      } else {
        throw new Error(result.message || "Failed to fetch nutrition history");
      }
    } catch (error) {
      console.error("Error fetching nutrition history:", error);
      alert(`❌ Failed to load nutrition history: ${error.message}`);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleShowHistory = () => {
    setShowHistoryModal(true);
    fetchNutritionHistory();
  };

  const handleCloseHistory = () => {
    setShowHistoryModal(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmittingManual(true);

      // Prepare data for API
      const nutritionData = {
        consumptionTime: formData.consumptionTime,
        mealType: formData.mealType,
        foodItem: formData.foodItem,
        calories: parseInt(formData.calories),
        carbs: parseFloat(formData.carbs),
        protein: parseFloat(formData.protein),
        sugar: parseFloat(formData.sugar),
        fat: parseFloat(formData.fat),
      };

      console.log("Sending manual meal data:", nutritionData);

      const response = await fetch(
        "http://localhost:8000/api/nutrition/addNutritionManual",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nutritionData),
          credentials: "include", // Include cookies for session management
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("Manual nutrition data sent successfully:", result);

        // Close the form and reset data
        handleCloseManualForm();

        // Show success popup
        setShowSuccessPopup(true);
      } else {
        throw new Error(result.message || "Failed to submit nutrition data");
      }
    } catch (error) {
      console.error("Error submitting manual nutrition data:", error);
      alert(`❌ Failed to submit meal: ${error.message}`);
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const handleCameraSubmit = (imageData: unknown) => {
    // TODO: Handle camera submission - you can process the image data here
    console.log("Camera meal data:", imageData);
  };

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              Meal Analyzer & Planner
            </h2>
            <p className="text-muted-foreground">
              Track nutrition and plan your meals
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleShowHistory}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none hover:from-blue-600 hover:to-indigo-700 shadow-lg"
            >
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
            <Button
              variant="outline"
              onClick={handleAddMeal}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none hover:from-green-600 hover:to-emerald-700 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          </div>
        </div>

        {/* Daily Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="fitness-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCalories}</p>
                  <p className="text-sm text-muted-foreground">
                    of {goals.calories} cal
                  </p>
                </div>
              </div>
              <Progress
                value={(totalCalories / goals.calories) * 100}
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card className="fitness-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalProtein}g</p>
                  <p className="text-sm text-muted-foreground">
                    of {goals.protein}g protein
                  </p>
                </div>
              </div>
              <Progress
                value={(totalProtein / goals.protein) * 100}
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card className="fitness-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Apple className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCarbs}g</p>
                  <p className="text-sm text-muted-foreground">
                    of {goals.carbs}g carbs
                  </p>
                </div>
              </div>
              <Progress
                value={(totalCarbs / goals.carbs) * 100}
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card className="fitness-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalFat}g</p>
                  <p className="text-sm text-muted-foreground">
                    of {goals.fat}g fat
                  </p>
                </div>
              </div>
              <Progress value={(totalFat / goals.fat) * 100} className="mt-3" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meal Logging */}
          <div className="lg:col-span-2">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
                <div className="flex gap-2">
                  {mealTimes.map((meal) => (
                    <Button
                      key={meal.value}
                      variant={
                        selectedMeal === meal.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedMeal(meal.value)}
                    >
                      {meal.icon} {meal.name}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysMeals[selectedMeal as keyof typeof todaysMeals]?.map(
                    (meal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <h4 className="font-medium">{meal.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {meal.calories} cal • {meal.protein}g protein •{" "}
                            {meal.carbs}g carbs • {meal.fat}g fat
                          </p>
                        </div>
                        <Badge variant="secondary">{meal.calories} cal</Badge>
                      </motion.div>
                    )
                  )}

                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Food to{" "}
                    {mealTimes.find((m) => m.value === selectedMeal)?.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Apple className="h-5 w-5 text-green-500" />
                <span>Meal Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestedMeals.map((meal, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10"
                  >
                    <h4 className="font-medium">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {meal.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {meal.calories} cal • {meal.protein}g protein
                      </span>
                      <Button size="sm" variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Meal Options Dialog */}
      <AnimatePresence>
        {isAddMealDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleCloseDialog}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:inset-auto w-full max-w-md bg-background rounded-2xl border border-border/50 shadow-2xl z-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Add Meal
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseDialog}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleScanFood}
                    className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-none shadow-lg"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Camera className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-semibold">Scan Food</div>
                        <div className="text-sm opacity-90">
                          Use camera to capture meal
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={handleManualAdd}
                    variant="outline"
                    className="w-full h-16 border-border/50 hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Edit3 className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-semibold">Add Manually</div>
                        <div className="text-sm text-muted-foreground">
                          Enter meal details by hand
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Manual Meal Form */}
      <AnimatePresence>
        {isManualFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleCloseManualForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-lg lg:h-auto bg-background rounded-2xl border border-border/50 shadow-2xl z-50 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 pb-0 flex-shrink-0">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Add Meal Manually
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseManualForm}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pt-6">
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="consumptionTime"
                          className="text-sm font-medium mb-2 block"
                        >
                          Date
                        </Label>
                        <Input
                          id="consumptionTime"
                          type="date"
                          value={formData.consumptionTime}
                          onChange={(e) =>
                            handleFormChange("consumptionTime", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="mealType"
                          className="text-sm font-medium mb-2 block"
                        >
                          Meal Type
                        </Label>
                        <select
                          id="mealType"
                          value={formData.mealType}
                          onChange={(e) =>
                            handleFormChange("mealType", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          title="Select meal type"
                          aria-label="Select meal type"
                        >
                          <option value="Breakfast">Breakfast</option>
                          <option value="Lunch">Lunch</option>
                          <option value="Dinner">Dinner</option>
                          <option value="Snack">Snack</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="foodItem"
                        className="text-sm font-medium mb-2 block"
                      >
                        Food Item
                      </Label>
                      <Input
                        id="foodItem"
                        type="text"
                        placeholder="e.g., Bhakri"
                        value={formData.foodItem}
                        onChange={(e) =>
                          handleFormChange("foodItem", e.target.value)
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="calories"
                          className="text-sm font-medium mb-2 block"
                        >
                          Calories
                        </Label>
                        <Input
                          id="calories"
                          type="number"
                          placeholder="250"
                          value={formData.calories}
                          onChange={(e) =>
                            handleFormChange("calories", e.target.value)
                          }
                          min="0"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="protein"
                          className="text-sm font-medium mb-2 block"
                        >
                          Protein (g)
                        </Label>
                        <Input
                          id="protein"
                          type="number"
                          placeholder="12"
                          value={formData.protein}
                          onChange={(e) =>
                            handleFormChange("protein", e.target.value)
                          }
                          min="0"
                          step="0.1"
                          required
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="carbs"
                          className="text-sm font-medium mb-2 block"
                        >
                          Carbs (g)
                        </Label>
                        <Input
                          id="carbs"
                          type="number"
                          placeholder="33"
                          value={formData.carbs}
                          onChange={(e) =>
                            handleFormChange("carbs", e.target.value)
                          }
                          min="0"
                          step="0.1"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="fat"
                          className="text-sm font-medium mb-2 block"
                        >
                          Fat (g)
                        </Label>
                        <Input
                          id="fat"
                          type="number"
                          placeholder="14"
                          value={formData.fat}
                          onChange={(e) =>
                            handleFormChange("fat", e.target.value)
                          }
                          min="0"
                          step="0.1"
                          required
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="sugar"
                        className="text-sm font-medium mb-2 block"
                      >
                        Sugar (g)
                      </Label>
                      <Input
                        id="sugar"
                        type="number"
                        placeholder="5"
                        value={formData.sugar}
                        onChange={(e) =>
                          handleFormChange("sugar", e.target.value)
                        }
                        min="0"
                        step="0.1"
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseManualForm}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmittingManual}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        {isSubmittingManual ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          "Add Meal"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleCloseSuccessPopup}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-2xl border border-border/50 shadow-2xl z-50 p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Meal Submitted Successfully!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your nutrition data has been added to your log.
                </p>
                <Button
                  onClick={handleCloseSuccessPopup}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  Great!
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Nutrition History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
            onClick={handleCloseHistory}
            onWheel={(e) => e.preventDefault()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl h-[90vh] bg-background rounded-2xl border border-border/50 shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full min-h-0">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-0 flex-shrink-0 border-b border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <History className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                        Nutrition History
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        View your meal and nutrition tracking history
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseHistory}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 min-h-0">
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-muted-foreground">
                          Loading nutrition history...
                        </span>
                      </div>
                    </div>
                  ) : nutritionHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Utensils className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-medium mb-2">
                        No nutrition history found
                      </h4>
                      <p className="text-muted-foreground">
                        Start tracking your meals to see your history here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {nutritionHistory.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl p-4 border border-border/50 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Left Side - Meal Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <Utensils className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">
                                    {item.foodItem}
                                  </h4>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {item.mealType}
                                    </Badge>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {formatDate(item.consumptionTime)}
                                      </span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{formatTime(item.createdAt)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Side - Nutrition Info */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                              <div className="bg-red-500/10 rounded-lg p-2">
                                <div className="text-lg font-bold text-red-600">
                                  {item.calories}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Calories
                                </div>
                              </div>
                              <div className="bg-blue-500/10 rounded-lg p-2">
                                <div className="text-lg font-bold text-blue-600">
                                  {item.protein}g
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Protein
                                </div>
                              </div>
                              <div className="bg-green-500/10 rounded-lg p-2">
                                <div className="text-lg font-bold text-green-600">
                                  {item.carbs}g
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Carbs
                                </div>
                              </div>
                              <div className="bg-yellow-500/10 rounded-lg p-2">
                                <div className="text-lg font-bold text-yellow-600">
                                  {item.fat}g
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Fat
                                </div>
                              </div>
                              <div className="bg-purple-500/10 rounded-lg p-2">
                                <div className="text-lg font-bold text-purple-600">
                                  {item.sugar}g
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Sugar
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-6 pt-0 border-t border-border/50">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>
                      {nutritionHistory.length > 0
                        ? `Showing ${nutritionHistory.length} meal${
                            nutritionHistory.length !== 1 ? "s" : ""
                          }`
                        : "No meals found"}
                    </span>
                    <Button
                      onClick={handleCloseHistory}
                      variant="outline"
                      size="sm"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Feed Modal */}
      <CameraFeed
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        scanningFor={scanningFor}
        onSubmit={handleCameraSubmit}
      />
    </div>
  );
};

export default MealAnalyzer;
