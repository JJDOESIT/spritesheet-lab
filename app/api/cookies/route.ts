import { cookieGet } from "@/app/functions/cookies";

export async function POST(request: Request) {
  var cookie;
  try {
    // Fetch the body data from the request
    const data = await request.json();
    const cookieName = data.cookieName;

    // If the cookieName param was defined in the request body
    if (cookieName != null) {
      // Fetch the cookie session from the browser
      // Note: If not found, cookieGet() returns null
      try {
        cookie = await cookieGet(cookieName);
      } catch (e) {
        // Error fetching cookie ->  return null
        cookie = null;
      }
    } else {
      // The cookieName param was undefined -> return null
      cookie = null;
    }
  } catch (e) {
    // Error fetching request body -> return null
    cookie = false;
  }
  return new Response(JSON.stringify({ cookie: cookie }));
}
