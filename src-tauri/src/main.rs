#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod claude;
mod commands;
mod utils;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::session::create_session,
            commands::session::send_message,
            commands::session::list_sessions,
            commands::session::get_session,
            commands::project::list_projects,
            commands::project::get_project_path,
            commands::claude::check_claude_installed,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
