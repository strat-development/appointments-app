import Image from 'next/image';
import Link from 'next/link';
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
        <img src="https://github.com/strat-development/appointments-app/blob/master/public/Visio_logo.svg" alt="Logo" width={100} height={100} />
        <h1 className='text-2xl'>Hello, {firstName}!</h1>
        <div className='flex flex-col gap-4'>
            <p className='text-lg'>Your appointment at {business_name} has been edited.</p>
            <br />
            <br />
            <p className='text-lg text-black/70'>
                New visit date: {date}
                Visit status: {status}
            </p>
        </div>
        <a className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
            href="https://visioo.vercel.app">
            Go to website
        </a>
    </div>
);