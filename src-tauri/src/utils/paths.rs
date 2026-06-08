use std::path::PathBuf;

pub fn get_claude_config_dir() -> Option<PathBuf> {
    dirs::home_dir().map(|home| home.join(".claude"))
}

pub fn get_projects_dir() -> Option<PathBuf> {
    get_claude_config_dir().map(|config| config.join("projects"))
}

pub fn ensure_directory_exists(path: &PathBuf) -> Result<(), String> {
    if !path.exists() {
        std::fs::create_dir_all(path)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }
    Ok(())
}
