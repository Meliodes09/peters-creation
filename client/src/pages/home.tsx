import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import PackagesSection from "@/components/packages-section";
import BookingForm from "@/components/booking-form";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Peter's Creation Catering Services - Professional Catering Solutions";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional catering services for corporate events, weddings, and special occasions. Book online today for exceptional culinary experiences tailored to your budget and preferences.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Professional catering services for corporate events, weddings, and special occasions. Book online today for exceptional culinary experiences tailored to your budget and preferences.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <PackagesSection />
      <BookingForm />
      <ContactSection />
      <Footer />
    </div>
  );
}
