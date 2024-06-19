"use server";

import { isAuthenticated } from "@/app/functions/cookies";

export default async function isClientAuthenticated() {
    const response: {auth: boolean; cookie: any;} = await isAuthenticated(process.env.SESSION_NAME!);
    
    return response;
}

