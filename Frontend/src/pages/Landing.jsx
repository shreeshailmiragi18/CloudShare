import { useClerk, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CTASection from "../components/Landing/CTASection";
import FeatureSection from "../components/Landing/FeatureSection";
import FooterSection from "../components/Landing/FooterSection";
import HeroSection from "../components/Landing/HeroSection";
import PricingSection from "../components/Landing/PricingSection";
import TestimonialsSection from "../components/Landing/TestimonialSection";
import { features, pricingPlans, testimonials } from "../assets/data";

const Landing = () => {
  const { openSignIn, openSignUp } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="landing-page bg-gradient-to-b from-gray-400 to-gray-100">
      {/* hero section */}
      <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />

      {/* Features section */}
      <FeatureSection features={features} />

      {/* pricing section */}
      <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp} />

      {/* Testimonials section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* CTA section */}
      <CTASection openSignUp={openSignUp} />

      {/* Footer section */}
      <FooterSection />
    </div>
  );
};

export default Landing;
