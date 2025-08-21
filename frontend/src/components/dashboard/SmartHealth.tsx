import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, Target, Award, Moon, Droplets, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const SmartHealth = () => {
  const healthTips = [
    {
      category: 'Hydration',
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      tip: 'You\'re behind on water intake. Aim for 2 more glasses before evening.',
      action: 'Set Reminder'
    },
    {
      category: 'Sleep',
      icon: Moon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      tip: 'Based on your activity, aim for 8 hours of sleep tonight for optimal recovery.',
      action: 'Set Bedtime'
    },
    {
      category: 'Workout',
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      tip: 'Great cardio session today! Consider adding strength training tomorrow.',
      action: 'Plan Workout'
    },
    {
      category: 'Nutrition',
      icon: Target,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      tip: 'You\'re low on protein today. Consider a protein-rich snack.',
      action: 'Suggest Foods'
    }
  ];

  const customPlans = [
    {
      title: 'Morning Boost',
      description: 'Start your day with energy',
      tasks: [
        { name: 'Drink 2 glasses of water', completed: true },
        { name: '10-minute morning walk', completed: true },
        { name: 'Healthy breakfast', completed: false },
        { name: 'Take vitamins', completed: false }
      ],
      progress: 50
    },
    {
      title: 'Afternoon Energy',
      description: 'Maintain momentum throughout the day',
      tasks: [
        { name: 'Take lunch break', completed: false },
        { name: 'Light stretching', completed: false },
        { name: 'Healthy snack', completed: true },
        { name: '5-minute meditation', completed: false }
      ],
      progress: 25
    },
    {
      title: 'Evening Wind Down',
      description: 'Prepare for quality rest',
      tasks: [
        { name: 'Log today\'s meals', completed: false },
        { name: 'Evening workout', completed: false },
        { name: 'Phone away 1hr before bed', completed: false },
        { name: 'Read for 15 minutes', completed: false }
      ],
      progress: 0
    }
  ];

  const achievements = [
    {
      title: 'Hydration Hero',
      description: '7 days of meeting water goals',
      icon: '💧',
      earned: true
    },
    {
      title: 'Step Master',
      description: 'Reached 10K steps 5 days in a row',
      icon: '👟',
      earned: true
    },
    {
      title: 'Consistency King',
      description: 'Logged meals for 14 days straight',
      icon: '📱',
      earned: false
    },
    {
      title: 'Fitness Pioneer',
      description: 'Tried 3 new workouts this month',
      icon: '🏆',
      earned: false
    }
  ];

  const reminders = [
    { text: 'Take your afternoon walk', time: '2:00 PM', enabled: true },
    { text: 'Log your dinner', time: '8:00 PM', enabled: true },
    { text: 'Prepare for bed', time: '10:00 PM', enabled: false },
    { text: 'Morning weigh-in', time: '7:00 AM', enabled: true }
  ];

  const motivationalQuotes = [
    "The groundwork for all happiness is good health. - Leigh Hunt",
    "Health is not about the weight you lose, but about the life you gain.",
    "A healthy outside starts from the inside.",
    "Your body can do it. It's time to convince your mind."
  ];

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
            Smart Health Suggestions
          </h2>
          <p className="text-muted-foreground">AI-powered recommendations based on your activity</p>
        </div>

        {/* Health Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthTips.map((tip, index) => (
            <motion.div
              key={tip.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="fitness-card hover:scale-105 transition-transform duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${tip.bgColor} flex items-center justify-center`}>
                      <tip.icon className={`h-6 w-6 ${tip.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{tip.category}</h3>
                        <Badge variant="secondary">AI</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{tip.tip}</p>
                      <Button size="sm" variant="outline">
                        {tip.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom Plans */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Daily Plans</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customPlans.map((plan, index) => (
                  <div key={plan.title} className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold">{plan.title}</h4>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <Badge variant="secondary">{plan.progress}%</Badge>
                    </div>
                    <div className="space-y-2">
                      {plan.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={task.completed}
                            className="rounded"
                            readOnly
                          />
                          <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements & Reminders */}
          <div className="space-y-6">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-warning" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={achievement.title}
                      className={`p-3 rounded-lg text-center ${
                        achievement.earned 
                          ? 'bg-gradient-to-r from-warning/20 to-warning/10 border border-warning/20' 
                          : 'bg-muted/20 border border-border/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-secondary" />
                  <span>Daily Reminders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reminders.map((reminder, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{reminder.text}</p>
                        <p className="text-xs text-muted-foreground">{reminder.time}</p>
                      </div>
                      <Switch checked={reminder.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Motivational Quote */}
        <Card className="fitness-card bg-gradient-to-r from-primary/10 via-secondary/10 to-success/10 border border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Daily Motivation</h3>
            <p className="text-muted-foreground italic">
              "{motivationalQuotes[new Date().getDay() % motivationalQuotes.length]}"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartHealth;
