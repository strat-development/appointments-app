import * as React from 'react';

interface NewAppointmentEmailTemplateProps {
  firstName: string;
  date: string;
}

export const NewAppointmentEmailTemplate: React.FC<Readonly<NewAppointmentEmailTemplateProps>> = ({
  firstName,
  date
}) => (
  <div className='flex flex-col items-center gap-8'>
    <img src="https://github.com/strat-development/appointments-app/blob/master/public/Visio_logo.svg" alt="Logo" width={100} height={100} />
    <h1 className='text-2xl'>Hello, {firstName}!</h1>
    <div className='flex flex-col gap-4'>
      <p className='text-lg'>Your visit has been scheduled successfully.</p>
      <br />
      <br />
      <p className='text-lg text-black/70'>
        Date: {date}
      </p>
    </div>
    <a className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
      href="https://visioo.vercel.app">
      Go to website
    </a>
  </div>
);