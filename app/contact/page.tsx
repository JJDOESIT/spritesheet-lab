"use client";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid"
import emailjs from 'emailjs-com';
import { useEffect, useState } from "react";

export default function Page() {
    const [result, setResult] = useState<string>('');

    const SERVICE_ID = "service_g27nsmn";
    const TEMPLATE_ID = "contact_form";
    const PUBLIC_KEY = "YDNGaU3_kfsZAtb6i";

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.currentTarget, PUBLIC_KEY)
        .then((result) => {
            console.log(result.text);
            setResult('Success! Check your email for a confirmation.');
        }, (error) => {
            console.log(error.text);
            setResult('Failed to send message. Please try again later.');
        });
    };

    return (
    <main className="flex flex-col items-center w-full h-[100%] overflow-scroll hideScrollbar">
        <div className="flex flex-col h-fit w-fit mb-[20px] animate__animated animate__fadeIn">
            <p className="mt-10 text-lg text-left md:text-3xl">Questions?</p>
            <p className="mt-3 text-lg text-left md:mt-10 md:text-3xl">Concerns?</p>
            <p className="mt-3 text-lg text-left md:mt-10 md:text-3xl">Business inquiries?</p>
            <p className="my-3 text-lg text-left md:my-10 md:text-3xl"><strong>Let us know.</strong></p>

            <form className="roundedFormOppositeShadow max-w-[1500px] min-w-[300px]" onSubmit={sendEmail} >
                <p className="text-left md:text-3xl"><strong>Contact us</strong></p>
                <div className="flex flex-col md:items-center items-left justify-left md:justify-around md:flex-row">
                    <input name="user_name" type="text" placeholder="Name" className="md:w-[48%] w-[95%] p-2 mt-2 border-2 rounded-3xl border-slate-300"/>
                    <input name="user_email" type="text" placeholder="Email" className="md:w-[48%] w-[95%] p-2 mt-2 border-2 rounded-3xl border-slate-300"/>
                </div>
                <textarea name="message" placeholder="Message" className="resize-none md:w-[100%] w-[95%] h-[10rem] md:h-[14rem] p-2 my-2 border-2 rounded-3xl border-slate-300"/>
                <button className="block neonBlackButton">Send</button>
                {result && <p>{result}</p>}
            </form>
        </div>
    </main>
    )
}