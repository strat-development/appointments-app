
import newAppointmentEmailTemplate from "../../../../emails/new-appointment-email-template";
import { request } from "http";
import {Resend} from "resend";
 
const resend = new Resend(process.env.RESEND_API_KEY);

export  async function POST(request: Request, res: Response) {
    // const {email,userFirstname} = await request.json();
    const {data,error}=await resend.emails.send({
        from: "Dawid <onboarding@resend.dev>",
        to:"dawidsd123@gmail.com",
        subject:"HUJU",
        react:newAppointmentEmailTemplate({ firstName: 'John' })
    })

    if (error){
        return Response.json(error)
    }
    return Response.json({message:"Email sent successfully"});
}