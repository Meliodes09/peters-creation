import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Package } from "@shared/schema";

export default function PackagesSection() {
  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case "corporate":
        return "bg-accent text-white";
      case "wedding":
        return "bg-secondary text-white";
      case "casual":
        return "bg-sage text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getBadgeText = (category: string) => {
    switch (category) {
      case "corporate":
        return "Popular";
      case "wedding":
        return "Premium";
      case "casual":
        return "Value";
      default:
        return "Special";
    }
  };

  if (isLoading) {
    return (
      <section id="packages" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary mb-4">Our Catering Packages</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Choose from our carefully crafted packages or let us create something unique for your event.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-2 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-primary mb-4">Our Catering Packages</h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Choose from our carefully crafted packages or let us create something unique for your event.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {packages?.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={pkg.category === "corporate" 
                  ? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
                  : pkg.category === "wedding"
                  ? "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
                  : "https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
                }
                alt={`${pkg.name} catering setup`}
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-2xl font-semibold text-primary">{pkg.name}</h3>
                  <Badge className={getBadgeVariant(pkg.category)}>
                    {getBadgeText(pkg.category)}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-6">{pkg.description}</p>
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <Check className="text-sage mr-3 h-4 w-4" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(pkg.pricePerPerson)}
                    </span>
                    <span className="text-gray-600">/person</span>
                  </div>
                  <span className="text-sm text-gray-500">Min. {pkg.minGuests} guests</span>
                </div>
                <Button
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  onClick={scrollToBooking}
                >
                  Select Package
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Don't see what you're looking for? We create custom packages for any budget and occasion.
          </p>
          <Button
            size="lg"
            className="bg-secondary text-white hover:bg-secondary/90"
            onClick={scrollToBooking}
          >
            Request Custom Quote
          </Button>
        </div>
      </div>
    </section>
  );
}
