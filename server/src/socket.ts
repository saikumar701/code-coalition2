import { Server, Socket } from "socket.io";
import { SocketEvent, SocketId } from "./types/socket";
import { USER_CONNECTION_STATUS, User } from "./types/user";

let userSocketMap: Map<SocketId, User> = new Map();

const getAllConnectedUsers = (roomId: string, io: Server) => {
    const connectedUsers: User[] = [];
    const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
    if (socketsInRoom) {
        socketsInRoom.forEach((socketId) => {
            const user = userSocketMap.get(socketId);
            if (user) {
                connectedUsers.push(user);
            }
        });
    }
    return connectedUsers;
};

export function initializeSocket(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("user connected", socket.id);

        socket.on(SocketEvent.JOIN_REQUEST, ({ roomId, username }: { roomId: string; username: string }) => {
            const user: User = {
                username,
                roomId,
                status: USER_CONNECTION_STATUS.ONLINE,
                cursorPosition: 0,
                selectionEnd: 0,
                socketId: socket.id,
                typing: false,
                currentFile: null,
            };
            userSocketMap.set(socket.id, user);
            socket.join(roomId);

            const connectedUsers = getAllConnectedUsers(roomId, io);
            socket.emit(SocketEvent.JOIN_ACCEPTED, {
                user,
                users: connectedUsers,
            });

            socket.to(roomId).emit(SocketEvent.USER_JOINED, {
                user,
                users: connectedUsers,
            });
        });

        socket.on(
            SocketEvent.FILE_UPDATED,
            ({
                code,
                currentLanguage,
                users,
            }: {
                code: string;
                currentLanguage: string;
                users: User[];
            }) => {
                const user = userSocketMap.get(socket.id);
                if (user) {
                    io.to(user.roomId).emit(SocketEvent.FILE_UPDATED, {
                        code,
                        currentLanguage,
                        users,
                    });
                }
            }
        );

        socket.on(SocketEvent.TYPING_START, ({ code }: { code: string }) => {
            const user = userSocketMap.get(socket.id);
            if (user) {
                socket.to(user.roomId).emit(SocketEvent.TYPING_START, {
                    user,
                    code,
                });
            }
        });

        socket.on(SocketEvent.FILE_UPDATED, ({ language }: { language: string }) => {
            const user = userSocketMap.get(socket.id);
            if (user) {
                io.to(user.roomId).emit(SocketEvent.FILE_UPDATED, {
                    language,
                });
            }
        });

        socket.on(SocketEvent.CURSOR_MOVE, ({ cursorPosition, selectionEnd }: { cursorPosition: number; selectionEnd: number }) => {
            const user = userSocketMap.get(socket.id);
            if (user) {
                user.cursorPosition = cursorPosition;
                user.selectionEnd = selectionEnd;
                userSocketMap.set(socket.id, user);
                io.to(user.roomId).emit(SocketEvent.USER_JOINED, {
                    users: getAllConnectedUsers(user.roomId, io),
                });
            }
        });

        socket.on("disconnecting", () => {
            const user = userSocketMap.get(socket.id);
            if (user) {
                io.to(user.roomId).emit(SocketEvent.USER_DISCONNECTED, {
                    user,
                });
                userSocketMap.delete(socket.id);
            }
        });

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
        });
    });
}