import { Footer } from "@/components/landing-page/Footer";
import { Navbar } from "@/components/landing-page/Navbar";
import { Call, Like, Link, Text } from "iconsax-react";
import Image from "next/image";
import { IoMdImage } from "react-icons/io";


export default function PositionsFeaturesPage() {
    return (
        <>
            <div className="overflow-hidden">
                <Navbar />
                <div className="flex flex-col items-center gap-32 mt-32 px-16 m-auto">
                    <div className="flex justify-between gap-8 items-center">
                        <Image className="w-[55%] shadow-xl rounded-xl"
                            src="/BusinessPage/business-page-view.png" width={2000} height={2000} alt="positions" />
                        <div className="flex justify-start w-full">
                            <div className="flex flex-col gap-4 justify-self-center w-fit">
                                <h1 className="text-4xl tracking-wider font-bold text-[#5100D6]">Custom business page</h1>
                                <p className="text-black/70 w-[500px]">
                                    Make your business stand out with a fully customizable and unique business profile page
                                </p>
                                <ul className="flex flex-col gap-6 mt-6">
                                    <li className="flex gap-3">
                                        <IoMdImage className="text-[#5100D6]" size="18" />
                                        <p className="text-black/70 text-sm">
                                            Add images and videos to your business page
                                        </p>
                                    </li>
                                    <li className="flex gap-3">
                                        <Link className="text-[#5100D6]" size="18" />
                                        <p className="text-black/70 text-sm">
                                            Add links to your social media profiles
                                        </p>
                                    </li>
                                    <li className="flex gap-3">
                                        <Like className="text-[#5100D6]" size="18" />
                                        <p className="text-black/70 text-sm">
                                            Social media sharing
                                        </p>
                                    </li>
                                    <li className="flex gap-3">
                                        <Call className="text-[#5100D6]" size="18" />
                                        <p className="text-black/70 text-sm">
                                            Contact information
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}