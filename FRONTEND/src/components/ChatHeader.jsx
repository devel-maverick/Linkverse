// import React from 'react'
// import { useChatStore } from '../store/useChatStore'
// import { XIcon } from 'lucide-react'
// import { useEffect } from 'react'
// import { useAuthStore } from '../store/useAuthStore'

// function ChatHeader() {
//     const {selectedUser,setSelectedUser}=useChatStore()
//     const {onlineUsers}=useAuthStore()
//     const isOnline=onlineUsers.includes(String(selectedUser.id))
//   return (
//     <div className='flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1'>
//         <div className='flex items-center space-x-3'>
//             <div className={`avatar ${isOnline ? "online" : "offline"}`}>
//                 <div className='w-12 rounded-full'>
//                 <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullname}/>
//                 </div>
//             </div>
//             <div>
//                 <h3 className='text-slate-200 font0medium'>
//                     {selectedUser.fullName}
//                 </h3>
//                 <p className='text-slate-400 text-s,'>
//                     {isOnline ? "Online" : "Offline"}
//                 </p>

//             </div>
//         </div>
//         <button onClick={()=>setSelectedUser(null)}>
//             <XIcon className='w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer'/>
//         </button>
//         </div>
//   )
// }

// export default ChatHeader
// import React, { useState } from 'react'
// import { useChatStore } from '../store/useChatStore'
// import { XIcon, Calendar } from 'lucide-react'
// import { useAuthStore } from '../store/useAuthStore'
// import { useMeetingStore } from '../store/useMeetingStore'

// function ChatHeader() {
//     const { selectedUser, setSelectedUser } = useChatStore()
//     const { onlineUsers } = useAuthStore()
//     const { sendRequest, loading } = useMeetingStore()

//     const [openModal, setOpenModal] = useState(false)
//     const [requestedTime, setRequestedTime] = useState("")

//     const isOnline = onlineUsers.includes(String(selectedUser.id))

//     const handleSchedule = async () => {
//         if (!requestedTime) return alert("Select meeting time")

//         await sendRequest({
//             receiverId: selectedUser._id || selectedUser.id,
//             requestedTime,
//         })

//         setOpenModal(false)
//         setRequestedTime("")
//     }

//     return (
//         <>
//             {/* TOP HEADER */}
//             <div className='flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1'>
                
//                 {/* Left User Info */}
//                 <div className='flex items-center space-x-3'>
//                     <div className={`avatar ${isOnline ? "online" : "offline"}`}>
//                         <div className='w-12 rounded-full'>
//                             <img
//                                 src={selectedUser.profilePic || "/avatar.png"}
//                                 alt={selectedUser.fullname}
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <h3 className='text-slate-200 font-medium'>
//                             {selectedUser.fullName}
//                         </h3>

//                         <p className='text-slate-400 text-sm'>
//                             {isOnline ? "Online" : "Offline"}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Right Button Row */}
//                 <div className="flex items-center gap-4">

//                     {/* SCHEDULE BUTTON */}
//                     <button
//                         onClick={() => setOpenModal(true)}
//                         className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition'
//                     >
//                         <Calendar size={18} />
//                         <span className="hidden md:block text-sm">Schedule</span>
//                     </button>

//                     {/* CLOSE CHAT BUTTON */}
//                     <button onClick={() => setSelectedUser(null)}>
//                         <XIcon className='w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer' />
//                     </button>
//                 </div>
//             </div>


//             {/* MEETING MODAL */}
//             {openModal && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                     <div className="bg-white p-5 rounded-xl shadow-lg w-80">
//                         <h2 className="text-lg font-semibold mb-3 text-slate-800">
//                             Schedule Meeting with {selectedUser.fullName}
//                         </h2>

//                         <label className="text-sm text-slate-600">Select date & time</label>
//                         <input
//                             type="datetime-local"
//                             value={requestedTime}
//                             onChange={(e) => setRequestedTime(e.target.value)}
//                             className="w-full border px-3 py-2 mt-2 rounded-md bg-slate-50"
//                         />

//                         {/* MODAL BUTTONS */}
//                         <div className="flex justify-end mt-4 gap-2">
//                             <button
//                                 onClick={() => setOpenModal(false)}
//                                 className="px-3 py-1 border rounded-md"
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 onClick={handleSchedule}
//                                 disabled={loading}
//                                 className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                             >
//                                 {loading ? "Sending..." : "Send Request"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }

// export default ChatHeader
import React, { useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { XIcon, Calendar } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useMeetingStore } from '../store/useMeetingStore'

function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore()
    const { onlineUsers, user } = useAuthStore()
    const { createInstantMeeting, loading } = useMeetingStore()

    const isOnline = onlineUsers.includes(String(selectedUser._id))
    const isAlumni = user?.role === "ALUMNI"   // BLOCK alumni

    const handleInstantMeeting = async () => {
        const meeting = await createInstantMeeting(selectedUser._id || selectedUser._id)
        if (meeting) {
            window.open(meeting.jitsiUrl, "_blank")
        }
    }

    return (
        <>
            {/* TOP HEADER */}
            <div className='flex justify-between items-center bg-white border-b border-slate-700/50 max-h-[84px] px-6 flex-1'>
                
                {/* Left User Info */}
                <div className='flex items-center space-x-3'>
                    <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                        <div className='w-12 rounded-full'>
                            <img
                                src={selectedUser.profilePic || "/avatar.png"}
                                alt={selectedUser.fullname}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className='text-black font-medium'>
                            {selectedUser.fullName}
                        </h3>

                        <p className='text-black text-sm'>
                            {isOnline ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Right Buttons */}
                <div className="flex items-center gap-4">

                    {/* INSTANT MEETING BUTTON (ONLY STUDENTS) */}
                    {!isAlumni && (
                        <button
                            onClick={handleInstantMeeting}
                            disabled={loading}
                            className='flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-md transition'
                        >
                            <Calendar size={18} />
                            <span className="hidden md:block text-sm">
                                {loading ? "Creating..." : "Meeting"}
                            </span>
                        </button>
                    )}

                    {/* CLOSE CHAT BUTTON */}
                    <button onClick={() => setSelectedUser(null)}>
                        <XIcon className='w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer' />
                    </button>
                </div>
            </div>
        </>
    )
}

export default ChatHeader
