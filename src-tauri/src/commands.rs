use crate::AppState;
use chrono::Utc;
use rusqlite::{params, OptionalExtension, Row};
use serde::{Deserialize, Serialize};
use tauri::State;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GlossaryReference {
    pub label: String,
    pub url: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct GlossaryTerm {
    pub id: String,
    pub term: String,
    pub content: String,
    pub references: Vec<GlossaryReference>,
    pub updated_at: String,
}

fn parse_references(raw: &str) -> Vec<GlossaryReference> {
    serde_json::from_str(raw).unwrap_or_default()
}

fn serialize_references(references: &[GlossaryReference]) -> Result<String, String> {
    serde_json::to_string(references).map_err(|error| error.to_string())
}

fn map_term_row(row: &Row<'_>) -> rusqlite::Result<GlossaryTerm> {
    let references_raw: String = row.get(3)?;
    Ok(GlossaryTerm {
        id: row.get(0)?,
        term: row.get(1)?,
        content: row.get(2)?,
        references: parse_references(&references_raw),
        updated_at: row.get(4)?,
    })
}

const TERM_SELECT: &str = "SELECT id, term, content, term_references, updated_at FROM glossary_terms";

#[tauri::command]
pub fn load_term(state: State<'_, AppState>, term_input: String) -> Result<Option<GlossaryTerm>, String> {
    let term = term_input.trim().to_string();
    if term.is_empty() {
        return Ok(None);
    }

    let connection = state.db.lock().map_err(|error| error.to_string())?;

    connection
        .query_row(
            &format!("{TERM_SELECT} WHERE term = ?1 COLLATE NOCASE LIMIT 1"),
            params![term],
            map_term_row,
        )
        .optional()
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn search_terms(state: State<'_, AppState>, query: String) -> Result<Vec<GlossaryTerm>, String> {
    let normalized_query = query.trim().to_string();
    if normalized_query.is_empty() {
        return Ok(Vec::new());
    }

    let pattern = format!("%{normalized_query}%");
    let connection = state.db.lock().map_err(|error| error.to_string())?;
    let mut statement = connection
        .prepare(
            &format!(
                "{TERM_SELECT}
                 WHERE term LIKE ?1 COLLATE NOCASE
                    OR content LIKE ?1 COLLATE NOCASE
                 ORDER BY term ASC
                 LIMIT 50"
            ),
        )
        .map_err(|error| error.to_string())?;

    let rows = statement
        .query_map(params![pattern], map_term_row)
        .map_err(|error| error.to_string())?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn save_term(
    state: State<'_, AppState>,
    term_input: String,
    content_input: String,
    references_input: Vec<GlossaryReference>,
) -> Result<GlossaryTerm, String> {
    let term = term_input.trim().to_string();
    let content = content_input.trim().to_string();
    let updated_at = Utc::now().to_rfc3339();
    let references_json = serialize_references(&references_input)?;

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
            "INSERT INTO glossary_terms (id, term, content, term_references, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5)
             ON CONFLICT(term) DO UPDATE SET
               content = excluded.content,
               term_references = excluded.term_references,
               updated_at = excluded.updated_at",
            params![id, term, content, references_json, updated_at],
        )
        .map_err(|error| error.to_string())?;

    connection
        .query_row(
            &format!("{TERM_SELECT} WHERE term = ?1 COLLATE NOCASE"),
            params![term],
            map_term_row,
        )
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub fn delete_term(state: State<'_, AppState>, term_input: String) -> Result<(), String> {
    let term = term_input.trim().to_string();
    if term.is_empty() {
        return Err("Term cannot be empty.".to_string());
    }

    let connection = state.db.lock().map_err(|error| error.to_string())?;

    let deleted = connection
        .execute(
            "DELETE FROM glossary_terms WHERE term = ?1 COLLATE NOCASE",
            params![term],
        )
        .map_err(|error| error.to_string())?;

    if deleted == 0 {
        return Err("Term not found.".to_string());
    }

    Ok(())
}
