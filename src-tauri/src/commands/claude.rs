use std::process::Command;

#[tauri::command]
pub async fn check_claude_installed() -> Result<bool, String> {
    let output = Command::new("claude")
        .arg("--version")
        .output()
        .map_err(|e| format!("Failed to check Claude CLI: {}", e))?;

    Ok(output.status.success())
}
