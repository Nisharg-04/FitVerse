import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import GymDiscovery from '@/components/dashboard/GymDiscovery';
import FitnessTracker from '@/components/dashboard/FitnessTracker';
import MealAnalyzer from '@/components/dashboard/MealAnalyzer';
import SmartHealth from '@/components/dashboard/SmartHealth';

const Dashboard: React.FC = () => {
  const dashboardTabs = [
    {
      title: "Overview",
      value: "overview",
      content: <DashboardOverview />
    },
    {
      title: "Gym Discovery",
      value: "gyms",
      content: <GymDiscovery />
    },
    {
      title: "Fitness Tracker",
      value: "fitness",
      content: <FitnessTracker />
    },
    {
      title: "Meal Planner",
      value: "meals",
      content: <MealAnalyzer />
    },
    {
      title: "Smart Health",
      value: "health",
      content: <SmartHealth />
    },
    {
      title: "Notifications",
      value: "notifications",
      content: (
        <div className="w-full h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-foreground bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
          <p className="mb-4">Notifications & Alerts</p>
          <div className="text-base font-normal text-muted-foreground">
            <p>Manage your fitness notifications, gym offers, workout reminders, and more.</p>
            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h3 className="font-semibold text-primary">New Gym Nearby! 🏋️</h3>
                <p className="text-sm text-muted-foreground">PowerHouse Fitness just opened 0.3km from your location.</p>
              </div>
              <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                <h3 className="font-semibold text-success">Goal Achieved! 🎯</h3>
                <p className="text-sm text-muted-foreground">You've reached your daily step goal of 10,000 steps!</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Support",
      value: "support",
      content: (
        <div className="w-full h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-foreground bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
          <p className="mb-4">Help & Support</p>
          <div className="text-base font-normal text-muted-foreground">
            <p>Get help with your fitness journey and connect with our support team.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                <h3 className="font-semibold text-primary mb-2">FAQ</h3>
                <p className="text-sm">Find answers to common questions about workouts, nutrition, and app features.</p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-r from-success/5 to-primary/5 border border-success/10">
                <h3 className="font-semibold text-success mb-2">Contact Support</h3>
                <p className="text-sm">Get personalized help from our fitness and technical support team.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              FitVerse Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your complete fitness command center. Track progress, discover gyms, plan meals, and get personalized health insights.
          </p>
        </div>

        {/* Tabs Container */}
        <div className="w-full">
          <Tabs 
            tabs={dashboardTabs} 
            containerClassName="mb-8 px-4"
            contentClassName="mt-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;