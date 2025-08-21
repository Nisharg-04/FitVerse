import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Clock
} from "lucide-react";

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

const fetchRecentCheckins = async (): Promise<Checkin[]> => {
  // Replace with real API call
  return [
    { name: "John Doe", time: "09:15 AM" },
    { name: "Jane Smith", time: "09:10 AM" },
    { name: "Alex Johnson", time: "08:55 AM" },
    { name: "Emily Brown", time: "08:40 AM" },
    { name: "Chris Lee", time: "08:30 AM" },
  ];
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
        <div className={`p-2 rounded-full ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </div>
    </div>
  </Card>
);

const GymDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<GymStats | null>(null);
  const [recentCheckins, setRecentCheckins] = useState<Checkin[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [statsData, checkins, classes] = await Promise.all([
        fetchGymStats(),
        fetchRecentCheckins(),
        fetchUpcomingClasses(),
      ]);
      setStats(statsData);
      setRecentCheckins(checkins);
      setUpcomingClasses(classes);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading || !stats)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{stats.gymName} Dashboard</h1>
        <Button 
          onClick={() => navigate('/add-new-gym')} 
          className="bg-primary text-white hover:bg-primary/90"
        >
          Add New Gym
        </Button>
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
                    <p className="text-sm text-muted-foreground">{checkin.time}</p>
                  </div>
                </div>
                {idx < recentCheckins.length - 1 && <Separator className="mt-4" />}
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
                    <AvatarFallback><Dumbbell className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{cls.title}</p>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {cls.time} - Trainer: {cls.trainer}
                    </p>
                  </div>
                </div>
                {idx < upcomingClasses.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </ScrollArea>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Gym Details</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Check-ins</p>
              <p className="text-2xl font-bold">{stats.totalCheckins}</p>
              <Progress value={75} className="mt-2" />
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Number of Trainers</p>
              <p className="text-2xl font-bold">{stats.trainers}</p>
              <Progress value={90} className="mt-2" />
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Active Classes</p>
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