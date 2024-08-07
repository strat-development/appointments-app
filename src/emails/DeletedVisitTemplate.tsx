import * as React from 'react';

interface DeletedVisitsTemplateProps {
    firstName: string;
    business_name: string;
}

export const DeletedVisitTemplate: React.FC<Readonly<DeletedVisitsTemplateProps>> = ({
    firstName,
    business_name,
}) => (
    <div className='flex flex-col items-center gap-8'>
        <img src="https://github.com/strat-development/appointments-app/blob/master/public/Visio_logo.svg" alt="Logo" width={100} height={100} />
        <h1 className='text-2xl'>Hello, {firstName}!</h1>
        <div className='flex flex-col gap-4'>
            <h2 className='text-xl'>
                😔
            </h2>
            <p className='text-lg'>
                We&apos;re sorry to inform you that your appointment at {business_name} has been deleted.
            </p>
            <br />
            <br />
        </div>
        <a className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
            href="https://visioo.vercel.app">
            Go to website
        </a>
    </div>
);