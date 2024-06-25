"use client"

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
    return (
        <>
            <div className='flex items-center justify-center w-screen h-screen'>
                <div className='w-[300px] h-[300px]'>
                    <DotLottieReact
                        src="https://lottie.host/0e5e479c-e9e5-449a-9bf6-1ce480f4d27e/U75bQSx24w.json"
                        loop
                        autoplay
                        autoResizeCanvas
                    />
                </div>
            </div>
        </>
    )
}