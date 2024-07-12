"use server";

export default async function fetchGalleryPosts(username: string | null) {
  var gallery;
  try {
    // API call to fetch gallery posts
    const response = await fetch(
      process.env.BASE_URL + "/api/fetch-gallery-posts",
      {
        method: "POST",
        body: JSON.stringify({
          username: username,
        }),
      }
    );
    // Parse the response and set status
    gallery = await response.json();
  } catch (e) {
    console.log(e);
    // Internal server error -> return null
    gallery = null;
  }
  return gallery;
}
