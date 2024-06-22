

export default function MessageBox({sender, message, sent} : {sender: string, message: string, sent: boolean}) {
    
    return (
        <div className={`flex flex-col justigy-center ${sent ? "items-end" : "items-start"} w-full h-fit `}>
            <p className="text-sm"><strong>{sender}</strong></p>
            <div className={`bg-black ${sent ? "bg-neonGreen" : "bg-skyBlue"  } p-[10px] rounded-lg border-black border-2`}>
                <p>{message}</p>
            </div>
        </div>
    )
}