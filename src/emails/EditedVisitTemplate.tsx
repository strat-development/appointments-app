import * as React from 'react';

interface EditedVisitTemplateProps {
    firstName: string;
    business_name: string;
    date: string;
    status: string;
}

export const EditedVisitTemplate: React.FC<Readonly<EditedVisitTemplateProps>> = ({
    firstName,
    business_name,
    date,
    status
}) => (
    <div className='flex flex-col items-center gap-8'>
        <img src="/Visio_logo.svg" alt="Logo" width={100} height={100} />
        <h1 className='text-2xl'>Hello, <span className='text-violet-500 font-bold'>{firstName}</span>!</h1>
        <div className='flex flex-col gap-4'>
            <p className='text-lg text-black/70'>Your appointment at <span className='text-xl text-black font-semibold'>{business_name}</span> has been edited.</p>
            <br />
            <br />
            <div className='flex flex-col gap-2'>
                <p className='text-lg text-black/70'>
                    <span className='text-black'>New visit date:</span> {date}
                </p>
                <p className='text-lg text-black/70'>
                    <span className='text-black'>Status: </span>{status}
                </p>
            </div>
        </div>
        <a className="px-4 py-2 text-center rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
            href="https://visioo.vercel.app">
            Go to website
        </a>
    </div>
);