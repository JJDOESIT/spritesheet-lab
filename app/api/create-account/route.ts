import clientPromise from "../../../lib/mongodb";
import { passwordEncrypt } from "@/app/functions/password";

export async function POST(request: Request) {
  var status = 500;
  const usernameLengthRequirement = 2;
  const passwordLengthRequirement = 8;
  const passwordMaxLength = 128;
  const usernameMaxLength = 15;
  const emailMaxLength = 100;
  const usernameRegex = /^[a-z0-9._]*$/;
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]*$/;

  try {
    // Fetch data from POST request
    var data = await request.json();
    // Convert the username and email to lowercase
    data.username = data.username.toLowerCase();
    data.email = data.email.toLowerCase();
  } catch (e) {
    // Internal server error -> return 500
    status = 500;
    return new Response(JSON.stringify({ status: status }));
  }

  // Username too short -> return 410
  if (data.username.length < usernameLengthRequirement) {
    status = 410;
    return new Response(JSON.stringify({ status: status }));
  }
  // Password too short -> return 420
  else if (data.password.length < passwordLengthRequirement) {
    status = 420;
    return new Response(JSON.stringify({ status: status }));
  }
  // Username must only contain numbers, letters, . or _ -> return 420
  else if (!usernameRegex.test(data.username)) {
    status = 430;
    return new Response(JSON.stringify({ status: status }));
  }
  // Password must only contain numbers, letters, and special characters -> return 430
  else if (!passwordRegex.test(data.password)) {
    status = 440;
    return new Response(JSON.stringify({ status: status }));
  }
  // Username must contain at least one letter
  else if (!/^(?=.*[a-z]).*$/.test(data.username)) {
    status = 450;
    return new Response(JSON.stringify({ status: status }));
  }
  // Password must contain at least one number and one letter
  else if (
    !/^(?=.*\d).+$/.test(data.password) ||
    !/^(?=.*[a-zA-Z]).*$/.test(data.password)
  ) {
    status = 460;
    return new Response(JSON.stringify({ status: status }));
  }
  // If the email doesn't contain an @ symbol
  else if (!data.email.includes("@")) {
    status = 470;
    return new Response(JSON.stringify({ status: status }));
  }
  // Password too long -> return 480
  else if (data.password.length > passwordMaxLength) {
    status = 480;
    return new Response(JSON.stringify({ status: status }));
  }
  // Username too long -> return 490
  else if (data.username.length > usernameMaxLength) {
    status = 490;
    return new Response(JSON.stringify({ status: status }));
  }
  // Email too long -> return 490
  else if (data.email.length > emailMaxLength) {
    status = 510;
    return new Response(JSON.stringify({ status: status }));
  }

  try {
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db("db");
    // Check if the username is taken
    const users = await db
      .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
      .findOne({ username: data.username });
    // If the username is not taken
    if (users == null) {
      // Attempt to encrypt the password
      const hash = await passwordEncrypt(data.password, 10);
      // Attempt to insert the password into the 'users' database
      await db.collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!).insertOne({
        username: data.username,
        email: data.email,
        password: hash,
        email_verified: false,
      });
      // Fetch the id from the newly created account
      const id = await db
        .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
        .findOne({ username: data.username });

      // Create a fresh profile for the user
      await db.collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!).insertOne({
        foreign_key: id!._id,
        profile_image: null,
        name: null,
        bio: null,
        liked_posts: [],
        notifications: [],
      });
      // Success -> return 200
      status = 200;
    } else {
      // Username is taken -> return 400
      status = 400;
    }
  } catch (e) {
    // Can't connect to database -> return 500
    status = 500;
  }

  return new Response(JSON.stringify({ status: status }));
}
