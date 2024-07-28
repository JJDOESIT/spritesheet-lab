"use server";

export async function fetchPost(postID: string) {
  var post;
  try {
    if (postID) {
      // API POST request to fetch post from database
      const response = await fetch(process.env.BASE_URL + "/api/fetch-post", {
        method: "POST",
        body: JSON.stringify({
          postID: postID,
        }),
      });
      // Parse the response and set status
      post = await response.json();
    } else {
      // PostID isn't valid -> return null
      post = null;
    }
  } catch (e) {
    // Error fetching post -> return null
    console.log(200);
    post = null;
  }
  return post;
}
