use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};

use crate::claude::types::{ClaudeSession, ClaudeMessage, SessionStatus, MessageRole};

static SESSIONS: Lazy<Mutex<HashMap<String, ClaudeSession>>> = Lazy::new(|| {
    Mutex::new(HashMap::new())
});

#[derive(Serialize, Deserialize)]
pub struct CreateSessionRequest {
    pub project_path: String,
}

#[tauri::command]
pub async fn create_session(request: CreateSessionRequest) -> Result<ClaudeSession, String> {
    let session_id = uuid::Uuid::new_v4().to_string();
    let project_name = std::path::Path::new(&request.project_path)
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| "Unknown".to_string());

    let session = ClaudeSession {
        id: session_id.clone(),
        project_path: request.project_path,
        project_name,
        status: SessionStatus::Running,
        messages: Vec::new(),
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
    };

    let mut sessions = SESSIONS.lock().map_err(|e| e.to_string())?;
    sessions.insert(session_id, session.clone());

    Ok(session)
}

#[tauri::command]
pub async fn send_message(session_id: String, content: String) -> Result<ClaudeMessage, String> {
    let mut sessions = SESSIONS.lock().map_err(|e| e.to_string())?;
    let session = sessions.get_mut(&session_id)
        .ok_or_else(|| format!("Session {} not found", session_id))?;

    let user_message = ClaudeMessage {
        id: uuid::Uuid::new_v4().to_string(),
        role: MessageRole::User,
        content: content.clone(),
        timestamp: chrono::Utc::now().to_rfc3339(),
        token_usage: None,
    };

    session.messages.push(user_message);
    session.updated_at = chrono::Utc::now().to_rfc3339();

    let assistant_message = ClaudeMessage {
        id: uuid::Uuid::new_v4().to_string(),
        role: MessageRole::Assistant,
        content: format!("Echo: {}", content),
        timestamp: chrono::Utc::now().to_rfc3339(),
        token_usage: None,
    };

    session.messages.push(assistant_message.clone());
    session.updated_at = chrono::Utc::now().to_rfc3339();

    Ok(assistant_message)
}

#[tauri::command]
pub async fn list_sessions() -> Result<Vec<ClaudeSession>, String> {
    let sessions = SESSIONS.lock().map_err(|e| e.to_string())?;
    Ok(sessions.values().cloned().collect())
}

#[tauri::command]
pub async fn get_session(session_id: String) -> Result<ClaudeSession, String> {
    let sessions = SESSIONS.lock().map_err(|e| e.to_string())?;
    sessions.get(&session_id)
        .cloned()
        .ok_or_else(|| format!("Session {} not found", session_id))
}
