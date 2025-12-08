import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Download,
  Users,
  DollarSign,
  Activity,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import GymQrDisplay from "../components/GymQrDisplay";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";

// Type definitions for API responses
interface GymInfo {
  _id: string;
  gymName: string;
  location: string;
  owner: string;
  createdAt: string;
}

interface OverviewData {
  today: { visits: number; revenue: number };
  thisMonth: { visits: number; revenue: number };
  thisYear: { visits: number; revenue: number };
  allTime: { visits: number; revenue: number };
}

interface AnalyticsPoint {
  period: string;
  visits: number;
  revenue: number;
  uniqueUsers: number;
  averageAmount: number;
}

interface GymUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  visitCount: number;
  totalSpent: number;
  averageSpent: number;
  firstVisit: string;
  lastVisit: string;
}

interface RecentActivity {
  _id: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  accessTime: string;
  amount: number;
}

interface GymPayment {
  _id: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  amount: number;
  paymentDate: string;
  transactionId?: string;
}

interface ExportData {
  startDate: string;
  endDate: string;
  totalVisits: number;
  totalRevenue: number;
  uniqueUsers: number;
  averageRevenuePerVisit: number;
}

interface RevenuePeriod {
  total: number;
  count: number;
}

interface GymPaymentHistory {
  _id: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  amount: number;
  paymentDate: string;
  transactionId?: string;
}

interface RevenueDataResponse {
  breakdown: {
    today: RevenuePeriod;
    thisWeek: RevenuePeriod;
    thisMonth: RevenuePeriod;
    thisYear: RevenuePeriod;
    allTime: RevenuePeriod;
  };
  gymPayments: {
    history: GymPaymentHistory[];
    pending: number;
    totalPaid: number;
  };
}

interface DashboardResponse {
  success: boolean;
  data: {
    gymInfo: GymInfo;
    overview: OverviewData;
    analytics: AnalyticsPoint[];
    users: GymUser[];
    recentActivities: RecentActivity[];
    payments: GymPayment[];
  };
  message: string;
}

// Helper function for CSV export
const downloadCSV = (
  data: AnalyticsPoint[] | ExportData | ExportData[] | Record<string, unknown>,
  filename: string
) => {
  // Determine if this is analytics data or export summary data
  const isAnalyticsData =
    Array.isArray(data) &&
    data.length > 0 &&
    data[0] &&
    typeof data[0] === "object" &&
    "period" in data[0];

  let csv = "";

  if (isAnalyticsData) {
    // Export analytics data with detailed rows
    const analyticsData = data as AnalyticsPoint[];
    const headers = [
      "Period",
      "Visits",
      "Revenue",
      "Unique Users",
      "Average Amount",
    ];

    const rows = analyticsData.map((item) => [
      item.period || "",
      item.visits || 0,
      item.revenue || 0,
      item.uniqueUsers || 0,
      item.averageAmount || 0,
    ]);

    csv =
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n") + "\n";
  } else {
    // Export summary data
    const headers = [
      "Start Date",
      "End Date",
      "Total Visits",
      "Total Revenue",
      "Unique Users",
      "Avg Revenue Per Visit",
    ];

    const dataArray = Array.isArray(data) ? data : [data];

    const rows = (dataArray as Array<Record<string, unknown>>).map((item) => [
      item.startDate || "",
      item.endDate || "",
      item.totalVisits || 0,
      item.totalRevenue || 0,
      item.uniqueUsers || 0,
      item.averageRevenuePerVisit || 0,
    ]);

    csv =
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n") + "\n";
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// Stat Card Component
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
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </div>
    </div>
  </Card>
);

// Mock API calls - Replace with real backend endpoints
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

const GymDashboard = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const id = gymId;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // State Management for API data
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "users" | "revenue" | "activities"
  >("overview");
  const [gymInfo, setGymInfo] = useState<GymInfo | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsPoint[]>([]);
  const [gymUsers, setGymUsers] = useState<GymUser[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [revenueData, setRevenueData] = useState<RevenueDataResponse | null>(
    null
  );

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  // Pagination
  const [usersPage, setUsersPage] = useState(1);
  const [totalUsersPages, setTotalUsersPages] = useState(1);

  // Date range filters
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // API Call 1: Fetch main dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/gym/dashboard/${id}`,
        { withCredentials: true }
      );

      if (data.success && data.data) {
        setGymInfo(data.data.gymInfo);
        setOverview(data.data.overview);
        setAnalytics(
          Array.isArray(data.data.analytics) ? data.data.analytics : []
        );
        setRecentActivities(
          Array.isArray(data.data.recentActivities)
            ? data.data.recentActivities
            : []
        );
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load gym dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  // API Call 2: Fetch analytics with date range
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoadingAnalytics(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/gym/dashboard/${id}/analytics`,
        {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            groupBy: "hour",
          },
          withCredentials: true,
        }
      );

      if (data.success && data.data) {
        setAnalytics(
          Array.isArray(data.data.analytics) ? data.data.analytics : []
        );
        // console.log("Fetched Analytics Data:", data.data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [id, dateRange, toast]);

  // API Call 3: Fetch gym users with pagination
  const fetchGymUsersData = useCallback(
    async (page: number) => {
      try {
        setIsLoadingUsers(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/gym/dashboard/${id}/users`,
          {
            params: { page },
            withCredentials: true,
          }
        );
        // console.log("Gym Users Data:", data);

        if (data.success && data.data) {
          setGymUsers(data.data.users);
          setTotalUsersPages(data.data.pagination?.totalPages || 1);
          setUsersPage(page);
        }
      } catch (error) {
        console.error("Error fetching gym users:", error);
        toast({
          title: "Error",
          description: "Failed to load users data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUsers(false);
      }
    },
    [id, toast]
  );

  // API Call 4: Fetch revenue data
  const fetchRevenueDataCall = useCallback(async () => {
    try {
      setIsLoadingRevenue(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/gym/dashboard/${id}/revenue`,
        { withCredentials: true }
      );

      if (data.success && data.data) {
        setRevenueData(data.data);
        console.log("Revenue Data:", data.data);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      toast({
        title: "Error",
        description: "Failed to load revenue data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRevenue(false);
    }
  }, [id, toast]);

  // API Call 5: Fetch and export data
  const handleExport = useCallback(async () => {
    try {
      setIsLoadingExport(true);
      // Export the analytics data currently displayed in the table
      if (Array.isArray(analytics) && analytics.length > 0) {
        downloadCSV(
          analytics,
          `gym-analytics-${dateRange.startDate}-to-${dateRange.endDate}.csv`
        );
        toast({
          title: "Success",
          description: "Analytics exported successfully",
        });
      } else {
        toast({
          title: "No Data",
          description:
            "No analytics data to export. Please load the analytics first.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExport(false);
    }
  }, [analytics, dateRange, toast]);

  // Initial load
  useEffect(() => {
    if (id) {
      fetchDashboardData();
      fetchGymUsersData(1);
    }
  }, [id, fetchDashboardData, fetchGymUsersData]);

  // Fetch revenue data when revenue tab is active
  useEffect(() => {
    if (activeTab === "revenue" && id && !revenueData) {
      fetchRevenueDataCall();
    }
  }, [activeTab, id, revenueData, fetchRevenueDataCall]);

  if (isLoading || !gymInfo || !overview) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">
            {" "}
            Manage {gymInfo.name || gymInfo.gymName}
          </h1>
          <p className="text-muted-foreground mb-4">{gymInfo.location}</p>
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

      {/* QR Display */}
      <div className="flex justify-center mb-8">
        <GymQrDisplay id={id} />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Activity className="w-6 h-6 text-white" />}
          label="Today's Visits"
          value={overview.today.visits}
          color="bg-blue-500"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-white" />}
          label="Today's Revenue"
          value={`₹${overview.today.revenue.toFixed(2)}`}
          color="bg-green-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          label="This Month"
          value={`₹${overview.thisMonth.revenue.toFixed(2)}`}
          color="bg-purple-500"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-white" />}
          label="This Year"
          value={`₹${overview.thisYear.revenue.toFixed(2)}`}
          color="bg-orange-500"
        />
      </div>

      {/* Tabs */}
      <div className="bg-background border-b mb-6">
        <div className="flex gap-8 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "analytics", label: "Analytics", icon: Activity },
            { id: "users", label: "Users", icon: Users },
            { id: "revenue", label: "Revenue", icon: DollarSign },
          ].map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() =>
                setActiveTab(
                  tabId as
                    | "overview"
                    | "analytics"
                    | "users"
                    | "revenue"
                    | "activities"
                )
              }
              className={`px-4 py-3 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === tabId
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-muted-foreground">Today</span>
                  <span className="font-semibold">
                    ₹{overview.today.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold">
                    ₹{overview.thisMonth.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-muted-foreground">This Year</span>
                  <span className="font-semibold">
                    ₹{overview.thisYear.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">All Time</span>
                  <span className="font-semibold text-primary">
                    ₹{overview.allTime.revenue.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Visit Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-muted-foreground">Today</span>
                  <span className="font-semibold">{overview.today.visits}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold">
                    {overview.thisMonth.visits}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-muted-foreground">This Year</span>
                  <span className="font-semibold">
                    {overview.thisYear.visits}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">All Time</span>
                  <span className="font-semibold text-primary">
                    {overview.allTime.visits}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Analytics Data</h3>
                <div className="flex gap-2">
                  <input
                    type="date"
                    title="Start Date"
                    placeholder="Start Date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, startDate: e.target.value })
                    }
                    className="px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  <input
                    type="date"
                    title="End Date"
                    placeholder="End Date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, endDate: e.target.value })
                    }
                    className="px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  <Button
                    onClick={fetchAnalyticsData}
                    disabled={isLoadingAnalytics}
                    size="sm"
                  >
                    {isLoadingAnalytics ? "Loading..." : "Filter"}
                  </Button>
                  <Button
                    onClick={handleExport}
                    disabled={isLoadingExport}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isLoadingExport ? "Exporting..." : "Export"}
                  </Button>
                </div>
              </div>

              {isLoadingAnalytics ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Period</th>
                        <th className="text-left py-2 px-4">Visits</th>
                        <th className="text-left py-2 px-4">Unique Users</th>
                        <th className="text-left py-2 px-4">Revenue</th>
                        <th className="text-left py-2 px-4">Avg Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(analytics) && analytics.length > 0 ? (
                        analytics.map((point, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-4">{point.period}</td>
                            <td className="py-2 px-4">{point.visits}</td>
                            <td className="py-2 px-4">{point.uniqueUsers}</td>
                            <td className="py-2 px-4">
                              ₹{point.revenue.toFixed(2)}
                            </td>
                            <td className="py-2 px-4">
                              ₹{point.averageAmount.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-8 text-center text-muted-foreground"
                          >
                            No analytics data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </ScrollArea>
              )}
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Gym Members</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => fetchGymUsersData(usersPage - 1)}
                    disabled={usersPage === 1 || isLoadingUsers}
                    size="sm"
                    variant="outline"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Page {usersPage} of {totalUsersPages}
                  </span>
                  <Button
                    onClick={() => fetchGymUsersData(usersPage + 1)}
                    disabled={usersPage === totalUsersPages || isLoadingUsers}
                    size="sm"
                    variant="outline"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isLoadingUsers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Email</th>
                        <th className="text-left py-2 px-4">Visits</th>
                        <th className="text-left py-2 px-4">Total Spent</th>
                        <th className="text-left py-2 px-4">Avg Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gymUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.profileImage} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              {user.name}
                            </div>
                          </td>
                          <td className="py-2 px-4">{user.email}</td>
                          <td className="py-2 px-4">{user.visitCount}</td>
                          <td className="py-2 px-4">
                            ₹{user.totalSpent.toFixed(2)}
                          </td>
                          <td className="py-2 px-4">
                            ₹{user.averageSpent.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              )}
            </Card>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {revenueData &&
                [
                  { label: "Today", value: revenueData.breakdown.today },
                  { label: "This Week", value: revenueData.breakdown.thisWeek },
                  {
                    label: "This Month",
                    value: revenueData.breakdown.thisMonth,
                  },
                  { label: "This Year", value: revenueData.breakdown.thisYear },
                ].map((period, idx) => (
                  <Card key={idx} className="p-6">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                      {period.label}
                    </h4>
                    <p className="text-3xl font-bold mb-2">
                      ₹{(period.value?.total || 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {period.value?.count || 0} transactions
                    </p>
                  </Card>
                ))}
            </div>

            {/* <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment History</h3>
              {isLoadingRevenue ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">User</th>
                        <th className="text-left py-2 px-4">Amount</th>
                        <th className="text-left py-2 px-4">Date</th>
                        <th className="text-left py-2 px-4">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData?.gymPayments?.history &&
                      Array.isArray(revenueData.gymPayments.history) &&
                      revenueData.gymPayments.history.length > 0 ? (
                        revenueData.gymPayments.history.map((payment) => (
                          <tr
                            key={payment._id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-2 px-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={payment.userProfileImage} />
                                  <AvatarFallback>
                                    {payment.userName?.[0] || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                {payment.userName}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              ₹{(payment.amount || 0).toFixed(2)}
                            </td>
                            <td className="py-2 px-4">
                              {new Date(
                                payment.paymentDate
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 text-xs text-muted-foreground">
                              {payment.transactionId || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center text-muted-foreground"
                          >
                            No payment history available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </ScrollArea>
              )}
            </Card> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default GymDashboard;
