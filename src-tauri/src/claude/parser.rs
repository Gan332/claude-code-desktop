use serde_json::Value;
use super::types::{ClaudeMessage, MessageRole, TokenUsage};

pub fn parse_claude_output(output: &str) -> Result<ClaudeMessage, String> {
    let json: Value = serde_json::from_str(output)
        .map_err(|e| format!("Failed to parse JSON: {}", e))?;

    let content = json["content"]
        .as_str()
        .unwrap_or("")
        .to_string();

    let input_tokens = json["usage"]["input_tokens"]
        .as_u64()
        .map(|v| v as u32)
        .unwrap_or(0);

    let output_tokens = json["usage"]["output_tokens"]
        .as_u64()
        .map(|v| v as u32)
        .unwrap_or(0);

    Ok(ClaudeMessage {
        id: uuid::Uuid::new_v4().to_string(),
        role: MessageRole::Assistant,
        content,
        timestamp: chrono::Utc::now().to_rfc3339(),
        token_usage: Some(TokenUsage {
            input_tokens,
            output_tokens,
            total_tokens: input_tokens + output_tokens,
        }),
    })
}

pub fn parse_simple_output(output: &str) -> ClaudeMessage {
    ClaudeMessage {
        id: uuid::Uuid::new_v4().to_string(),
        role: MessageRole::Assistant,
        content: output.to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
        token_usage: None,
    }
}
