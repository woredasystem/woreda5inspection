
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { PrincipalMessage } from "@/components/sections/PrincipalMessage";
import { CommissionMembers } from "@/components/sections/CommissionMembers";
import { Footer } from "@/components/Footer";
import { woredaLeadership } from "@/data/leaders";
import { publicEnv } from "@/lib/env";

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* Administrator Message */}
            <PrincipalMessage principal={woredaLeadership.principal} />

            {/* News Section (Server Component) - Placed right above Members list */}
            <NewsSection />

            {/* Commission Members Section */}
            <CommissionMembers categories={woredaLeadership.categories} />

            {/* Footer */}
            <Footer woredaName={publicEnv.NEXT_PUBLIC_WOREDA_NAME} />
        </div>
    );
}
