import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS } from "@/types/user"
import { ChangeEvent, FormEvent, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import logo from "@/assets/logo.svg"
import { Key, User as UserIcon } from "lucide-react";

const FormComponent = () => {
    const location = useLocation()
    const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
    const { socket } = useSocket()

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const createNewRoomId = () => {
        setCurrentUser({ ...currentUser, roomId: uuidv4() })
        toast.success("Created a new Room Id")
        usernameRef.current?.focus()
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setCurrentUser({ ...currentUser, [name]: value })
    }

    const validateForm = () => {
        if (currentUser.username.trim().length === 0) {
            toast.error("Enter your username")
            return false
        } else if (currentUser.roomId.trim().length === 0) {
            toast.error("Enter a room id")
            return false
        } else if (currentUser.roomId.trim().length < 5) {
            toast.error("ROOM Id must be at least 5 characters long")
            return false
        } else if (currentUser.username.trim().length < 3) {
            toast.error("Username must be at least 3 characters long")
            return false
        }
        return true
    }

    const joinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === USER_STATUS.ATTEMPTING_JOIN) return
        if (!validateForm()) return
        toast.loading("Joining room...")
        setStatus(USER_STATUS.ATTEMPTING_JOIN)
        socket.emit(SocketEvent.JOIN_REQUEST, currentUser)
    }

    useEffect(() => {
        if (location.state?.roomId) {
            setCurrentUser({ ...currentUser, roomId: location.state.roomId })
            if (currentUser.username.length === 0) {
                toast.success("Enter your username")
            }
        }
    }, [currentUser, location.state?.roomId, setCurrentUser])

    useEffect(() => {
        if (status === USER_STATUS.JOINED) {
            navigate(`/editor/${currentUser.roomId}`, {
                state: {
                    username: currentUser.username,
                },
            })
        }
    }, [status, navigate, currentUser])

    return (
        <div className="w-full">
            <div className="relative flex w-full max-w-[520px] flex-col gap-8 rounded-3xl border border-white/10 bg-[#0b1224]/80 p-8 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:mx-auto">
                <div className="flex flex-col items-center gap-4 text-center">
                    <span className="rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-primary/80">
                        Welcome to Code Coalition
                    </span>
                    <img src={logo} alt="CodeAlong logo" className="h-16 w-auto" />
                    <p className="max-w-sm text-sm text-white/65">
                        Enter a room ID or generate a new one to collaborate instantly. Your
                        session stays in sync across devices.
                    </p>
                </div>
                <form onSubmit={joinRoom} className="flex w-full flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="roomId" className="text-sm font-medium text-white/80">
                            Room ID
                        </label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/40" />
                            <input
                                id="roomId"
                                type="text"
                                name="roomId"
                                placeholder="e.g. build-together-123"
                                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-primary focus:bg-white/10 focus:shadow-[0_0_0_2px_rgba(57,224,121,0.3)]"
                                onChange={handleInputChanges}
                                value={currentUser.roomId}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="text-sm font-medium text-white/80">
                            Display name
                        </label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/40" />
                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Your name"
                                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-primary focus:bg-white/10 focus:shadow-[0_0_0_2px_rgba(57,224,121,0.3)]"
                                onChange={handleInputChanges}
                                value={currentUser.username}
                                ref={usernameRef}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-[#7CFFCB] px-8 py-3 text-lg font-semibold text-[#0b1224] transition hover:scale-105 hover:shadow-[0_20px_45px_-20px_rgba(57,224,121,0.8)] active:scale-100"
                    >
                        Join room
                    </button>
                </form>
                <button
                    className="text-sm font-medium text-primary transition hover:text-white"
                    onClick={createNewRoomId}
                >
                    Generate a unique room ID
                </button>
            </div>
        </div>
    )
}

export default FormComponent