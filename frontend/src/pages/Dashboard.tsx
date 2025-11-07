import React from "react";
import { Tabs } from "@/components/ui/tabs";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import GymDiscovery from "@/components/dashboard/GymDiscovery";
import FitnessTracker from "@/components/dashboard/FitnessTracker";
import MealAnalyzer from "@/components/dashboard/MealAnalyzer";
import SmartHealth from "@/components/dashboard/SmartHealth";
import Payment from "@/components/Payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wallet,
  Plus,
  Minus,
  X,
  History,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface RechargeHistoryItem {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  transactionId?: string;
}

const Dashboard: React.FC = () => {
  const [showRechargeModal, setShowRechargeModal] = React.useState(false);
  const [rechargeAmount, setRechargeAmount] = React.useState(100);
  const [showPayment, setShowPayment] = React.useState(false);
  const [selectedAmount, setSelectedAmount] = React.useState(100);
  const [userBalance, setUserBalance] = React.useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = React.useState(false);
  const [showRechargeHistory, setShowRechargeHistory] = React.useState(false);
  const [rechargeHistory, setRechargeHistory] = React.useState<
    RechargeHistoryItem[]
  >([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const { toast } = useToast();

  const handleRechargeClick = () => {
    setRechargeAmount(100);
    setShowRechargeModal(true);
  };

  const handleProceedToPayment = () => {
    setSelectedAmount(rechargeAmount);
    setShowRechargeModal(false);
    setShowPayment(true);
  };

  const handleIncreaseAmount = () => {
    setRechargeAmount(rechargeAmount + 10);
  };

  const handleDecreaseAmount = () => {
    if (rechargeAmount > 10) {
      setRechargeAmount(rechargeAmount - 10);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setRechargeAmount(value);
    }
  };

  // Fetch user balance on component mount
  React.useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        setBalanceLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/payment/getUserBalance`,
          { withCredentials: true }
        );
        console.log("User Balance:", data);
        setUserBalance(data.data?.balance || 0);
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === "object" && "data" in error
            ? (error.data as { message?: string })?.message
            : "Failed to fetch balance";
        console.error("Error fetching balance:", error);
        // Don't show toast for balance fetch to avoid annoying the user
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchUserBalance();
  }, []);

  const refreshBalance = async () => {
    try {
      setBalanceLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/payment/getUserBalance`,
        { withCredentials: true }
      );
      setUserBalance(data.data?.balance || 0);
    } catch (error: unknown) {
      console.error("Error refreshing balance:", error);
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchRechargeHistory = async () => {
    try {
      setHistoryLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/payment/getRechargeHistory`,
        { withCredentials: true }
      );
      console.log("Recharge History:", data);
      if (data.success && data.data) {
        setRechargeHistory(data.data);
      }
    } catch (error: unknown) {
      console.error("Error fetching recharge history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch recharge history",
        variant: "destructive",
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenRechargeHistory = () => {
    setShowRechargeHistory(true);
    fetchRechargeHistory();
  };
  const dashboardTabs = [
    {
      title: "Overview",
      value: "overview",
      content: <DashboardOverview />,
    },
    {
      title: "Gym Discovery",
      value: "gyms",
      content: <GymDiscovery />,
    },
    {
      title: "Fitness Tracker",
      value: "fitness",
      content: <FitnessTracker />,
    },
    {
      title: "Meal Planner",
      value: "meals",
      content: <MealAnalyzer />,
    },
    {
      title: "Smart Health",
      value: "health",
      content: <SmartHealth />,
    },
    {
      title: "Notifications",
      value: "notifications",
      content: (
        <div className="w-full h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-foreground bg-gradient-to-br from-background via-background/95 to-background/90 border border-border/50">
          <p className="mb-4">Notifications & Alerts</p>
          <div className="text-base font-normal text-muted-foreground">
            <p>
              Manage your fitness notifications, gym offers, workout reminders,
              and more.
            </p>
            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h3 className="font-semibold text-primary">
                  New Gym Nearby! 🏋️
                </h3>
                <p className="text-sm text-muted-foreground">
                  PowerHouse Fitness just opened 0.3km from your location.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                <h3 className="font-semibold text-success">
                  Goal Achieved! 🎯
                </h3>
                <p className="text-sm text-muted-foreground">
                  You've reached your daily step goal of 10,000 steps!
                </p>
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
            <p>
              Get help with your fitness journey and connect with our support
              team.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                <h3 className="font-semibold text-primary mb-2">FAQ</h3>
                <p className="text-sm">
                  Find answers to common questions about workouts, nutrition,
                  and app features.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-r from-success/5 to-primary/5 border border-success/10">
                <h3 className="font-semibold text-success mb-2">
                  Contact Support
                </h3>
                <p className="text-sm">
                  Get personalized help from our fitness and technical support
                  team.
                </p>
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
        <div className="text-center py-8 flex flex-col items-center justify-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
                FitVerse Dashboard
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your complete fitness command center. Track progress, discover
              gyms, plan meals, and get personalized health insights.
            </p>
          </div>

          {/* Balance and Recharge Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            {/* Balance Card */}
            <div className="flex-1 max-w-xs bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Wallet Balance
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {balanceLoading ? (
                      <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                    ) : (
                      <p className="text-3xl font-bold text-primary">
                        ₹{userBalance?.toFixed(2) || "0.00"}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={refreshBalance}
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

            {/* Recharge Button */}
            <div className="flex flex-col m-2 gap-4">
              <Button
                onClick={handleRechargeClick}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold px-6 py-3 text-base"
              >
                <Plus className="h-5 w-5 mr-2" />
                Recharge Wallet
              </Button>

              {/* View History Button */}
              <Button
                onClick={handleOpenRechargeHistory}
                variant="outline"
                className="px-6 py-3 text-base font-semibold"
              >
                <History className="h-5 w-5 mr-2" />
                View History
              </Button>
            </div>
          </div>
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

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border p-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowRechargeModal(false)}
              title="Close modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>

            {/* Modal Content */}
            <div className="space-y-6 pt-4">
              <div className="text-center">
                <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Recharge Wallet</h2>
                <p className="text-muted-foreground">
                  Enter the amount you want to recharge
                </p>
              </div>

              {/* Amount Display */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Amount</p>
                  <div className="text-4xl font-bold text-primary">
                    ₹{rechargeAmount}
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleDecreaseAmount}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    disabled={rechargeAmount <= 10}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <Input
                    type="number"
                    value={rechargeAmount}
                    onChange={handleAmountChange}
                    className="flex-2 text-center text-lg font-semibold"
                    min="10"
                    step="10"
                  />
                  <Button
                    onClick={handleIncreaseAmount}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => setRechargeAmount(amount)}
                      variant={
                        rechargeAmount === amount ? "default" : "outline"
                      }
                      size="sm"
                      className="text-sm font-semibold"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowRechargeModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Component */}
      {showPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-background rounded-2xl shadow-2xl border border-border overflow-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPayment(false)}
              title="Close payment"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>

            {/* Payment Component */}
            <div className="p-6">
              <Payment amountInfo={{ amount: selectedAmount }} />
            </div>
          </motion.div>
        </div>
      )}

      {/* Recharge History Modal */}
      {showRechargeHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl border border-border p-6 max-h-[80vh] overflow-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowRechargeHistory(false)}
              title="Close modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>

            {/* Modal Content */}
            <div className="space-y-6 pt-2">
              <div className="text-center">
                <History className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Recharge History</h2>
                <p className="text-muted-foreground">
                  View all your wallet recharge transactions
                </p>
              </div>

              {/* History List */}
              <div className="space-y-3">
                {historyLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-muted rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : rechargeHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="h-16 w-16 text-muted/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No recharge history found
                    </p>
                  </div>
                ) : (
                  rechargeHistory.map((transaction, index) => (
                    <motion.div
                      key={transaction._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                          <IndianRupee className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            Wallet Recharge
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(transaction.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            + ₹{transaction.amount}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Close Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowRechargeHistory(false)}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
