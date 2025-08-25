import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Dumbbell, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight
} from "lucide-react";

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  const metrics = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12.3%",
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Active Gyms",
      value: "56",
      change: "+4.5%",
      icon: <Dumbbell className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Monthly Revenue",
      value: "₹45,678",
      change: "+22.4%",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Total Transactions",
      value: "890",
      change: "+8.7%",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
    }
  ];

  const recentLogins = [
    { id: 1, name: "John Doe", time: "2 minutes ago", status: "Active" },
    { id: 2, name: "Jane Smith", time: "15 minutes ago", status: "Active" },
    { id: 3, name: "Mike Johnson", time: "1 hour ago", status: "Inactive" },
    { id: 4, name: "Sarah Williams", time: "2 hours ago", status: "Active" }
  ];

  const recentTransactions = [
    { id: "TXN001", amount: "₹2,000", status: "Successful", time: "2 hours ago" },
    { id: "TXN002", amount: "₹1,500", status: "Pending", time: "3 hours ago" },
    { id: "TXN003", amount: "₹3,500", status: "Successful", time: "4 hours ago" },
    { id: "TXN004", amount: "₹1,200", status: "Failed", time: "5 hours ago" }
  ];

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col space-y-6">
        {/* Header with Action Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            className="px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
            onClick={() => navigate('/admin/gym-approvals')}
          >
            Approve Gyms
          </button>
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
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Section */}
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
                {recentLogins.map((login) => (
                  <div key={login.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{login.name}</p>
                      <p className="text-sm text-muted-foreground">{login.time}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        login.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {login.status}
                      </span>
                    </div>
                  </div>
                ))}
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
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{transaction.amount}</p>
                      <p className="text-sm text-muted-foreground">ID: {transaction.id}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'Successful' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'Failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                      <span className="text-sm text-muted-foreground mt-1">
                        {transaction.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/admin/gym-approvals')}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg hover:from-primary/20 hover:to-primary/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Pending Gym Approvals</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg hover:from-secondary/20 hover:to-secondary/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-secondary" />
                  <span>Manage Users</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                className="flex items-center justify-between p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg hover:from-success/20 hover:to-success/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span>View Reports</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;

