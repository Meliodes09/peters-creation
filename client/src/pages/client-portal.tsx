import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, History, MessageCircle, User, Calendar, DollarSign } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Client, Booking } from "@shared/schema";

export default function ClientPortal() {
  const [clientEmail, setClientEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.title = "Client Portal - Peter's Creation Catering Services";
  }, []);

  const { data: client } = useQuery<Client>({
    queryKey: ["/api/clients", clientEmail],
    enabled: !!clientEmail && isLoggedIn,
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/clients", clientEmail, "bookings"],
    enabled: !!clientEmail && isLoggedIn,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientEmail) {
      setIsLoggedIn(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const upcomingBookings = bookings?.filter(booking => new Date(booking.eventDate) > new Date()) || [];
  const pastBookings = bookings?.filter(booking => new Date(booking.eventDate) <= new Date()) || [];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-primary mr-2" />
                <span className="font-serif text-2xl text-primary">Client Portal</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Access Portal
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">
                Welcome back, {client?.fullName || "Client"}
              </h1>
              <p className="text-primary-200">{client?.email}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-primary-200">Member since</div>
              <div className="font-semibold">
                {client?.memberSince ? new Date(client.memberSince).toLocaleDateString() : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Booking History</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/#booking">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-secondary text-white">
                  <CardContent className="p-6 text-center">
                    <Plus className="h-8 w-8 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">New Booking</h3>
                    <p className="text-sm opacity-90">Book another event</p>
                  </CardContent>
                </Card>
              </Link>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-sage text-white">
                <CardContent className="p-6 text-center">
                  <History className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Past Events</h3>
                  <p className="text-sm opacity-90">View booking history</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-accent text-white">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                  <p className="text-sm opacity-90">Send an inquiry</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No upcoming events. <Link href="/#booking" className="text-primary underline">Book your next event</Link>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="bg-cream rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h5 className="font-semibold text-lg">{booking.eventType}</h5>
                            <p className="text-gray-600">
                              {formatDateTime(booking.eventDate, booking.eventTime)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Guests:</span>
                            <span className="font-medium ml-1">{booking.guestCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <span className="font-medium ml-1">{booking.eventLocation || "TBD"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <span className="font-medium ml-1">
                              {booking.totalAmount ? formatCurrency(booking.totalAmount) : "TBD"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Booking History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Recent History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pastBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No past events found.</p>
                ) : (
                  <div className="space-y-3">
                    {pastBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium">{booking.eventType}</div>
                          <div className="text-gray-600 text-sm">
                            {formatDateTime(booking.eventDate)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {booking.totalAmount ? formatCurrency(booking.totalAmount) : "N/A"}
                          </div>
                          <div className="text-green-600 text-sm font-medium">Completed</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {!bookings || bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No bookings found. <Link href="/#booking" className="text-primary underline">Make your first booking</Link>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{booking.eventType}</h3>
                            <p className="text-gray-600">
                              {formatDateTime(booking.eventDate, booking.eventTime)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">Guests:</span>
                            <span className="font-medium ml-1">{booking.guestCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <span className="font-medium ml-1">{booking.eventLocation || "TBD"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <span className="font-medium ml-1">
                              {booking.totalAmount ? formatCurrency(booking.totalAmount) : "TBD"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Booked:</span>
                            <span className="font-medium ml-1">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {booking.specialRequests && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-sm text-gray-700 mb-2">Special Requests:</h4>
                            <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Client Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Preferences management coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  No messages at this time.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
