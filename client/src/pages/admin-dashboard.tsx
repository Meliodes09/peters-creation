import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CalendarCheck, CheckCircle, Users, DollarSign } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Booking, Inquiry } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Admin Dashboard - Peter's Creation Catering Services";
  }, []);

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/admin/bookings"],
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries"],
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/admin/bookings/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Booking Updated",
        description: "Booking status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update booking status.",
        variant: "destructive",
      });
    },
  });

  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/admin/inquiries/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Updated",
        description: "Inquiry status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update inquiry status.",
        variant: "destructive",
      });
    },
  });

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
      case "new":
        return "bg-purple-100 text-purple-800";
      case "responded":
        return "bg-blue-100 text-blue-800";
      case "converted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pendingBookings = bookings?.filter(b => b.status === "pending") || [];
  const confirmedBookings = bookings?.filter(b => b.status === "confirmed") || [];
  const totalRevenue = bookings?.reduce((sum, booking) => {
    return sum + (booking.totalAmount ? parseFloat(booking.totalAmount) : 0);
  }, 0) || 0;
  const monthlyRevenue = bookings?.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    const now = new Date();
    return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
  }).reduce((sum, booking) => {
    return sum + (booking.totalAmount ? parseFloat(booking.totalAmount) : 0);
  }, 0) || 0;

  const newInquiries = inquiries?.filter(i => i.status === "new") || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Peter's Creation Admin</h1>
              <p className="text-primary-200">Management Dashboard</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <div className="text-sm text-primary-200">Monthly Revenue</div>
                <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
              </div>
              <Link href="/">
                <Button variant="outline" className="text-primary border-white hover:bg-white hover:text-primary">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CalendarCheck className="text-blue-600 text-2xl mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{pendingBookings.length}</div>
                      <div className="text-gray-600">Pending Bookings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 text-2xl mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">{confirmedBookings.length}</div>
                      <div className="text-gray-600">Confirmed This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="text-amber-600 text-2xl mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-amber-600">{bookings?.length || 0}</div>
                      <div className="text-gray-600">Total Bookings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="text-purple-600 text-2xl mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{formatCurrency(monthlyRevenue)}</div>
                      <div className="text-gray-600">Monthly Revenue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bookings Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-8">Loading bookings...</div>
                ) : !bookings || bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No bookings found.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>Client #{booking.clientId}</TableCell>
                          <TableCell>{booking.eventType}</TableCell>
                          <TableCell>{formatDateTime(booking.eventDate)}</TableCell>
                          <TableCell>{booking.guestCount}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {booking.totalAmount ? formatCurrency(booking.totalAmount) : "TBD"}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {booking.status === "pending" && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => updateBookingMutation.mutate({ id: booking.id, status: "confirmed" })}
                                  disabled={updateBookingMutation.isPending}
                                >
                                  Confirm
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // TODO: Open booking details modal
                                  toast({
                                    title: "Booking Details",
                                    description: `Booking #${booking.id} details would open here.`,
                                  });
                                }}
                              >
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="text-center py-8">Loading inquiries...</div>
                ) : !inquiries || inquiries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No inquiries found.</div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{inquiry.clientName}</h3>
                            <p className="text-gray-600">{inquiry.clientEmail}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(inquiry.status)}>
                              {inquiry.status}
                            </Badge>
                            <div className="text-sm text-gray-500 mt-1">
                              {new Date(inquiry.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-gray-700">{inquiry.message}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">Event:</span>
                            <span className="font-medium ml-1">{inquiry.eventType}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Guests:</span>
                            <span className="font-medium ml-1">{inquiry.guestCount}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Budget:</span>
                            <span className="font-medium ml-1">{inquiry.budgetRange}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => {
                              updateInquiryMutation.mutate({ id: inquiry.id, status: "responded" });
                              // TODO: Open email compose modal
                              toast({
                                title: "Quote Sent",
                                description: `Custom quote email would be sent to ${inquiry.clientEmail}`,
                              });
                            }}
                            disabled={updateInquiryMutation.isPending}
                          >
                            Send Quote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // TODO: Initiate phone call
                              toast({
                                title: "Call Client",
                                description: `Call ${inquiry.clientPhone || "phone number not provided"}`,
                              });
                            }}
                          >
                            Call Client
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Calendar view coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Client management features coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Business Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Revenue Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-bold">{formatCurrency(totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Revenue:</span>
                        <span className="font-bold">{formatCurrency(monthlyRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Per Booking:</span>
                        <span className="font-bold">
                          {bookings && bookings.length > 0 
                            ? formatCurrency(totalRevenue / bookings.length)
                            : formatCurrency(0)
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Booking Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Bookings:</span>
                        <span className="font-bold">{bookings?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-bold">{pendingBookings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confirmed:</span>
                        <span className="font-bold">{confirmedBookings.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
