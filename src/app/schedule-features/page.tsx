import { Footer } from "@/components/landing-page/Footer";
import { Navbar } from "@/components/landing-page/Navbar";
import { Calendar, Clock, Note, Star1, User } from "iconsax-react";
import Image from "next/image";

export default function ScheduleFeaturesPage() {
    return (
        <div className="overflow-hidden">
            <Navbar />
            <div className="flex flex-col items-center gap-32 mt-32 px-16 m-auto">
                <div className="flex justify-between gap-8 items-center">
                    <Image className="w-[55%] shadow-xl rounded-xl"
                        src="/Schedule/ScheduleView.png" width={2000} height={2000} alt="calendar" />
                    <div className="flex justify-start w-full">
                        <div className="flex flex-col gap-4 justify-self-center w-fit">
                            <h1 className="text-4xl tracking-wider font-bold text-[#5100D6]">Convinient schedule</h1>
                            <p className="text-black/70 w-[500px]">
                                We are constantly working on improving our schedule features to make it as convinient as possible for you.
                            </p>
                            <ul className="flex flex-col gap-6 mt-6">
                                <li className="flex gap-3">
                                    <Calendar className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Day, week and month view</p>
                                </li>
                                <li className="flex gap-3">
                                    <Star1 className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Fast visit creating</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-8 items-center">
                    <div className="flex justify-end w-full">
                        <div className="flex flex-col gap-4 justify-self-center w-fit">
                            <h1 className="text-4xl tracking-wider font-bold text-[#5100D6]">Detailed visits form</h1>
                            <p className="text-black/70 w-[500px]">
                                We are strive to improve our visit form to make it as convinient as possible for you.
                            </p>
                            <ul className="flex flex-col gap-6 mt-6">
                                <li className="flex gap-3">
                                    <User className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Client</p>
                                </li>
                                <li className="flex gap-3">
                                    <User className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Employee</p>
                                </li>
                                <li className="flex gap-3">
                                    <Clock className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Date and time</p>
                                </li>
                                <li className="flex gap-3">
                                    <Note className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Visit note</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Image className="w-[55%] shadow-xl rounded-xl"
                        src="/Schedule/ScheduleVisitModal.png" width={2000} height={2000} alt="calendar" />
                </div>
            </div>
            <Footer />
        </div>
    )
}