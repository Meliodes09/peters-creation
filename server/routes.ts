import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertBookingSchema, insertInquirySchema } from "@shared/schema";
import { z } from "zod";

const bookingFormSchema = insertBookingSchema.extend({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
});

const inquiryFormSchema = insertInquirySchema;

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // Get specific package
  app.get("/api/packages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackage(id);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = bookingFormSchema.parse(req.body);
      const { fullName, email, phone, ...bookingData } = validatedData;

      // Check if client exists, if not create one
      let client = await storage.getClientByEmail(email);
      if (!client) {
        client = await storage.createClient({
          fullName,
          email,
          phone,
        });
      }

      // Calculate total amount if package is selected
      let totalAmount = bookingData.totalAmount;
      if (bookingData.packageId && !bookingData.isCustomPackage) {
        const pkg = await storage.getPackage(bookingData.packageId);
        if (pkg) {
          totalAmount = (parseFloat(pkg.pricePerPerson) * bookingData.guestCount).toFixed(2);
        }
      }

      const booking = await storage.createBooking({
        ...bookingData,
        clientId: client.id,
        totalAmount,
      });

      // TODO: Send confirmation email
      console.log(`Booking confirmation email would be sent to ${email}`);

      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get client bookings
  app.get("/api/clients/:email/bookings", async (req, res) => {
    try {
      const client = await storage.getClientByEmail(req.params.email);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const bookings = await storage.getBookingsByClient(client.id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get client info
  app.get("/api/clients/:email", async (req, res) => {
    try {
      const client = await storage.getClientByEmail(req.params.email);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  // Create inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = inquiryFormSchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);

      // TODO: Send inquiry confirmation email
      console.log(`Inquiry confirmation email would be sent to ${validatedData.clientEmail}`);

      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);

      // TODO: Send contact form email
      console.log(`Contact form email would be sent from ${validatedData.email}`);

      res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Admin routes
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/admin/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.patch("/api/admin/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.updateBooking(id, req.body);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  app.patch("/api/admin/inquiries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const inquiry = await storage.updateInquiry(id, req.body);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
