"use server";

export default async function userExists(username: string) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "api/user-exists",
      {
        method: "POST",
        body: JSON.stringify({ username: username }),
      }
    );
    var data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}
