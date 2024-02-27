import { Navbar } from "@/components/dashboard/Navbar";
import StatisticInfo from "@/features/dashboard/statistics/StatisticInfo";

export default function StatisticsPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main><>
                <StatisticInfo />
                </>
            </main>
        </div>
    );
}