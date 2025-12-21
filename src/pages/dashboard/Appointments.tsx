import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sun,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Plus,
  Zap,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import AppointmentBooking from "@/components/booking/AppointmentBooking";

// Mock appointments
const mockAppointments = [
  {
    id: "1",
    title: "Site Assessment",
    date: "2024-02-15",
    time: "09:00",
    duration: "2 hours",
    location: "Your Property",
    assignee: "Technical Team",
    status: "upcoming",
    description:
      "Initial site assessment for solar panel installation feasibility.",
  },
  {
    id: "2",
    title: "Installation Day 1",
    date: "2024-02-20",
    time: "08:00",
    duration: "Full day",
    location: "Your Property",
    assignee: "Installation Team",
    status: "upcoming",
    description: "First day of solar panel installation.",
  },
  {
    id: "3",
    title: "Final Inspection",
    date: "2024-02-22",
    time: "14:00",
    duration: "1 hour",
    location: "Your Property",
    assignee: "Quality Assurance",
    status: "upcoming",
    description: "Final inspection and system activation.",
  },
  {
    id: "4",
    title: "Initial Consultation",
    date: "2024-01-10",
    time: "10:00",
    duration: "1 hour",
    location: "Gabriel SOLAR ENERGY Office",
    assignee: "Sales Consultant",
    status: "completed",
    description: "Initial consultation to discuss your solar needs.",
  },
];

const Appointments = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedAppointment, setSelectedAppointment] = useState<
    (typeof mockAppointments)[0] | null
  >(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-eco-accent/20 text-primary";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const upcomingAppointments = mockAppointments.filter(
    (a) => a.status === "upcoming"
  );
  const pastAppointments = mockAppointments.filter(
    (a) => a.status === "completed"
  );

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
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
              >
                <CalendarIcon className="w-5 h-5" />
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
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
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Appointments</h1>
              <AppointmentBooking
                trigger={
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Appointments List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upcoming */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Upcoming Appointments
                  </h2>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                        className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold">{appointment.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {appointment.time} ({appointment.duration})
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {appointment.location}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            {appointment.assignee}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Past Appointments
                  </h2>
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-card rounded-xl border border-border p-4 opacity-75"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold">{appointment.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedAppointment.title}</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-muted-foreground mb-6">
              {selectedAppointment.description}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <span>
                  {new Date(selectedAppointment.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span>
                  {selectedAppointment.time} ({selectedAppointment.duration})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{selectedAppointment.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span>{selectedAppointment.assignee}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                Reschedule
              </Button>
              <Button variant="destructive" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
