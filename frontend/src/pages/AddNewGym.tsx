import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SelectLocation from "./SelectLocation";
import { addGym } from "@/redux/slices/gymSlice";


interface GymFormData {
  name: string;
  addressLine: string;
  city: string;
  state: string;
  contactNumber: string;
  contactEmail: string;
  perHourPrice: string;
  features: string;
  latitude: string;
  longitude: string;
  images: File[];
}

export default function AddNewGym() {
      const [selectedPosition, setSelectedPosition] =
    useState<LatLngExpression | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, void, AnyAction>>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [formData, setFormData] = useState<GymFormData>({
    name: "",
    addressLine: "",
    city: "",
    state: "",
    contactNumber: "",
    contactEmail: "",
    perHourPrice: "",
    features: "",
    latitude: "",
    longitude: "",
    images: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      let isValid = true;

      for (const file of selectedFiles) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({
            title: "File too large",
            description: `${file.name} is larger than 5MB. Please select smaller images.`,
            variant: "destructive"
          });
          isValid = false;
          break;
        }

        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file.`,
            variant: "destructive"
          });
          isValid = false;
          break;
        }
      }

      if (isValid) {
        setFormData(prev => ({
          ...prev,
          images: selectedFiles,
        }));
        
        // Create previews for valid images
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setImagesPreview(prev => {
          // Clean up old preview URLs
          prev.forEach(url => URL.revokeObjectURL(url));
          return previews;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.addressLine || !formData.city || !formData.state) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!/^\+?[\d\s-()]{10,}$/.test(formData.contactNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(formData.perHourPrice)) {
      toast({
        title: "Invalid price format",
        description: "Please enter a valid price (e.g., 299.99).",
        variant: "destructive"
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your gym.",
        variant: "destructive"
      });
      return;
    }
      formData.latitude = selectedPosition ? selectedPosition[0].toString() : "";
        formData.longitude = selectedPosition ? selectedPosition[1].toString() : "";
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      // Append all form data except images
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          formDataToSend.append(key, value);
        }
      });
      
      // Append images
      formData.images.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const resultAction = await dispatch(addGym(formDataToSend));
      
      if (addGym.fulfilled.match(resultAction)) {
        toast({
          title: "Success!",
          description: "Your gym has been added successfully.",
        });
        navigate('/gymdashboard');
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error.data as { message?: string })?.message 
        : "Something went wrong. Please try again.";
        
      toast({
        title: "Failed to add gym",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Gym</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Gym Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter gym name"
              required
            />
          </div>

          <div>
            <Label htmlFor="addressLine">Address</Label>
            <Textarea
              id="addressLine"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit number"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="perHourPrice">Price per Hour (₹)</Label>
            <Input
              id="perHourPrice"
              name="perHourPrice"
              type="number"
              step="0.01"
              value={formData.perHourPrice}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <Label htmlFor="features">Features</Label>
            <Textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Enter gym features"
              required
            />
          </div>

          <div>
            <Label>Location</Label>
            <div className="mt-2 w-full overflow-hidden rounded-md border">
              <SelectLocation
                height={30}
                width={100}
                onLocationSelect={(lat, lng) => {
                  setFormData(prev => ({
                    ...prev,
                    latitude: lat.toString(),
                    longitude: lng.toString()
                  }));
                }}
              />
              {formData.latitude && formData.longitude && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected location: {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="images">Gym Images</Label>
            <div className="space-y-4">
              <Input
                id="images"
                name="images"
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="border border-input"
                required
              />
              {imagesPreview.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagesPreview.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Gym"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
