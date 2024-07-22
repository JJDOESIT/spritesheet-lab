import React from "react";

const ProfileDataContext = React.createContext({
  profile_image: "/blank-profile-picture.png",
  username: "" as string,
  name: "" as string | null,
  bio: "" as string | null,
  liked_posts: [] as Array<string>,
  refetchProfileCallback: () => {
    console.log("Error: Refetch Profile Function Not Implemented ...");
  },
});
export default ProfileDataContext;
