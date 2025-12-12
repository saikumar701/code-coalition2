import { Socket } from "socket.io-client"

type SocketId = string

enum SocketEvent {
    JOIN_REQUEST = "join-request",
    JOIN_ACCEPTED = "join-accepted",
    USER_JOINED = "user-joined",
    USER_DISCONNECTED = "user-disconnected",
    SYNC_FILE_STRUCTURE = "sync-file-structure",
    DIRECTORY_CREATED = "directory-created",
    DIRECTORY_UPDATED = "directory-updated",
    DIRECTORY_RENAMED = "directory-renamed",
    DIRECTORY_DELETED = "directory-deleted",
    FILE_CREATED = "file-created",
    FILE_UPDATED = "file-updated",
    FILE_RENAMED = "file-renamed",
    FILE_DELETED = "file-deleted",
    USER_OFFLINE = "offline",
    USER_ONLINE = "online",
    SEND_MESSAGE = "send-message",
    RECEIVE_MESSAGE = "receive-message",
    TYPING_START = "typing-start",
    TYPING_PAUSE = "typing-pause",
    CURSOR_MOVE = "cursor-move",
    USERNAME_EXISTS = "username-exists",
    REQUEST_DRAWING = "request-drawing",
    SYNC_DRAWING = "sync-drawing",
    DRAWING_UPDATE = "drawing-update",
    // Legacy sandbox terminal events (kept for backward compatibility)
    TERMINAL_EXECUTE = "terminal-execute",
    TERMINAL_OUTPUT = "terminal-output",
    TERMINAL_RESET = "terminal-reset",
    // Live process streaming events
    TERMINAL_RUN_COMMAND = "terminal-run-command",
    TERMINAL_STREAM = "terminal-stream",
    TERMINAL_STATUS = "terminal-status",
    TERMINAL_INPUT = "terminal-input",
    TERMINAL_STOP = "terminal-stop",
}

interface SocketContext {
    socket: Socket
}

export { SocketEvent, SocketContext, SocketId }
