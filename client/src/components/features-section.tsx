import { CalendarCheck, Palette, Award } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: CalendarCheck,
      title: "Easy Online Booking",
      description: "Book your catering service in minutes with our streamlined online system. Check availability, compare packages, and secure your date instantly."
    },
    {
      icon: Palette,
      title: "Custom Packages",
      description: "Tailored catering solutions designed around your budget and preferences. From casual to elegant, we create the perfect menu for your event."
    },
    {
      icon: Award,
      title: "Professional Service",
      description: "Award-winning catering team with years of experience in corporate events, weddings, and special occasions. Excellence guaranteed."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-primary mb-4">Why Choose Peter's Creation?</h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Professional catering services with a personal touch, delivering excellence in every event.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-8 rounded-xl bg-cream hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="text-white text-2xl" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-primary mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
