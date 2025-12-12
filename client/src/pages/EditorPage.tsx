import GitHubCorner from "@/components/GitHubCorner";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    PanelLeft,
    PanelRight,
    Copy,
    Users,
    MessageCircle,
    BrainCircuit,
    Settings,
    File,
    PenSquare
} from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import cn from "classnames";

import FileStructureView from "@/components/files/FileStructureView";
import WorkSpace from "@/components/workspace";
import OutputPanel from "@/components/OutputPanel";
import { useAppContext } from "@/context/AppContext";
import { useSocket } from "@/context/SocketContext";
import { useViews, ViewContextProvider } from "@/context/ViewContext";
import useFullScreen from "@/hooks/useFullScreen";
import useUserActivity from "@/hooks/useUserActivity";
import { SocketEvent } from "@/types/socket";
import { User } from "@/types/user";
import { VIEWS } from "@/types/view";

const iconMap = {
    [VIEWS.FILES]: File,
    [VIEWS.CLIENTS]: Users,
    [VIEWS.CHATS]: MessageCircle,
    [VIEWS.COPILOT]: BrainCircuit,
    [VIEWS.SETTINGS]: Settings,
    [VIEWS.DRAWING]: PenSquare,
};

function EditorLayout() {
    useUserActivity();
    useFullScreen();

    const navigate = useNavigate();
    const { roomId } = useParams();
    const location = useLocation();

    const { status, setCurrentUser, currentUser } = useAppContext();
    const { socket } = useSocket();
    const { activeView, setActiveView, viewComponents, isSidebarOpen, setIsSidebarOpen } = useViews();

    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

    useEffect(() => {
        const username = location.state?.username;
        if (username && roomId) {
            const user: User = { username, roomId };
            setCurrentUser(user);
            socket.emit(SocketEvent.JOIN_REQUEST, user);
        }
    }, [location.state?.username, navigate, roomId, setCurrentUser, socket]);

    useEffect(() => {
        console.log("[EditorPage] Current status:", status);
        console.log("[EditorPage] Current user:", currentUser);
    }, [status, currentUser]);

    return (
        <div className="h-screen overflow-hidden bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between shrink-0 px-4 h-14 bg-background border-b border-border z-30">
                <div className="flex items-center gap-3">
                    <button
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                        onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                    >
                        <PanelLeft size={20} />
                    </button>
                    <div className="text-lg font-bold text-primary">Code-Coalition</div>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-muted-foreground">#{roomId}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-muted hover:bg-muted/80 transition-colors"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                    >
                        <Copy size={16} />
                        <span>Share</span>
                    </button>
                    <button
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <PanelRight size={20} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">
                {/* Left Sidebar (File Explorer) */}
                <aside
                    className={cn(
                        "bg-background border-r border-border transition-all duration-300 ease-in-out",
                        isLeftSidebarOpen ? "w-64" : "w-0"
                    )}
                >
                    <div className="p-4">
                        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Explorer</h2>
                    </div>
                    <FileStructureView />
                </aside>

                {/* Main Content (Editor) */}
                <main className="flex-1 flex flex-col min-w-0">
                    <PanelGroup direction="vertical">
                        <Panel>
                            <WorkSpace />
                        </Panel>
                        <PanelResizeHandle className="h-1 bg-border hover:bg-primary/20 transition-colors" />
                        <Panel collapsible={true} defaultSize={20} minSize={10}>
                            <OutputPanel />
                        </Panel>
                    </PanelGroup>
                </main>

                {/* Right Sidebar (Tools) */}
                <aside
                    className={cn(
                        "bg-background border-l border-border transition-all duration-300 ease-in-out flex flex-col",
                        isSidebarOpen ? "w-80" : "w-0"
                    )}
                >
                    <div className="flex items-center p-2 border-b border-border">
                        {Object.entries(iconMap).map(([view, Icon]) => (
                            <button
                                key={view}
                                className={cn(
                                    "flex-1 p-2.5 flex justify-center items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                                    { "bg-muted text-foreground": activeView === view }
                                )}
                                onClick={() => {
                                    if (view === VIEWS.DRAWING) {
                                        window.open("/drawing", "_blank");
                                    } else {
                                        setActiveView(view as VIEWS);
                                    }
                                }}
                                title={view.charAt(0).toUpperCase() + view.slice(1).toLowerCase()}
                            >
                                <Icon size={22} />
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-auto">
                        {viewComponents[activeView]}
                    </div>
                </aside>
            </div>
        </div>
    );
}

function EditorPage() {
    return (
        <ViewContextProvider>
            <EditorLayout />
        </ViewContextProvider>
    );
}

export default EditorPage;