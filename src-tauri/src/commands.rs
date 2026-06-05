use crate::AppState;
use chrono::Utc;
use rusqlite::{params, OptionalExtension};
use serde::Serialize;
use tauri::State;
use uuid::Uuid;

#[derive(Debug, Serialize, Clone)]
pub struct GlossaryTerm {
    pub id: String,
    pub term: String,
    pub content: String,
    pub updated_at: String,
}

#[tauri::command]
pub fn load_term(state: State<'_, AppState>, term_input: String) -> Result<Option<GlossaryTerm>, String> {
    let term = term_input.trim().to_string();
    if term.is_empty() {
        return Ok(None);
    }

    let connection = state.db.lock().map_err(|error| error.to_string())?;

    connection
        .query_row(
            "SELECT id, term, content, updated_at
             FROM glossary_terms
             WHERE term = ?1 COLLATE NOCASE
             LIMIT 1",
            params![term],
            |row| {
                Ok(GlossaryTerm {
                    id: row.get(0)?,
                    term: row.get(1)?,
                    content: row.get(2)?,
                    updated_at: row.get(3)?,
                })
            },
        )
        .optional()
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn save_term(
    state: State<'_, AppState>,
    term_input: String,
    content_input: String,
) -> Result<GlossaryTerm, String> {
    let term = term_input.trim().to_string();
    let content = content_input.trim().to_string();
    let updated_at = Utc::now().to_rfc3339();

    if term.is_empty() {
        return Err("Term cannot be empty.".to_string());
    }

    let connection = state.db.lock().map_err(|error| error.to_string())?;

    let existing_id: Option<String> = connection
        .query_row(
            "SELECT id FROM glossary_terms WHERE term = ?1 COLLATE NOCASE",
            params![term],
            |row| row.get(0),
        )
        .optional()
        .map_err(|error| error.to_string())?;

    let id = existing_id.unwrap_or_else(|| Uuid::new_v4().to_string());

    connection
        .execute(
            "INSERT INTO glossary_terms (id, term, content, updated_at)
             VALUES (?1, ?2, ?3, ?4)
             ON CONFLICT(term) DO UPDATE SET
               content = excluded.content,
               updated_at = excluded.updated_at",
            params![id, term, content, updated_at],
        )
        .map_err(|error| error.to_string())?;

    connection
        .query_row(
            "SELECT id, term, content, updated_at
             FROM glossary_terms
             WHERE term = ?1 COLLATE NOCASE",
            params![term],
            |row| {
                Ok(GlossaryTerm {
                    id: row.get(0)?,
                    term: row.get(1)?,
                    content: row.get(2)?,
                    updated_at: row.get(3)?,
                })
            },
        )
        .map_err(|error| error.to_string())
}
