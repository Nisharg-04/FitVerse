import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Plus, Camera, Utensils, PieChart, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const MealAnalyzer = () => {
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  const todaysMeals = {
    breakfast: [
      { name: 'Oatmeal with Berries', calories: 350, protein: 12, carbs: 58, fat: 8 },
      { name: 'Greek Yogurt', calories: 130, protein: 15, carbs: 9, fat: 6 }
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', calories: 420, protein: 35, carbs: 12, fat: 18 },
      { name: 'Brown Rice', calories: 220, protein: 5, carbs: 45, fat: 2 }
    ],
    dinner: [
      { name: 'Salmon with Vegetables', calories: 380, protein: 28, carbs: 15, fat: 22 }
    ],
    snacks: [
      { name: 'Almonds', calories: 160, protein: 6, carbs: 6, fat: 14 },
      { name: 'Apple', calories: 80, protein: 0, carbs: 21, fat: 0 }
    ]
  };

  const totalCalories = Object.values(todaysMeals).flat().reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = Object.values(todaysMeals).flat().reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = Object.values(todaysMeals).flat().reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = Object.values(todaysMeals).flat().reduce((sum, meal) => sum + meal.fat, 0);

  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  };

  const mealTimes = [
    { name: 'Breakfast', value: 'breakfast', icon: '🌅' },
    { name: 'Lunch', value: 'lunch', icon: '🌞' },
    { name: 'Dinner', value: 'dinner', icon: '🌙' },
    { name: 'Snacks', value: 'snacks', icon: '🍎' }
  ];

  const suggestedMeals = [
    { name: 'Protein Smoothie', calories: 250, protein: 25, description: 'Post-workout recovery' },
    { name: 'Quinoa Bowl', calories: 380, protein: 15, description: 'High fiber lunch' },
    { name: 'Grilled Fish', calories: 320, protein: 30, description: 'Lean dinner option' }
  ];

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              Meal Analyzer & Planner
            </h2>
            <p className="text-muted-foreground">Track nutrition and plan your meals</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Scan Food
            </Button>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Log Meal
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
                  <p className="text-sm text-muted-foreground">of {goals.calories} cal</p>
                </div>
              </div>
              <Progress value={(totalCalories / goals.calories) * 100} className="mt-3" />
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
                  <p className="text-sm text-muted-foreground">of {goals.protein}g protein</p>
                </div>
              </div>
              <Progress value={(totalProtein / goals.protein) * 100} className="mt-3" />
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
                  <p className="text-sm text-muted-foreground">of {goals.carbs}g carbs</p>
                </div>
              </div>
              <Progress value={(totalCarbs / goals.carbs) * 100} className="mt-3" />
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
                  <p className="text-sm text-muted-foreground">of {goals.fat}g fat</p>
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
                      variant={selectedMeal === meal.value ? "default" : "outline"}
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
                  {todaysMeals[selectedMeal as keyof typeof todaysMeals]?.map((meal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <h4 className="font-medium">{meal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {meal.calories} cal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                        </p>
                      </div>
                      <Badge variant="secondary">{meal.calories} cal</Badge>
                    </motion.div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Food to {mealTimes.find(m => m.value === selectedMeal)?.name}
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
                  <div key={index} className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                    <h4 className="font-medium">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{meal.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{meal.calories} cal • {meal.protein}g protein</span>
                      <Button size="sm" variant="outline">Add</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Planner */}
        <Card className="fitness-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Weekly Meal Planner</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center p-4 rounded-lg border border-border/50">
                  <h4 className="font-medium mb-2">{day}</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-primary/10 rounded">Breakfast</div>
                    <div className="p-2 bg-secondary/10 rounded">Lunch</div>
                    <div className="p-2 bg-success/10 rounded">Dinner</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealAnalyzer;
