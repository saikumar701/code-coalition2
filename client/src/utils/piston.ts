import pistonApi from "@/api/pistonApi";

export interface PistonFile {
    name: string;
    content: string;
}

export interface PistonResponse {
    language: string;
    version: string;
    run: {
        stdout: string;
        stderr: string;
        output: string;
        code: number;
        signal: any; // Or a more specific type if you know what it can be
    };
}

export const executeCode = async (language: string, files: PistonFile[]): Promise<PistonResponse> => {
    const response = await pistonApi.post("/execute", {
        language,
        version: "*", // Latest version
        files,
    });
    return response.data;
};