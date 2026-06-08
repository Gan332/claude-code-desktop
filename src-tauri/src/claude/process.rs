use std::process::{Command, Stdio};
use std::io::{Write, BufRead, BufReader};
use std::sync::{Arc, Mutex};
use std::thread;

use super::types::{ClaudeMessage, MessageRole, TokenUsage};

#[derive(Debug)]
pub struct ClaudeProcess {
    pub child: Option<std::process::Child>,
    pub stdin: Option<std::process::ChildStdin>,
}

impl ClaudeProcess {
    pub fn new() -> Self {
        Self {
            child: None,
            stdin: None,
        }
    }

    pub fn spawn(project_path: &str) -> Result<Self, String> {
        let child = Command::new("claude")
            .arg("--print")
            .arg("--output-format")
            .arg("json")
            .current_dir(project_path)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .stdin(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn Claude process: {}", e))?;

        let stdin = child.stdin.take();

        Ok(Self {
            child: Some(child),
            stdin,
        })
    }

    pub fn send_message(&mut self, message: &str) -> Result<String, String> {
        if let Some(ref mut stdin) = self.stdin {
            stdin
                .write_all(message.as_bytes())
                .map_err(|e| format!("Failed to write to stdin: {}", e))?;
            stdin
                .write_all(b"\n")
                .map_err(|e| format!("Failed to write newline: {}", e))?;
        }

        if let Some(ref mut child) = self.child {
            if let Some(ref mut stdout) = child.stdout {
                let mut reader = BufReader::new(stdout);
                let mut response = String::new();
                let mut buffer = [0u8; 4096];

                loop {
                    match reader.read(&mut buffer) {
                        Ok(0) => break,
                        Ok(n) => {
                            let chunk = String::from_utf8_lossy(&buffer[..n]);
                            response.push_str(&chunk);
                            if response.contains("\n\n") {
                                break;
                            }
                        }
                        Err(e) => return Err(format!("Failed to read stdout: {}", e)),
                    }
                }

                return Ok(response.trim().to_string());
            }
        }

        Err("Process not running".to_string())
    }

    pub fn kill(&mut self) -> Result<(), String> {
        if let Some(ref mut child) = self.child {
            child
                .kill()
                .map_err(|e| format!("Failed to kill process: {}", e))?;
        }
        Ok(())
    }

    pub fn is_running(&self) -> bool {
        if let Some(ref child) = self.child {
            child.id() != 0
        } else {
            false
        }
    }
}

impl Drop for ClaudeProcess {
    fn drop(&mut self) {
        let _ = self.kill();
    }
}
