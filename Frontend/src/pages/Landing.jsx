import CTASection from "../components/Landing/CTASection";
import FeatureSection from "../components/Landing/FeatureSection";
import FooterSection from "../components/Landing/FooterSection";
import HeroSection from "../components/Landing/HeroSection";
import PricingSection from "../components/Landing/PricingSection";
import TestimonialsSection from "../components/Landing/TestimonialSection";
import { features, pricingPlans } from "../assets/data";

const Landing = () => {
  return (
    <div className="landing-page bg-gradient-to-b from-gray-400 to-gray-100">
      {/* hero section */}
      <HeroSection />

      {/* Features section */}
      <FeatureSection features={features} />

      {/* pricing section */}
      <PricingSection pricingPlans={pricingPlans} />

      {/* Testimonials section */}
      <TestimonialsSection />

      {/* CTA section */}
      <CTASection />

      {/* Footer section */}
      <FooterSection />
    </div>
  );
};

export default Landing;
