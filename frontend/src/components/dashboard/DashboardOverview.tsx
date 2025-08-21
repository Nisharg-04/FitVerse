import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Flame, 
  Footprints, 
  Clock,
  MapPin,
  Trophy,
  Zap,
  Apple
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/store/useStore';
const DashboardOverview = () => {
  const { user, fitnessData, todayStats, checkedInGym } = useStore();

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-light to-secondary p-8 text-white"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-primary-foreground/80 mb-4">
              Ready to crush your fitness goals today?
            </p>
            {checkedInGym ? (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Currently at {checkedInGym.name}</span>
              </div>
            ) : (
              <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Find Nearby Gyms
              </Button>
            )}
          </div>
          
          {/* Animated Background Elements */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-white/10 animate-pulse-soft" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5 animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat, index) => (
            <motion.div key={stat.title} variants={item}>
              <Card className="fitness-card hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">of {stat.target}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{stat.title}</span>
                      <span className={stat.color}>{Math.min(100, stat.progress).toFixed(0)}%</span>
                    </div>
                    <Progress value={Math.min(100, stat.progress)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Goals */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
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

                <Button className="w-full btn-gradient mt-4">
                  <Zap className="h-4 w-4 mr-2" />
                  Log Workout
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-3" />
                  Check into Gym
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Apple className="h-4 w-4 mr-3" />
                  Log Meal
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-3" />
                  Start Workout
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-3" />
                  View Progress
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-warning" />
                <span>Recent Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="fitness-card bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                      <Footprints className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="font-semibold">10K Steps</p>
                      <p className="text-sm text-muted-foreground">Completed 3 days in a row</p>
                    </div>
                  </div>
                </div>

                <div className="fitness-card bg-gradient-to-r from-success/10 to-success/5 border border-success/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold">Workout Streak</p>
                      <p className="text-sm text-muted-foreground">5 days in a row</p>
                    </div>
                  </div>
                </div>

                <div className="fitness-card bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Goal Master</p>
                      <p className="text-sm text-muted-foreground">Hit all weekly targets</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;
