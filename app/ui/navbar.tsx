import Logo from "@/app/ui/logo";
import { AdjustmentsHorizontalIcon, UserIcon} from "@heroicons/react/24/solid";

export default function Navbar() {
    return (
        <div className="h-[100px] bg-[black] flex md:flex-row flex-col items-center justify-between">
            <div className="mt-[10px]">
                <Logo />
            </div>
            <div className="flex flex-row items-center text-white md:w-[60%] w-[100%] md:justify-end justify-between space-x-[15px] px-[15px]">
                <p>Search Bar Representative</p>
                <UserIcon className="h-[30px] w-[30px]"/>
                <AdjustmentsHorizontalIcon className="h-[30px] w-[30px]"/>
            </div>
        </div>
    )
}