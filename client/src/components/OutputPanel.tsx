import { useOutput } from "@/context/OutputContext";
import { useRunCode } from "@/context/RunCodeContext";
import { Panel, PanelGroup } from "react-resizable-panels";
import { Input } from "./ui/input";
import { Play, Trash2 } from "lucide-react";

function OutputPanel() {
  const { output, isHtml, isInteractive, stdin, setStdin, setOutput } = useOutput();
  const { runCode } = useRunCode();

  return (
    <PanelGroup direction="vertical">
      <Panel className="flex flex-col">
        <div className="flex items-center justify-between p-2 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Output</h2>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => runCode(stdin)}
            >
              <Play size={16} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => setOutput("")}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-[#161B22] p-4 overflow-auto">
          {isHtml && output ? (
            <iframe
              srcDoc={output}
              title="output"
              sandbox="allow-scripts"
              width="100%"
              height="100%"
            />
          ) : (
            <pre className="text-sm whitespace-pre-wrap">
              {output.run?.stdout || output.run?.stderr || output}
            </pre>
          )}
        </div>
        {isInteractive && (
          <div className="p-2 border-t border-gray-700">
            <Input
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input..."
              className="bg-gray-800 text-white border-gray-600"
            />
          </div>
        )}
      </Panel>
    </PanelGroup>
  );
}

export default OutputPanel;