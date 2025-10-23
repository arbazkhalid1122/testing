import { FAQ } from "@/components/FAQ";
import Hero from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import RecommendedBlogs from "@/components/RecommendedBlogs";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Pricing />
      <RecommendedBlogs recommended={false} />
      <FAQ />
    </>
  );
}
