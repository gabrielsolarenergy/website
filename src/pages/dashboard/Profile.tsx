import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sun,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Zap,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    location: user?.location || "",
  });

  const handleSave = () => {
    // In a real app, this would call an API endpoint
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Gabriel SOLAR ENERGY</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-4 space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <Zap className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/documents"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <FileText className="w-5 h-5" />
                Documents
              </Link>
              <Link
                to="/dashboard/appointments"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Appointments
              </Link>
              <Link
                to="/dashboard/messages"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Messages
              </Link>
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
              >
                <Settings className="w-5 h-5" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Card */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Cover */}
              <div className="h-24 sm:h-32 bg-gradient-to-r from-primary to-primary/80" />

              {/* Avatar */}
              <div className="px-4 sm:px-6 pb-6">
                <div className="relative -mt-12 sm:-mt-16 mb-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card border-4 border-card rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-primary">
                    {user?.first_name?.charAt(0) || "U"}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                          placeholder="+40 712 345 678"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold mb-4">Account Information</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Account Type:</span>
                        <p className="font-medium capitalize">{user?.role}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Member Since:</span>
                        <p className="font-medium">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">2FA Status:</span>
                        <p className={`font-medium ${user?.two_factor_enabled ? "text-accent" : "text-muted-foreground"}`}>
                          {user?.two_factor_enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/forgot-password">Change Password</Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  asChild
                  disabled={user?.two_factor_enabled}
                >
                  <Link to="/2fa-setup">
                    {user?.two_factor_enabled ? "2FA Enabled ✓" : "Enable Two-Factor Authentication"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
