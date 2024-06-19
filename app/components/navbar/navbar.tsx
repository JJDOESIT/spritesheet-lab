"use client";

import Logo from "../logo/logo";
import { AdjustmentsHorizontalIcon} from "@heroicons/react/24/solid";
import isClientAuthenticated from "@/app/functions/isClientAuthenticated";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const sideNavButton = <button id="NavbarButton"><AdjustmentsHorizontalIcon className="h-[30px] w-[30px]"/></button>;
  const loginButton = <Link className="text-lg neonBlackButton" href="/login">Login</Link>;

  function checkLoggedIn()
  {
    const response =  isClientAuthenticated();
    return response;
  }

  useEffect(() => {
    checkLoggedIn().then((response) => {
      setIsLoggedIn(response.auth);
    });
  }, []);


  return (
    <div className="h-[100px] bg-[black] flex md:flex-row flex-col items-center justify-between">
      <div className="mt-[10px]">
        <Logo />
      </div>
      <div className="flex flex-row items-center text-white md:w-[60%] w-[100%] md:justify-end justify-between space-x-[15px] px-[15px]">
        <p>Search Bar Representative</p>
        {isLoggedIn ? sideNavButton : loginButton}
      </div>
    </div>
  );
}
