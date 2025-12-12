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
        <div className="relative min-h-screen overflow-x-hidden bg-[#0d1117] text-white">
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_30%_30%,_rgba(57,224,121,0.15)_0%,_transparent_50%)]" />
                <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_at_70%_70%,_rgba(57,224,121,0.1)_0%,_transparent_50%)]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
                <header className="mb-16 sm:mb-24 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                        Code-Coalition
                    </h1>
                    <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-300">
                        The ultimate real-time collaboration platform for developers.
                    </p>
                </header>

                <main className="grid flex-1 grid-cols-1 items-center gap-12 lg:gap-20 lg:grid-cols-2">
                    <div className="flex flex-col gap-8 sm:gap-10 order-2 lg:order-1">
                        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        {feature.icon}
                                        <h3 className="text-base sm:text-lg font-semibold text-white">{feature.title}</h3>
                                    </div>
                                    <p className="mt-2 text-sm sm:text-base text-gray-400">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 text-center shadow-lg backdrop-blur-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                                >
                                    <div className="flex justify-center">{stat.icon}</div>
                                    <p className="mt-2 text-xl sm:text-2xl font-semibold text-white">{stat.value}</p>
                                    <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center order-1 lg:order-2">
                        <FormComponent />
                    </div>
                </main>

                <footer className="mt-16 sm:mt-24 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Code-Coalition. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default HomePage;