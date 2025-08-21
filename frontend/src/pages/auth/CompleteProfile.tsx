import { UserPlus2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { completeProfile } from "@/redux/slices/authSlice.ts";
import { useAuth } from "@/hooks/useAuth";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isProfileComplete) {
      
      navigate("/dashboard");
    }
  }, [user, navigate, toast]);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    phoneNumber: user?.phoneNumber || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please check your passwords and try again",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const resultAction = await dispatch(completeProfile(formData));
      if (completeProfile.fulfilled.match(resultAction)) {
        toast({
          title: "Profile completed successfully",
          description: "Welcome to FitVerse!",
          variant: "default"
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Profile completion failed",
          description: resultAction.error?.message || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Profile completion failed",
        description: "An error occurred during profile completion",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-12 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-pulse-soft delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary mb-4 shadow-xl"
          >
            <UserPlus2 className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Set up your FitVerse account</p>
        </div>

        <Card className="fitness-card border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Create Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 border-2 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-12 border-2 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="h-12 border-2 focus:border-primary transition-colors"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 btn-gradient text-lg font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Complete Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
