import { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

interface TerminalProps {
  sessionId: string;
  onCommand?: (command: string) => void;
}

export function Terminal({ sessionId, onCommand }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = new XTerminal({
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        cursor: "#d4d4d4",
        cursorAccent: "#1e1e1e",
        selectionBackground: "#264f78",
      },
      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
      fontSize: 14,
      lineHeight: 1.2,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);

    setTimeout(() => {
      fitAddon.fit();
    }, 100);

    terminal.writeln("Welcome to Claude Code Desktop Terminal");
    terminal.writeln("");

    xtermRef.current = terminal;

    let currentLine = "";
    terminal.onData((data) => {
      if (data === "\r") {
        if (onCommand && currentLine.trim()) {
          onCommand(currentLine);
        }
        terminal.writeln("");
        currentLine = "";
      } else if (data === "\x7f") {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          terminal.write("\b \b");
        }
      } else {
        currentLine += data;
        terminal.write(data);
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      terminal.dispose();
    };
  }, [sessionId]);

  const writeLine = (text: string) => {
    xtermRef.current?.writeln(text);
  };

  return (
    <div
      ref={terminalRef}
      className="h-full w-full bg-[#1e1e1e] overflow-hidden"
    />
  );
}
