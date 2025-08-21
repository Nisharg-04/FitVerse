import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Dumbbell, Phone, Upload, UserCheck, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from "react-redux";


import { signupUser } from "../../redux/slices/authSlice";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    avatar: null,
    role: "user",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
 

  const handleRoleSwitch = (isOwnerSelected: boolean) => {
    setIsOwner(isOwnerSelected);
    setFormData(prev => ({
      ...prev,
      role: isOwnerSelected ? 'owner' : 'user'
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive"
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        avatar: file,
      }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Terms required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      const resultAction = await dispatch(signupUser(formDataToSend));
      if (signupUser.fulfilled.match(resultAction)) {
        toast({
          title: `Welcome to FitVerse${isOwner ? ' Business' : ''}!`,
          description: `Your ${isOwner ? 'gym owner' : 'user'} account has been created successfully.`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Sign up failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error.data as { message?: string })?.message 
        : "Something went wrong. Please try again.";
        
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden py-8">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-pulse-soft [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg p-6"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary mb-4 shadow-xl"
          >
            <Dumbbell className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Join FitVerse</h1>
          <p className="text-muted-foreground">
            {isOwner ? "Start your gym business journey" : "Start your fitness journey today"}
          </p>
        </div>

        <Card className="fitness-card border-0 shadow-2xl">
          <CardHeader className="space-y-4 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            
            {/* Role Switcher */}
            <div className="relative p-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
              <div className="flex rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch(false)}
                  className={`flex-1 relative px-6 py-3 text-sm font-medium transition-all duration-300 ${
                    !isOwner
                      ? 'text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {!isOwner && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center justify-center space-x-2">
                    <UserCheck className="h-4 w-4" />
                    <span>Fitness User</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRoleSwitch(true)}
                  className={`flex-1 relative px-6 py-3 text-sm font-medium transition-all duration-300 ${
                    isOwner
                      ? 'text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isOwner && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center justify-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Gym Owner</span>
                  </div>
                </button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-muted-foreground/50 flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {avatarPreview ? 'Change Picture' : 'Upload Picture'}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      aria-label="Upload profile picture"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 5MB, JPG/PNG only
                    </p>
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {isOwner ? 'Business Name' : 'Full Name'}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={isOwner ? "Enter your business name" : "Enter your full name"}
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-colors"
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-colors"
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary-dark underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary-dark underline">
                    Privacy Policy
                  </Link>
                  {isOwner && (
                    <>
                      {' '}and the{' '}
                      <Link to="/business-terms" className="text-primary hover:text-primary-dark underline">
                        Business Terms
                      </Link>
                    </>
                  )}
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 btn-gradient text-lg font-semibold"
                disabled={loading }
              >
                {(loading ) ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  `Create ${isOwner ? 'Business' : 'Personal'} Account`
                )}
              </Button>

              {/* Social Login Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                </div>
              </div>

                          </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;