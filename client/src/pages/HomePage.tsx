import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import FormComponent from "@/components/forms/FormComponent";
import {
    Zap,
    Users,
    Share2,
    Code,
    Gauge,
    ShieldCheck,
    Server,
    Globe,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

function HomePage() {
    const { setCurrentUser } = useAppContext();

    useEffect(() => {
        setCurrentUser({
            username: "",
            roomId: uuidv4(),
        });
    }, [setCurrentUser]);

    const features = [
        {
            icon: <Users className="h-6 w-6 text-indigo-400" />,
            title: "Live multi-user coding",
            description: "Collaborate in real-time with your team.",
        },
        {
            icon: <Zap className="h-6 w-6 text-green-400" />,
            title: "AI copilots & chat built-in",
            description: "Boost your productivity with AI assistance.",
        },
        {
            icon: <Share2 className="h-6 w-6 text-sky-400" />,
            title: "Share rooms instantly",
            description: "Get your team on board in seconds.",
        },
        {
            icon: <Code className="h-6 w-6 text-amber-400" />,
            title: "Zero-config sessions",
            description: "Start coding instantly without any setup.",
        },
    ];

    const stats = [
        { icon: <Gauge className="h-6 w-6 text-rose-400" />, label: "Latency", value: "< 80ms" },
        { icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />, label: "Uptime", value: "99.9%" },
        { icon: <Server className="h-6 w-6 text-yellow-400" />, label: "Teams", value: "500+" },
        { icon: <Globe className="h-6 w-6 text-cyan-400" />, label: "Regions", value: "12" },
    ];

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,_rgba(138,43,226,0.2)_0%,_rgba(13,17,23,0)_70%)]" />
                <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,_rgba(79,70,229,0.2)_0%,_rgba(13,17,23,0)_70%)]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-20 sm:px-6 lg:px-8">
                <header className="mb-24 text-center">
                    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                        Code-Coalition
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                        The ultimate real-time collaboration platform for developers.
                    </p>
                </header>

                <main className="grid flex-1 grid-cols-1 items-center gap-20 lg:grid-cols-2">
                    <div className="flex flex-col gap-10">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-white/10"
                                >
                                    <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-primary/20 blur-lg" />
                                    <div className="flex items-center gap-4">
                                        {feature.icon}
                                        <h3 className="text-lg font-semibold text-white/90">{feature.title}</h3>
                                    </div>
                                    <p className="mt-2 text-white/60">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-lg backdrop-blur-lg transition-all duration-300 hover:bg-white/10"
                                >
                                    <div className="flex justify-center">{stat.icon}</div>
                                    <p className="mt-2 text-2xl font-semibold text-white/90">{stat.value}</p>
                                    <p className="text-sm text-white/60">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <FormComponent />
                    </div>
                </main>

                <footer className="mt-24 text-center text-white/50">
                    <p>&copy; {new Date().getFullYear()} Code-Coalition. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default HomePage;