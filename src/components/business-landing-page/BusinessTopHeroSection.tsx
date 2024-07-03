import Image from "next/image"

export const BusinessTopHeroSection = () => {
    return (
        <>
            <div className="relative flex items-center h-screen max-md:flex-col-reverse">
                <div className="flex flex-col items-start w-full gap-9 z-[10]">
                    <h1 className="text-6xl font-bold tracking-wider text-transparent bg-gradient-to-b from-[#5100D6] to-[#A168FF] bg-clip-text max-md:w-[60%] max-[600px]:text-5xl max-[520px]:text-4xl max-[440px]:w-fit max-[440px]:text-5xl max-[400px]:text-4xl">
                        Managing your business never been that easy
                    </h1>
                    <p className="text-black/70 text-xl w-[55%] max-md:text-lg max-[480px]:w-[65%] max-[420px]:w-fit">
                        Completely new approach to time and business management
                    </p>
                    <button className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-3 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-md:px-12 max-md:py-4 max-md:text-lg max-[400px]:px-10 max-[400px]:py-3">
                        Get Started
                    </button>
                    <div className="flex gap-8 max-[420px]:flex-col">
                        <Image className="max-md:w-[164px]"
                            src="/business-page-images/APPSTORE.svg" width={124} height={150} alt="App Store" />
                        <Image className="max-md:w-[164px]"
                            src="/business-page-images/GOOGLEPLAY.svg" width={124} height={150} alt="Google Play" />
                    </div>
                </div>
                <div className="w-[60%] flex items-end justify-end z-[10] max-md:absolute max-md:-z-40 max-md:right-[-25%] max-md:w-[300px] max-[500px]:w-[264px] max-[440px]:hidden">
                    <Image src="/business-page-images/PhoneTopHero.png" width={350} height={2000} alt="hero" />
                </div>
                <div className="absolute w-[1400px] h-[700px] blur-[100px] bg-[#A788FF]/30 rounded-full z-0 max-md:-z-50 max-[1200px]:hidden"></div>
            </div>
        </>
    )
}