import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function TimelineSection() {
  const data = [
    {
      title: "Week 1-2",
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">Foundation Building</h3>
          <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
            Start your fitness journey with proper form, basic movements, and building healthy habits.
            Download FitVerse and create your personalized fitness profile.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Basic Form Training</span>
                </div>
                <p className="text-xs text-muted-foreground">Master fundamental movements</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Nutrition Tracking</span>
                </div>
                <p className="text-xs text-muted-foreground">Log meals and understand macros</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Goal Setting</span>
                </div>
                <p className="text-xs text-muted-foreground">Define clear, achievable targets</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Sleep Optimization</span>
                </div>
                <p className="text-xs text-muted-foreground">Establish 7-9 hours sleep routine</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Week 3-8",
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">Habit Formation</h3>
          <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
            Build consistency and start seeing real progress. Use FitVerse's QR check-in feature to 
            discover new gyms and maintain accountability through our community features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Progressive Overload</span>
                </div>
                <p className="text-xs text-muted-foreground">Gradually increase intensity</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Community Engagement</span>
                </div>
                <p className="text-xs text-muted-foreground">Join challenges and connect</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Meal Planning</span>
                </div>
                <p className="text-xs text-muted-foreground">AI-powered nutrition insights</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Progress Tracking</span>
                </div>
                <p className="text-xs text-muted-foreground">Monitor improvements weekly</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Week 9-16",
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">Transformation Phase</h3>
          <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
            See significant changes in strength, endurance, and body composition. 
            Utilize FitVerse's advanced analytics to optimize your training and nutrition.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Advanced Workouts</span>
                </div>
                <p className="text-xs text-muted-foreground">Complex movement patterns</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Body Composition</span>
                </div>
                <p className="text-xs text-muted-foreground">Visible muscle definition</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Mental Resilience</span>
                </div>
                <p className="text-xs text-muted-foreground">Enhanced mental strength</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Lifestyle Integration</span>
                </div>
                <p className="text-xs text-muted-foreground">Fitness becomes second nature</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Month 4+",
      content: (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">Mastery & Maintenance</h3>
          <p className="mb-8 text-xs font-normal text-muted-foreground md:text-sm">
            Achieve your transformation goals and maintain them long-term. Become a FitVerse 
            ambassador and inspire others in their fitness journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Goal Achievement</span>
                </div>
                <p className="text-xs text-muted-foreground">Reach your transformation targets</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Inspire Others</span>
                </div>
                <p className="text-xs text-muted-foreground">Share your success story</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Advanced Goals</span>
                </div>
                <p className="text-xs text-muted-foreground">Set new challenges</p>
              </CardContent>
            </Card>
            <Card className="fitness-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Lifestyle Coach</span>
                </div>
                <p className="text-xs text-muted-foreground">Help others transform</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className=" bg-muted/50">
      <div className="relative w-full overflow-clip">
        <Timeline data={data} />
      </div>
    </section>
  );
}