import React from "react";

const ProfileDataContext = React.createContext({
  profile_image: "/blank-profile-picture.png",
  username: "",
  name: "",
  bio: "",
});
export default ProfileDataContext;
