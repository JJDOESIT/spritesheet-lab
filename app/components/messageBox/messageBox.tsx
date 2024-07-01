

export default function MessageBox({sender, message, sent} : {sender: string, message: string, sent: boolean}) {
    
    return (
        <div className={`flex flex-col justify-center ${sent ? "items-end" : "items-start"} w-[100%] h-fit`}>
            <p className="text-sm"><strong>{sender}</strong></p>
            <div className={`bg-black ${sent ? "bg-neonGreen" : "bg-skyBlue"} p-[10px] rounded-lg border-black border-2 w-full max-w-fit overflow-x-auto`}>
                <p>{message}</p>
            </div>
        </div>
    )
}