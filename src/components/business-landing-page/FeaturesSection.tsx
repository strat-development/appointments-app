export const FeaturesSection = () => {
    return (
        <>
            <div className="flex flex-col gap-16">
                <h2 className="text-4xl font-bold tracking-wider text-transparent bg-gradient-to-b from-[#5100D6] to-[#A168FF] bg-clip-text">Our key features</h2>
                <div className="grid grid-cols-5 gap-8">
                    <div className="flex flex-col gap-4 rounded-xl p-4 justify-start border-[1px] col-span-3 h-[600px] shadow-lg hover:scale-110 transition bg-white">
                        <h3 className="text-3xl font-semibold tracking-wider text-transparent bg-gradient-to-b from-[#5100D6] to-[#A168FF] bg-clip-text">
                            Easy to use schedule
                        </h3>
                        <p className="text-black/70 w-[70%]">
                            Discover effortless appointment management with our dynamic schedule. Track visits, create, delete, and edit appointments seamlessly
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl p-4 justify-start border-[1px] col-span-2 h-[600px] shadow-lg hover:scale-110 transition bg-white">
                        <h3 className="text-3xl font-semibold tracking-wider text-transparent bg-gradient-to-b from-[#5100D6] to-[#A168FF] bg-clip-text">
                            Positions
                        </h3>
                        <p className="text-black/70 w-[70%]">
                            Show your clients the capabilities of your business by simply adding the positions you have
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl p-4 justify-start border-[1px] col-span-5 h-[600px] shadow-lg hover:scale-110 transition bg-white">
                        <h3 className="text-3xl font-semibold tracking-wider text-transparent bg-gradient-to-b from-[#5100D6] to-[#A168FF] bg-clip-text">
                            Custom business page
                        </h3>
                        <p className="text-black/70 w-[40%]">
                            Make your business stand out with a fully customizable and unique business profile page
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl p-4 justify-start border-[1px] col-span-2 h-[600px] shadow-lg hover:scale-110 transition bg-white">
                        <h3 className="text-3xl font-semibold tracking-wider text-transparent bg-gradient-to-b from-[#5100D6] to-[#A168FF] bg-clip-text">
                            Email templates
                        </h3>
                        <p className="text-black/70 w-[70%]">
                            Save your time by creating an automatic notifications using our email templates
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl p-4 justify-start border-[1px] col-span-3 h-[600px] shadow-lg hover:scale-110 transition bg-white">
                        <h3 className="text-3xl font-semibold tracking-wider text-transparent bg-gradient-to-b from-[#5100D6] to-[#A168FF] bg-clip-text">
                            Management tools
                        </h3>
                        <p className="text-black/70 w-[70%]">
                            “Create, edit, delete” you can do everything you need using our managing dashboard for business
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}