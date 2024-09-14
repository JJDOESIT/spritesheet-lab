"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [isMd, setIsMd] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMd ? (
        <div className="h-full md:w-full border-black border-[2px] rounded-[13px] bg-white">
          <div className="flex flex-col items-center justify-center w-full h-full p-[10px]">
            <p>Select a conversation to view its messages.</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
