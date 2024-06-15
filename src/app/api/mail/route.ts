import { useLocation } from "react-router-dom";
import { request } from "http";
import { Resend } from "resend";
import { NewAppointmentEmailTemplate } from "@/emails/NewAppointmentEmailTemplate";
 
const resend = new Resend(process.env.RESEND_API_KEY);

// const location = useLocation();
// let userId = location.state.userId;

export  async function POST(request: Request, res: Response) {
    // const {email,userFirstname} = await request.json();
    const {data,error}=await resend.emails.send({
        from: "Dawid <onboarding@resend.dev>",
        to:"dawidsd123@gmail.com",
        subject:"",
        text: "", 
        react:NewAppointmentEmailTemplate({ firstName: 'John' })
    })

    if (error){
        return Response.json(error)
    }
    return Response.json({message:"Email sent successfully"});
}