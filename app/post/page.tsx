"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Post() {
  // Url params
  const searchParams = useSearchParams();
  const [postID, setPostID] = useState("");

  useEffect(() => {
    const id = searchParams.get("page");
    if (id) {
      setPostID(id);
    }
  }, []);

  return (
    <div>
      <p>{postID}</p>
    </div>
  );
}
