import { resendClient,sender} from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplates.js"
export const sendWelcomeEmail = async (name, email, clientURL) => {
  const {data,error}=await resendClient.emails.send({
    from:`${sender.name} <${sender.email}>`,
    to:email,
    subject:"Welcome to LINKVERSE!",
    html: createWelcomeEmailTemplate(name,clientURL)

  })
  if (error){
    console.error(error);
    throw new Error('Failed to send welcome email');

  }
  console.log('Welcome email sent:', data);
}


