use rusqlite::Connection;
use std::path::Path;

const SCHEMA: &str = "
CREATE TABLE IF NOT EXISTS glossary_terms (
    id TEXT PRIMARY KEY,
    term TEXT NOT NULL UNIQUE COLLATE NOCASE,
    content TEXT NOT NULL DEFAULT '',
    term_references TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS glossary_terms_term_lower_idx
    ON glossary_terms (lower(term));
";

pub fn init(path: &Path) -> Result<Connection, rusqlite::Error> {
    let connection = Connection::open(path)?;
    connection.execute_batch(SCHEMA)?;

    let term_references_column_exists: bool = connection
        .prepare("PRAGMA table_info(glossary_terms)")?
        .query_map([], |row| row.get::<_, String>(1))?
        .filter_map(Result::ok)
        .any(|name| name == "term_references");

    if !term_references_column_exists {
        connection.execute(
            "ALTER TABLE glossary_terms ADD COLUMN term_references TEXT NOT NULL DEFAULT '[]'",
            [],
        )?;
    }

    Ok(connection)
}
