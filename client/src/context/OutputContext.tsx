import { createContext, useContext, useState } from "react";

interface OutputContextType {
    output: any; // Replace with a more specific type
    setOutput: (output: any) => void;
    language: string;
    setLanguage: (language: string) => void;
    stdin: string;
    setStdin: (stdin: string) => void;
    isHtml: boolean;
    setIsHtml: (isHtml: boolean) => void;
    isInteractive: boolean;
    setIsInteractive: (isInteractive: boolean) => void;
    isExecuting: boolean;
    setIsExecuting: (isExecuting: boolean) => void;
}

const OutputContext = createContext<OutputContextType | undefined>(undefined);

export const OutputProvider = ({ children }: { children: React.ReactNode }) => {
    const [output, setOutput] = useState<any>(null);
    const [language, setLanguage] = useState("javascript");
    const [stdin, setStdin] = useState("");
    const [isHtml, setIsHtml] = useState(false);
    const [isInteractive, setIsInteractive] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);

    return (
        <OutputContext.Provider value={{ output, setOutput, language, setLanguage, stdin, setStdin, isHtml, setIsHtml, isInteractive, setIsInteractive, isExecuting, setIsExecuting }}>
            {children}
        </OutputContext.Provider>
    );
};

export const useOutput = () => {
    const context = useContext(OutputContext);
    if (!context) {
        throw new Error("useOutput must be used within an OutputProvider");
    }
    return context;
};