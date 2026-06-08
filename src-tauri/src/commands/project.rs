use std::path::PathBuf;
use serde::{Deserialize, Serialize};

use crate::claude::types::ClaudeProject;

#[tauri::command]
pub async fn list_projects() -> Result<Vec<ClaudeProject>, String> {
    let claude_dir = dirs::home_dir()
        .ok_or_else(|| "Cannot find home directory".to_string())?
        .join(".claude")
        .join("projects");

    let mut projects = Vec::new();

    if claude_dir.exists() {
        let entries = std::fs::read_dir(&claude_dir)
            .map_err(|e| format!("Failed to read projects directory: {}", e))?;

        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                let name = path.file_name()
                    .map(|n| n.to_string_lossy().to_string())
                    .unwrap_or_default();

                let last_modified = std::fs::metadata(&path)
                    .and_then(|m| m.modified())
                    .ok()
                    .and_then(|t| {
                        let datetime: chrono::DateTime<chrono::Utc> = t.into();
                        Some(datetime.to_rfc3339())
                    });

                let session_count = std::fs::read_dir(&path)
                    .map(|entries| entries.flatten().count())
                    .unwrap_or(0);

                projects.push(ClaudeProject {
                    name,
                    path: path.to_string_lossy().to_string(),
                    session_count,
                    last_modified,
                });
            }
        }
    }

    Ok(projects)
}

#[tauri::command]
pub async fn get_project_path(project_name: String) -> Result<String, String> {
    let claude_dir = dirs::home_dir()
        .ok_or_else(|| "Cannot find home directory".to_string())?
        .join(".claude")
        .join("projects")
        .join(&project_name);

    if claude_dir.exists() {
        Ok(claude_dir.to_string_lossy().to_string())
    } else {
        Err(format!("Project '{}' not found", project_name))
    }
}
