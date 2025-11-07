import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Users,
  DollarSign,
  CheckCircle2,
  Dumbbell,
  Clock,
  Wallet,
} from "lucide-react";
import GymQrDisplay from "../components/GymQrDisplay";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import { useCallback } from "react";

interface GymStats {
  gymName: string;
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  todayCheckins: number;
  totalCheckins: number;
  trainers: number;
  classes: number;
}

interface Checkin {
  name: string;
  time: string;
  avatar?: string;
}

interface GymClass {
  title: string;
  time: string;
  trainer: string;
  trainerAvatar?: string;
}

// Mock API calls
const fetchGymStats = async (): Promise<GymStats> => {
  // Replace with real API call
  return {
    gymName: "FitVerse Gym",
    totalMembers: 120,
    activeMembers: 95,
    totalRevenue: 54000,
    todayCheckins: 38,
    totalCheckins: 12000,
    trainers: 8,
    classes: 5,
  };
};

const fetchRecentCheckins = async (gymId?: string): Promise<Checkin[]> => {
  try {
    if (!gymId) {
      return [];
    }
    const { data } = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/payment/getGymAccessHistoryForGym/${gymId}`,
      { withCredentials: true }
    );

    console.log("Gym Access History:", data.data);

    // Map API response to Checkin format
    const checkins: Checkin[] = (data.data || [])
      .slice(0, 5)
      .map((access: Record<string, unknown>) => ({
        name:
          ((access.userDetails as Record<string, unknown>)?.name as string) ||
          "Anonymous",
        time: new Date(access.accessTime as string).toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        avatar:
          ((access.user as Record<string, unknown>)?.profileImage as string) ||
          undefined,
      }));

    return checkins;
  } catch (error) {
    console.error("Error fetching recent checkins:", error);
    // Return empty array on error
    return [];
  }
};

const fetchUpcomingClasses = async (): Promise<GymClass[]> => {
  // Replace with real API call
  return [
    { title: "Yoga", time: "10:00 AM", trainer: "Anna" },
    { title: "HIIT", time: "11:00 AM", trainer: "Mike" },
    { title: "Zumba", time: "12:00 PM", trainer: "Sara" },
  ];
};

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </div>
    </div>
  </Card>
);

const GymDashboard = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const id = gymId;
  const navigate = useNavigate();
  const [stats, setStats] = useState<GymStats | null>(null);
  const [recentCheckins, setRecentCheckins] = useState<Checkin[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [gymBalance, setGymBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [statsData, checkins, classes] = await Promise.all([
        fetchGymStats(),
        fetchRecentCheckins(id),
        fetchUpcomingClasses(),
      ]);
      setStats(statsData);
      setRecentCheckins(checkins);
      setUpcomingClasses(classes);
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  // Fetch gym balance on mount
  const fetchGymBalance = useCallback(async () => {
    try {
      setBalanceLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/payment/getGymBalance/${id}`,
        { withCredentials: true }
      );
      console.log("Gym Balance:", data);
      setGymBalance(data.data?.balance || 0);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : "Failed to fetch gym balance";
      console.error("Error fetching gym balance:", error);
      // Silently handle error
    } finally {
      setBalanceLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGymBalance();
  }, [fetchGymBalance]);

  if (loading || !stats)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-6 justify-center">
      <div className="flex justify-between items-start mb-8 gap-4">
        {/* Right: Title and Buttons */}
        <div className="flex-1 justify-center">
          <h1 className="text-4xl font-bold mb-4">{stats.gymName} Dashboard</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/manage-advertisements")}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Manage Ads
            </Button>
            <Button
              onClick={() => navigate("/add-new-gym")}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Add New Gym
            </Button>
          </div>
        </div>
      </div>
      {/* Left: Gym Balance Card */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4 backdrop-blur-sm w-64">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gym Balance</p>
              <div className="flex items-center gap-2 mt-1">
                {balanceLoading ? (
                  <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-primary">
                    ₹{gymBalance?.toFixed(2) || "0.00"}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={fetchGymBalance}
              variant="ghost"
              size="sm"
              disabled={balanceLoading}
              className="text-primary hover:bg-primary/10"
            >
              {balanceLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-6">
        <GymQrDisplay id={id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6 text-white" />}
          label="Total Members"
          value={stats.totalMembers}
          color="bg-blue-500"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-white" />}
          label="Active Members"
          value={stats.activeMembers}
          color="bg-green-500"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          label="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          color="bg-yellow-500"
        />
        <StatCard
          icon={<Activity className="w-6 h-6 text-white" />}
          label="Today's Check-ins"
          value={stats.todayCheckins}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Check-ins</h2>
          <ScrollArea className="h-[300px]">
            {recentCheckins.map((checkin, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={checkin.avatar} />
                    <AvatarFallback>{checkin.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{checkin.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {checkin.time}
                    </p>
                  </div>
                </div>
                {idx < recentCheckins.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </ScrollArea>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Classes</h2>
          <ScrollArea className="h-[300px]">
            {upcomingClasses.map((cls, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={cls.trainerAvatar} />
                    <AvatarFallback>
                      <Dumbbell className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{cls.title}</p>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {cls.time} - Trainer: {cls.trainer}
                    </p>
                  </div>
                </div>
                {idx < upcomingClasses.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </ScrollArea>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Gym Details</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Total Check-ins
              </p>
              <p className="text-2xl font-bold">{stats.totalCheckins}</p>
              <Progress value={75} className="mt-2" />
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Number of Trainers
              </p>
              <p className="text-2xl font-bold">{stats.trainers}</p>
              <Progress value={90} className="mt-2" />
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Active Classes
              </p>
              <p className="text-2xl font-bold">{stats.classes}</p>
              <Progress value={60} className="mt-2" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GymDashboard;
