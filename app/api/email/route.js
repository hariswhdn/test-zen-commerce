import {NextResponse} from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  const {email, message, subject} = await request.json();

  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    authMethod: 'LOGIN',
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: subject,
    text: message,
  };

  const sendMailPromise = () =>
    new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Email sent');
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({message: 'Email sent'});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}
