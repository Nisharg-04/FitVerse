import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Dumbbell,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<{
    totalUsers?: number;
    activeGyms?: number;
    monthlyRevenue?: number;
    totalTransactions?: number;
  }>({});
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/dashboard-stats`,
          {
            withCredentials: true,
          }
        );

        if (resp?.data && resp.data.data) {
          setStats(resp.data.data);
        }
      } catch (err) {
        // keep existing empty state on error
        console.error("Failed to fetch admin dashboard stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const metrics = [
    {
      title: "Total Users",
      value:
        stats.totalUsers !== undefined
          ? stats.totalUsers.toLocaleString()
          : "—",
      change: "",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Active Gyms",
      value:
        stats.activeGyms !== undefined
          ? stats.activeGyms.toLocaleString()
          : "—",
      change: "",
      icon: <Dumbbell className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Revenue",
      value:
        stats.monthlyRevenue !== undefined
          ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(stats.monthlyRevenue)
          : "—",
      change: "",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Transactions",
      value:
        stats.totalTransactions !== undefined
          ? stats.totalTransactions.toLocaleString()
          : "—",
      change: "",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const [recentLogins, setRecentLogins] = useState<
    Array<{
      userName?: string;
      userAvatar?: string;
      gymName?: string;
      amountPaid?: number;
      accessTime?: string;
      timeAgo?: string;
    }>
  >([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoadingRecent(true);
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/getRecentCheckins`,
          {
            withCredentials: true,
          }
        );

        if (resp?.data && Array.isArray(resp.data.data)) {
          setRecentLogins(resp.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch recent checkins:", err);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecent();
  }, []);

  const [recentTransactions, setRecentTransactions] = useState<
    Array<{
      _id?: string;
      paymentDate?: string;
      amount?: number;
      userId?: string;
      success?: boolean;
      paymentInfo?: { method?: string };
    }>
  >([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoadingTransactions(true);
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/getRecentTransactions`,
          {
            withCredentials: true,
          }
        );
        console.log("Recent Transactions:", resp?.data);

        if (resp?.data && Array.isArray(resp.data.data)) {
          setRecentTransactions(resp.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch recent transactions:", err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        {/* Header with Action Button */}
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.change} from last month
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/admin/gym-approvals")}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg hover:from-primary/20 hover:to-primary/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Pending Gym Approvals</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/admin/manage-users")}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg hover:from-secondary/20 hover:to-secondary/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-secondary" />
                  <span>Manage Users</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
              {/* <button className="flex items-center justify-between p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg hover:from-success/20 hover:to-success/10 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span>View Reports</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button> */}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Logins */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent User Logins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingRecent ? (
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : recentLogins.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No recent check-ins
                  </div>
                ) : (
                  recentLogins.map((login, idx) => (
                    <div
                      key={login.userName ?? idx}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={login.userAvatar}
                          alt={login.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{login.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {login.gymName}
                            {/* {login.amountPaid ? `₹${login.amountPaid}` : "—"} */}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-muted-foreground">
                          {login.timeAgo ??
                            new Date(login.accessTime ?? "").toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingTransactions ? (
                  <div className="text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No recent transactions
                  </div>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {transaction.amount ? `₹${transaction.amount}` : "—"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {transaction._id}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`px-2 py-1 rounded-full text-xs 
                            bg-green-100 text-green-800
                          
                          }`}
                        >
                          Successful
                        </span>
                        <span className="text-sm text-muted-foreground mt-1">
                          {transaction.paymentDate
                            ? new Date(transaction.paymentDate).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
      </div>
    </div>
  );
};

export default AdminPanel;
