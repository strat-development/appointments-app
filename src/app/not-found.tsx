import Link from "next/link"

export default () => {
    return (
        <main>
            <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
                <div className="max-w-lg mx-auto space-y-3 text-center">
                    <h3 className="text-violet-500 font-semibold">
                        404 Error
                    </h3>
                    <p className="text-gray-800 text-4xl font-semibold sm:text-5xl">
                        Page not found
                    </p>
                    <p className="text-gray-600">
                        Sorry, the page you are looking for could not be found or has been removed.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link href="/" className="bg-gradient-to-b text-center from-violet-600 to-violet-500 text-white px-8 py-2 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:py-4">
                            Go back
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}