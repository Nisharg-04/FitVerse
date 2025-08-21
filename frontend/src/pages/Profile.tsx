import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Activity, Award, Calendar, Edit, Heart, Target, TrendingUp, User } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getFitnessProfile, updateFitnessProfile } from "@/redux/slices/authSlice";

const Profile = () => {
  const dispatch = useAppDispatch();
    const { user } = useAuth();
    console.log(user);
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFitnessProfile());
  }, [dispatch]);

  const fitnessStats = user?.fitnessStats || {
    workoutStreak: 0,
    caloriesBurned: 0,
    workoutsCompleted: 0,
    achievementsEarned: 0,
    monthlyGoalProgress: 0,
    fitnessLevel: 'Beginner',
    preferredWorkoutTime: 'Morning',
    currentGoals: [],
    memberSince: new Date().toISOString(),
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="relative">
          <img
            src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
          <button 
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full"
            aria-label="Edit profile picture"
          >
            <Edit size={16} />
          </button>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{user?.name || "User Name"}</h1>
              <p className="text-muted-foreground">@{user?.username || "username"}</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            🏋️‍♂️ Fitness enthusiast | Working on becoming the best version of myself
            | Current goal: Build lean muscle mass
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="text-primary" />
            Current Streak
          </h2>
          <div className="text-4xl font-bold text-primary mb-2">
            {fitnessStats.workoutStreak} days
          </div>
          <p className="text-muted-foreground">Keep up the momentum!</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Monthly Goal Progress
          </h2>
          <Progress value={fitnessStats.monthlyGoalProgress} className="mb-2" />
          <p className="text-muted-foreground">{fitnessStats.monthlyGoalProgress}% completed</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="text-primary" />
            Achievements
          </h2>
          <div className="text-4xl font-bold text-primary mb-2">
            {fitnessStats.achievementsEarned}
          </div>
          <p className="text-muted-foreground">Badges earned</p>
        </Card>

        {/* Detailed Stats */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Fitness Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="text-primary" />
                <span className="font-semibold">Total Calories Burned</span>
              </div>
              <p className="text-2xl font-bold">{fitnessStats.caloriesBurned} kcal</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-primary" />
                <span className="font-semibold">Workouts Completed</span>
              </div>
              <p className="text-2xl font-bold">{fitnessStats.workoutsCompleted}</p>
            </div>
          </div>
        </Card>

        {/* Goals */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="text-primary" />
            Current Goals
          </h2>
          <ul className="space-y-4">
            {fitnessStats.currentGoals?.length > 0 ? (
              fitnessStats.currentGoals.map((goal, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span>{goal}</span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">No goals set yet</li>
            )}
          </ul>
        </Card>
      </div>

      {/* Personal Information */}
      <Card className="mt-6 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="text-primary" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email || "email@example.com"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="font-medium">{new Date(fitnessStats.memberSince).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fitness Level</p>
            <p className="font-medium">{fitnessStats.fitnessLevel}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Preferred Workout Time</p>
            <p className="font-medium">{fitnessStats.preferredWorkoutTime}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
