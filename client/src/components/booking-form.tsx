import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Package } from "@shared/schema";

const bookingSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  guestCount: z.number().min(1, "Number of guests is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  eventLocation: z.string().optional(),
  selectedPackage: z.string().optional(),
  customPackage: z.boolean().default(false),
  budgetRange: z.string().optional(),
  specialRequests: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingForm() {
  const [showBudgetSection, setShowBudgetSection] = useState(false);
  const { toast } = useToast();

  const { data: packages } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventType: "",
      guestCount: 0,
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      selectedPackage: "",
      customPackage: false,
      budgetRange: "",
      specialRequests: "",
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const bookingData = {
        ...data,
        packageId: data.selectedPackage ? parseInt(data.selectedPackage) : null,
        isCustomPackage: data.customPackage,
        eventDate: new Date(data.eventDate).toISOString(),
      };
      return apiRequest("POST", "/api/bookings", bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Submitted!",
        description: "You will receive a confirmation email within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to submit booking request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createInquiryMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const inquiryData = {
        clientName: data.fullName,
        clientEmail: data.email,
        clientPhone: data.phone,
        eventType: data.eventType,
        guestCount: data.guestCount,
        budgetRange: data.budgetRange || "",
        message: data.specialRequests || `Custom package request for ${data.eventType} with ${data.guestCount} guests.`,
      };
      return apiRequest("POST", "/api/inquiries", inquiryData);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted!",
        description: "We'll get back to you with a custom quote within 24 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Inquiry Failed",
        description: error.message || "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    if (data.customPackage) {
      createInquiryMutation.mutate(data);
    } else {
      createBookingMutation.mutate(data);
    }
  };

  const watchCustomPackage = form.watch("customPackage");

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-primary mb-4">Book Your Event</h2>
          <p className="text-gray-600 text-xl">
            Fill out the form below to check availability and receive your personalized quote.
          </p>
        </div>

        <Card className="bg-cream shadow-lg">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Event Details */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-primary mb-6">Event Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="corporate">Corporate Event</SelectItem>
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="birthday">Birthday Party</SelectItem>
                              <SelectItem value="anniversary">Anniversary</SelectItem>
                              <SelectItem value="graduation">Graduation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guestCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Guests *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="10"
                              placeholder="e.g., 50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Time *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="eventLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Venue name or address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Package Selection */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-primary mb-6">Package Selection</h3>
                  <FormField
                    control={form.control}
                    name="selectedPackage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid md:grid-cols-3 gap-4"
                          >
                            {packages?.map((pkg) => (
                              <div key={pkg.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={pkg.id.toString()} id={`package-${pkg.id}`} />
                                <Label
                                  htmlFor={`package-${pkg.id}`}
                                  className="border-2 border-gray-300 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer flex-1"
                                >
                                  <div className="text-center">
                                    <div className="font-semibold text-primary">{pkg.name}</div>
                                    <div className="text-gray-600">${pkg.pricePerPerson}/person</div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="customPackage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                setShowBudgetSection(!!checked);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I prefer a custom package based on my budget</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Budget Range */}
                {(watchCustomPackage || showBudgetSection) && (
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-primary mb-6">Budget Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="budgetRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="under-1000">Under $1,000</SelectItem>
                                <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                                <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                                <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                                <SelectItem value="over-10000">Over $10,000</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requests</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any special dietary requirements, themes, or requests..."
                                className="h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-primary mb-6">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-secondary text-white hover:bg-secondary/90 px-12 py-4 text-lg font-semibold shadow-lg"
                    disabled={createBookingMutation.isPending || createInquiryMutation.isPending}
                  >
                    {createBookingMutation.isPending || createInquiryMutation.isPending
                      ? "Submitting..."
                      : watchCustomPackage
                      ? "Submit Custom Inquiry"
                      : "Request Quote & Check Availability"
                    }
                  </Button>
                  <p className="text-gray-600 text-sm mt-3">
                    You'll receive a detailed quote and availability confirmation within 24 hours.
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
