import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-r from-primary to-sage min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
          Exceptional Catering <br />
          <span className="text-accent">Experiences</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
          From intimate gatherings to grand celebrations, we create unforgettable culinary experiences 
          tailored to your vision and budget.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-secondary text-white hover:bg-secondary/90 px-8 py-4 text-lg font-semibold shadow-lg"
            onClick={() => scrollToSection("booking")}
          >
            Book Your Event
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
            onClick={() => scrollToSection("packages")}
          >
            View Packages
          </Button>
        </div>
      </div>
    </section>
  );
}
