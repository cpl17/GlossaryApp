mod commands;
mod db;

use commands::{load_term, save_term};
use rusqlite::Connection;
use std::sync::Mutex;
use tauri::Manager;

pub struct AppState {
    pub db: Mutex<Connection>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .map_err(|error| error.to_string())?;

            std::fs::create_dir_all(&app_data_dir).map_err(|error| error.to_string())?;

            let database_path = app_data_dir.join("glossary.db");
            let connection = db::init(&database_path).map_err(|error| error.to_string())?;

            app.manage(AppState {
                db: Mutex::new(connection),
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![load_term, save_term])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
