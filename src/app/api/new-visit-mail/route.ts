import { NewAppointmentEmailTemplate } from "@/emails/NewVisitTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, userFirstname, visitDate, businessName } = await request.json();

        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Hello world',
            react: NewAppointmentEmailTemplate({ 
                firstName: userFirstname,
                date: visitDate
            }) as React.ReactElement,
        });

        if (error) {
            console.error('Error sending email:', error);
            return new Response(JSON.stringify({ error }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Email sent successfully" }), { status: 200 });

    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}