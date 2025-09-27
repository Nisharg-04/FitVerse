import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
// Using simple modals instead of complex dialog components
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
  Calendar,
  Mail,
  ExternalLink,
  Eye,
  EyeOff,
  Upload,
  X,
} from "lucide-react";

// Types
interface Advertisement {
  _id: string;
  title: string;
  link: string;
  description: string;
  advertisementName: string;
  contactEmail: string;
  validUpTo: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateAdvertisementData {
  title: string;
  link: string;
  description: string;
  advertisementName: string;
  contactEmail: string;
  validUpTo: string;
  image: File | null;
}

interface UpdateAdvertisementData {
  title: string;
  image: File | null;
}

// API Functions
const createAdvertisement = async (
  data: CreateAdvertisementData
): Promise<Advertisement> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("link", data.link);
  formData.append("description", data.description);
  formData.append("advertisementName", data.advertisementName);
  formData.append("contactEmail", data.contactEmail);
  formData.append("validUpTo", data.validUpTo);
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/advertisement/createAdvertisement`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create advertisement");
  }

  return response.json();
};

const updateAdvertisement = async (
  id: string,
  data: UpdateAdvertisementData
): Promise<Advertisement> => {
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/advertisement/updateAdvertisement/${id}`,
    {
      method: "PUT",
      credentials: "include",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update advertisement");
  }

  return response.json();
};

const deleteAdvertisement = async (id: string): Promise<void> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/api/advertisement/deleteAdvertisement/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete advertisement");
  }
};

const fetchAdvertisements = async (): Promise<Advertisement[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/advertisement/getMyAdvertisements`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch advertisements");
  }

  const data = await response.json();
  return data.data || [];
};

// Create Advertisement Form Component
const CreateAdvertisementForm: React.FC<{
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateAdvertisementData>({
    title: "",
    link: "",
    description: "",
    advertisementName: "",
    contactEmail: "",
    validUpTo: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createAdvertisement(formData);
      toast({
        title: "Success!",
        description: "Advertisement created successfully.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create advertisement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Advertisement
        </CardTitle>
        <CardDescription>
          Fill in the details to create a new advertisement for your gym.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Advertisement Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter advertisement title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advertisementName">Advertisement Name *</Label>
              <Input
                id="advertisementName"
                name="advertisementName"
                value={formData.advertisementName}
                onChange={handleInputChange}
                placeholder="Enter advertisement name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter advertisement description"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link">Advertisement Link *</Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="contact@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUpTo">Valid Up To *</Label>
            <Input
              id="validUpTo"
              name="validUpTo"
              type="date"
              value={formData.validUpTo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Advertisement Image *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="flex-1"
              />
              {imagePreview && (
                <div className="relative w-20 h-20">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    onClick={() => {
                      setImagePreview("");
                      setFormData((prev) => ({ ...prev, image: null }));
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Advertisement"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

// Update Advertisement Form Component
const UpdateAdvertisementForm: React.FC<{
  advertisement: Advertisement;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ advertisement, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<UpdateAdvertisementData>({
    title: advertisement.title,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateAdvertisement(advertisement._id, formData);
      toast({
        title: "Success!",
        description: "Advertisement updated successfully.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update advertisement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Update Advertisement
        </CardTitle>
        <CardDescription>
          Update the title and/or image of your advertisement.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Advertisement Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter advertisement title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Advertisement Image (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
              {(imagePreview || advertisement.image) && (
                <div className="relative w-20 h-20">
                  <img
                    src={imagePreview || advertisement.image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={() => {
                        setImagePreview("");
                        setFormData((prev) => ({ ...prev, image: null }));
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Advertisement"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

// Advertisement Card Component
const AdvertisementCard: React.FC<{
  advertisement: Advertisement;
  onUpdate: (ad: Advertisement) => void;
  onDelete: (id: string) => void;
  onEdit: (ad: Advertisement) => void;
}> = ({ advertisement, onUpdate, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAdvertisement(advertisement._id);
      toast({
        title: "Success!",
        description: "Advertisement deleted successfully.",
      });
      onDelete(advertisement._id);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete advertisement",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = new Date(advertisement.validUpTo) < new Date();

  return (
    <>
      <Card
        className={`hover:shadow-lg transition-shadow ${
          isExpired ? "opacity-60" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-1">
                {advertisement.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {advertisement.advertisementName}
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Badge variant={isExpired ? "destructive" : "default"}>
                {isExpired ? "Expired" : "Active"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {advertisement.image && (
            <div className="relative h-32 w-full rounded-lg overflow-hidden">
              <img
                src={advertisement.image}
                alt={advertisement.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2">
            {advertisement.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Valid until {formatDate(advertisement.validUpTo)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span className="truncate">{advertisement.contactEmail}</span>
            </div>
          </div>

          {advertisement.link && (
            <a
              href={advertisement.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Visit Link
            </a>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(advertisement)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Are you sure?</CardTitle>
              <CardDescription>
                This action cannot be undone. This will permanently delete the
                advertisement "{advertisement.title}".
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

// Main Advertisement Management Component
const ManageAdvertisements: React.FC = () => {
  const navigate = useNavigate();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  const loadAdvertisements = async () => {
    try {
      setLoading(true);
      const ads = await fetchAdvertisements();
      setAdvertisements(ads);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load advertisements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvertisements();
  }, []);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadAdvertisements();
  };

  const handleUpdateSuccess = () => {
    setEditingAd(null);
    loadAdvertisements();
  };

  const handleDeleteSuccess = (deletedId: string) => {
    setAdvertisements((prev) => prev.filter((ad) => ad._id !== deletedId));
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/gymdashboard")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-3xl font-bold">Manage Advertisements</h1>
            <p className="text-muted-foreground">
              Create, update, and manage your gym advertisements
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Advertisement
        </Button>
      </div>

      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <CreateAdvertisementForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </motion.div>
        )}
        {editingAd && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <UpdateAdvertisementForm
              advertisement={editingAd}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setEditingAd(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {advertisements.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Advertisements Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any advertisements yet. Create your first one
              to get started!
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Advertisement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map((ad) => (
            <motion.div
              key={ad._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <AdvertisementCard
                advertisement={ad}
                onUpdate={handleUpdateSuccess}
                onDelete={handleDeleteSuccess}
                onEdit={handleEdit}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAdvertisements;
