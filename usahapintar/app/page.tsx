import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import HPPCalculator from "@/components/HPPCalculator";
import Testimonials from "@/components/Testimonials";
import LatestArticles from "@/components/LatestArticles";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <HPPCalculator />
      <Testimonials />
      <LatestArticles />
      <CTASection />
      <Footer />
    </main>
  );
}
