import { clients, bookings, packages, inquiries, type Client, type InsertClient, type Booking, type InsertBooking, type Package, type InsertPackage, type Inquiry, type InsertInquiry } from "@shared/schema";

export interface IStorage {
  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  
  // Package operations
  getAllPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: number, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  
  // Booking operations
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByClient(clientId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  
  // Inquiry operations
  getAllInquiries(): Promise<Inquiry[]>;
  getInquiry(id: number): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: number, inquiry: Partial<InsertInquiry>): Promise<Inquiry | undefined>;
}

export class MemStorage implements IStorage {
  private clients: Map<number, Client>;
  private packages: Map<number, Package>;
  private bookings: Map<number, Booking>;
  private inquiries: Map<number, Inquiry>;
  private currentClientId: number;
  private currentPackageId: number;
  private currentBookingId: number;
  private currentInquiryId: number;

  constructor() {
    this.clients = new Map();
    this.packages = new Map();
    this.bookings = new Map();
    this.inquiries = new Map();
    this.currentClientId = 1;
    this.currentPackageId = 1;
    this.currentBookingId = 1;
    this.currentInquiryId = 1;
    
    // Initialize with default packages
    this.initializeDefaultPackages();
  }

  private initializeDefaultPackages() {
    const defaultPackages: InsertPackage[] = [
      {
        name: "Corporate Elegance",
        description: "Perfect for business meetings, conferences, and corporate events. Professional presentation with gourmet flavors.",
        pricePerPerson: "45.00",
        minGuests: 20,
        features: ["Gourmet sandwich platters", "Fresh fruit and cheese boards", "Premium beverages included", "Professional service staff"],
        category: "corporate",
        isActive: true,
      },
      {
        name: "Wedding Bliss",
        description: "Make your special day unforgettable with our premium wedding catering featuring multi-course meals and elegant service.",
        pricePerPerson: "95.00",
        minGuests: 50,
        features: ["Three-course plated dinner", "Cocktail hour appetizers", "Wedding cake service", "Full bar service available"],
        category: "wedding",
        isActive: true,
      },
      {
        name: "Casual Gatherings",
        description: "Perfect for family reunions, birthday parties, and casual celebrations. Delicious comfort food in a relaxed setting.",
        pricePerPerson: "28.00",
        minGuests: 15,
        features: ["BBQ buffet with all fixings", "Homestyle side dishes", "Soft drinks and water", "Setup and cleanup"],
        category: "casual",
        isActive: true,
      },
    ];

    defaultPackages.forEach(pkg => {
      this.createPackage(pkg);
    });
  }

  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(client => client.email === email);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentClientId++;
    const client: Client = {
      ...insertClient,
      id,
      memberSince: new Date(),
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, clientUpdate: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...clientUpdate };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  // Package operations
  async getAllPackages(): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(pkg => pkg.isActive);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = this.currentPackageId++;
    const pkg: Package = {
      ...insertPackage,
      id,
      isActive: insertPackage.isActive ?? true,
    };
    this.packages.set(id, pkg);
    return pkg;
  }

  async updatePackage(id: number, packageUpdate: Partial<InsertPackage>): Promise<Package | undefined> {
    const pkg = this.packages.get(id);
    if (!pkg) return undefined;
    
    const updatedPackage = { ...pkg, ...packageUpdate };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }

  // Booking operations
  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByClient(clientId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.clientId === clientId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = {
      ...insertBooking,
      id,
      packageId: insertBooking.packageId ?? null,
      eventLocation: insertBooking.eventLocation ?? null,
      totalAmount: insertBooking.totalAmount ?? null,
      specialRequests: insertBooking.specialRequests ?? null,
      budgetRange: insertBooking.budgetRange ?? null,
      isCustomPackage: insertBooking.isCustomPackage ?? false,
      status: insertBooking.status ?? "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: number, bookingUpdate: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...bookingUpdate, updatedAt: new Date() };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Inquiry operations
  async getAllInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = {
      id,
      clientName: insertInquiry.clientName,
      clientEmail: insertInquiry.clientEmail,
      clientPhone: insertInquiry.clientPhone ?? null,
      eventType: insertInquiry.eventType,
      guestCount: insertInquiry.guestCount,
      budgetRange: insertInquiry.budgetRange,
      message: insertInquiry.message,
      status: insertInquiry.status ?? "new",
      createdAt: new Date(),
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async updateInquiry(id: number, inquiryUpdate: Partial<InsertInquiry>): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;
    
    const updatedInquiry = { ...inquiry, ...inquiryUpdate };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }
}

export const storage = new MemStorage();
