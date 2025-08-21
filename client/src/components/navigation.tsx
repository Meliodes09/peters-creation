import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Utensils, Menu } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Utensils className="text-primary text-2xl mr-3" />
            <span className="font-serif font-bold text-xl text-primary">Peter's Creation</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("packages")}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Packages
            </button>
            <button
              onClick={() => scrollToSection("booking")}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Book Now
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/client-portal">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Client Portal
              </Button>
            </Link>
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  scrollToSection("home");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 text-left"
              >
                Home
              </button>
              <button
                onClick={() => {
                  scrollToSection("packages");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 text-left"
              >
                Packages
              </button>
              <button
                onClick={() => {
                  scrollToSection("booking");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 text-left"
              >
                Book Now
              </button>
              <button
                onClick={() => {
                  scrollToSection("contact");
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-primary transition-colors font-medium py-2 px-4 text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
