import { Navbar } from "@/components/dashboard/Navbar";
import { SubscriptionSection } from "@/features/dashboard/subscriptions/SubscriptionSection";

export default function SubscriptionsPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main>
                <SubscriptionSection />
                <h1>Subscriptions</h1>
            </main>
        </div>
    );
}