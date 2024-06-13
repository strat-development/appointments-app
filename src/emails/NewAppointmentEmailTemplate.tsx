import * as React from 'react';

interface NewAppointmentEmailTemplateProps {
  firstName: string;
}

export const NewAppointmentEmailTemplate: React.FC<Readonly<NewAppointmentEmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
);