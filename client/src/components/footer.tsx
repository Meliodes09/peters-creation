import { Utensils } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export default function Footer() {
  const services = [
    "Corporate Catering",
    "Wedding Services",
    "Private Parties",
    "Custom Packages",
    "Event Planning",
  ];

  const quickLinks = [
    "About Us",
    "Our Menu",
    "Gallery",
    "Testimonials",
    "FAQ",
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <Utensils className="text-secondary text-2xl mr-3" />
              <span className="font-serif font-bold text-xl">Peter's Creation</span>
            </div>
            <p className="text-gray-400 mb-6">
              Creating exceptional catering experiences for over 10 years. Quality ingredients, professional service, unforgettable events.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <SiFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <SiInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <SiX className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3 text-gray-400">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li>(555) 123-CHEF</li>
              <li>hello@peterscreation.com</li>
              <li>
                123 Culinary Avenue<br />
                Food City, FC 12345
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Peter's Creation Catering Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
