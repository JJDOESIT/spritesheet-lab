
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid"

export default function Page() {

    return (
    <main className="flex flex-row items-center justify-center w-full">
        <div className="w-full px-[13rem] pb-[13rem]">
            <p className="my-20 text-3xl text-left"><strong>Questions?</strong></p>
            <p className="my-20 text-3xl text-right"><strong>Concerns?</strong></p>
            <p className="my-20 text-3xl text-left"><strong>Business inquiries?</strong></p>

            <p className="text-center mt-[30px]">Send us an email at <button><DocumentDuplicateIcon height={20} width={20} className="inline"/>example@spritesheetlab.com</button>, or use the form below.</p>
            
            <form> 
                <div className="flex flex-row items-center justify-around">
                    <input type="text" placeholder="Name"/>
                    <input type="text" placeholder="Email"/>
                </div>
                <textarea placeholder="Message" className="w-[80%] h-[14rem]"/>
                <button className="block neonBlackButton">Send</button>
            </form>
        </div>
    </main>
    )
}