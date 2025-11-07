import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

interface GymDetails {
  _id: string;
  name: string;
  contactEmail: string;
  contactNumber: string;
  address: {
    addressLine: string;
    city: string;
    state: string;
  };
  location: {
    type: string;
    coordinates: [number, number];
  };
}

interface AccessHistory {
  _id: string;
  accessTime: string;
  checkOutTime?: string;
  amountPaid: number;
  paymentStatus?: "completed" | "pending" | "failed";
  gymDetails: GymDetails;
}

export default function GymAccessHistory() {
  const [accessHistory, setAccessHistory] = useState<AccessHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccessHistory = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/payment/getGymAccessHistoryForUser`,

          { withCredentials: true }
        );

        console.log("Access History:", data.data);
        setAccessHistory(data.data || []);
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === "object" && "data" in error
            ? (error.data as { message?: string })?.message
            : "Failed to fetch gym access history";

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Error fetching access history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessHistory();
  }, [toast]);

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const calculateDuration = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return "Ongoing";
    try {
      const inTime = new Date(checkIn);
      const outTime = new Date(checkOut);
      const diffMs = outTime.getTime() - inTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    } catch {
      return "N/A";
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Gym Access History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {accessHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">
              No gym access history yet. Start checking in to gyms!
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {accessHistory.map((access, index) => (
              <div
                key={access._id || index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                {/* Left: Gym Info & Time */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {access.gymDetails.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {access.gymDetails.address.addressLine},{" "}
                      {access.gymDetails.address.city},{" "}
                      {access.gymDetails.address.state}
                    </p>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatTime(access.accessTime)}</span>
                    </div>
                    {access.checkOutTime && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Duration:{" "}
                          {calculateDuration(
                            access.accessTime,
                            access.checkOutTime
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{access.gymDetails.contactNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs">
                        {access.gymDetails.contactEmail}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status & Amount */}
                <div className="flex flex-col items-end gap-3">
                  <Badge
                    className={getPaymentStatusColor(access.paymentStatus)}
                  >
                    {access.paymentStatus
                      ? access.paymentStatus.charAt(0).toUpperCase() +
                        access.paymentStatus.slice(1)
                      : "Completed"}
                  </Badge>

                  {access.amountPaid && (
                    <div className="text-lg font-bold text-primary">
                      ₹{access.amountPaid.toFixed(2)}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(access.accessTime), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
