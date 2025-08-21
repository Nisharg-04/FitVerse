import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { PinContainer } from "@/components/ui/3d-pin";
import { Dumbbell, Home, LayoutDashboard } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern - matching home page */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/60"></div>
      
      {/* Gradient Blobs - matching home page style */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
      ></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-success/20 to-primary/20 rounded-full blur-3xl"
      ></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
            }}
            animate={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center w-full mx-auto px-4">
        {/* 404 Text with Gradient Effect - Made much bigger */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-[500px] mb-8 flex items-center justify-center w-full"
        >
          <h1 className="text-[120px] md:text-[150px] lg:text-[180px] font-bold leading-none">
            <span className="bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{marginTop: '-9rem'}}
          className="mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              Workout Not Found
            </h1>
            <Dumbbell className="w-8 h-8 text-primary ml-3" />
          </div>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Looks like this page skipped leg day! The page you're looking for doesn't exist, 
            but your fitness journey continues.
          </p>
        </motion.div>

        {/* Navigation Cards - Better centered */}
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center max-w-4xl mx-auto">
          {/* Home Pin */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <PinContainer
              title="Return to FitVerse"
              href="/"
            >
              <div className="flex basis-full flex-col p-6 tracking-tight text-slate-100/50 w-[18rem] h-[16rem]">
                <div className="flex items-center mb-4">
                  <Home className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-base font-bold text-slate-100">
                    Back to Home
                  </h3>
                </div>
                <div className="text-sm font-normal">
                  <span className="text-slate-500">
                    Return to the main page and start your fitness journey. 
                    Explore workouts, nutrition plans, and connect with the fitness community.
                  </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-primary via-secondary to-success flex items-center justify-center">
                  <Home className="w-12 h-12 text-white/80" />
                </div>
              </div>
            </PinContainer>
          </motion.div>

          {/* Dashboard Pin */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            className="flex justify-center"
          >
            <PinContainer
              title="Track Your Progress"
              href="/dashboard"
            >
              <div className="flex basis-full flex-col p-6 tracking-tight text-slate-100/50 w-[18rem] h-[16rem]">
                <div className="flex items-center mb-4">
                  <LayoutDashboard className="w-6 h-6 text-secondary mr-2" />
                  <h3 className="text-base font-bold text-slate-100">
                    Go to Dashboard
                  </h3>
                </div>
                <div className="text-sm font-normal">
                  <span className="text-slate-500">
                    Access your personalized dashboard to track workouts, monitor progress, 
                    and achieve your fitness goals.
                  </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-secondary via-success to-primary flex items-center justify-center">
                  <LayoutDashboard className="w-12 h-12 text-white/80" />
                </div>
              </div>
            </PinContainer>
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-1 text-center"
        >
          <p className="text-muted-foreground text-sm">
            "The only bad workout is the one that didn't happen." - Keep moving forward!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
