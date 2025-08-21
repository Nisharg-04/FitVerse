import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Footprints, Flame, Clock, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/store/useStore';

const FitnessTracker = () => {
  const { todayStats, fitnessData } = useStore();

  const quickStats = [
    {
      title: 'Steps Today',
      value: todayStats.steps.toLocaleString(),
      target: fitnessData.goals.daily.steps.toLocaleString(),
      icon: Footprints,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      progress: (todayStats.steps / fitnessData.goals.daily.steps) * 100
    },
    {
      title: 'Calories Burned',
      value: todayStats.calories.toLocaleString(),
      target: fitnessData.goals.daily.calories.toLocaleString(),
      icon: Flame,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      progress: (todayStats.calories / fitnessData.goals.daily.calories) * 100
    },
    {
      title: 'Active Minutes',
      value: fitnessData.activeMinutes.toString(),
      target: (fitnessData.goals.weekly.activeMinutes / 7).toFixed(0),
      icon: Clock,
      color: 'text-success',
      bgColor: 'bg-success/10',
      progress: (fitnessData.activeMinutes / (fitnessData.goals.weekly.activeMinutes / 7)) * 100
    },
    {
      title: 'Workouts',
      value: todayStats.workouts.toString(),
      target: '1',
      icon: Activity,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      progress: (todayStats.workouts / 1) * 100
    }
  ];

  const weeklyData = [
    { name: 'Mon', steps: 8500, calories: 320, workouts: 1 },
    { name: 'Tue', steps: 12000, calories: 480, workouts: 1 },
    { name: 'Wed', steps: 9800, calories: 390, workouts: 0 },
    { name: 'Thu', steps: 11200, calories: 420, workouts: 1 },
    { name: 'Fri', steps: 13500, calories: 520, workouts: 1 },
    { name: 'Sat', steps: 15000, calories: 580, workouts: 2 },
    { name: 'Sun', steps: 8547, calories: 340, workouts: 0 }
  ];

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "text-primary" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{Math.round(percentage)}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
            Fitness Tracker
          </h2>
          <p className="text-muted-foreground">Track your daily activity and progress</p>
        </div>

        {/* Circular Progress Rings */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="fitness-card text-center">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <CircularProgress 
                      percentage={Math.min(100, stat.progress)} 
                      color={stat.color}
                    />
                    <div>
                      <div className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <h3 className="font-semibold text-sm">{stat.title}</h3>
                      <p className="text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">of {stat.target}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Weekly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Weekly Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={day.name} className="flex items-center space-x-4">
                    <span className="w-8 text-sm font-medium">{day.name}</span>
                    <div className="flex-1">
                      <Progress value={(day.steps / 15000) * 100} className="h-3" />
                    </div>
                    <span className="text-sm font-medium">{day.steps.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-success" />
                <span>Today's Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Steps</span>
                  <span className="text-sm text-muted-foreground">
                    {todayStats.steps}/{fitnessData.goals.daily.steps}
                  </span>
                </div>
                <Progress value={(todayStats.steps / fitnessData.goals.daily.steps) * 100} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Water</span>
                  <span className="text-sm text-muted-foreground">
                    {todayStats.water}/{fitnessData.goals.daily.water} glasses
                  </span>
                </div>
                <Progress value={(todayStats.water / fitnessData.goals.daily.water) * 100} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm text-muted-foreground">
                    {todayStats.calories}/{fitnessData.goals.daily.calories}
                  </span>
                </div>
                <Progress value={(todayStats.calories / fitnessData.goals.daily.calories) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FitnessTracker;
