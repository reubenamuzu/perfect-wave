import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Bundle from "@/models/Bundle";
import Frame from "@/models/Frame";
import Review from "@/models/Review";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import FeaturedFrames from "@/components/home/FeaturedFrames";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import CTASection from "@/components/home/CTASection";
import type { IBundle, IFrame, IReview } from "@/types";

export const metadata: Metadata = {
  title: "Perfect Wave — Data Bundles & Picture Frames in Ghana",
  description:
    "Shop affordable MTN, Telecel & AirtelTigo data bundles and premium custom picture frames in Ghana. Fast WhatsApp ordering.",
};

export default async function HomePage() {
  let bundles: IBundle[] = [];
  let frames: IFrame[] = [];
  let reviews: IReview[] = [];

  try {
    await connectDB();
    const [rawBundles, rawFrames, rawReviews] = await Promise.all([
      Bundle.find({ isActive: true }).sort({ sortOrder: 1 }).limit(6).lean(),
      Frame.find({ isActive: true }).sort({ sortOrder: 1 }).limit(6).lean(),
      Review.find({ isApproved: true }).sort({ createdAt: -1 }).limit(3).lean(),
    ]);
    bundles = JSON.parse(JSON.stringify(rawBundles));
    frames = JSON.parse(JSON.stringify(rawFrames));
    reviews = JSON.parse(JSON.stringify(rawReviews));
  } catch {
    // DB not connected yet — show page with empty state
  }

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturedBundles bundles={bundles} />
      <FeaturedFrames frames={frames} />
      <HowItWorks />
      <TestimonialsPreview reviews={reviews} />
      <CTASection />
    </>
  );
}
