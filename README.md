# Glossary

A native macOS glossary app. Look up terms and save personal notes locally in SQLite — no web server, no cloud.

## Stack

- **UI:** React + TypeScript + Vite
- **Shell:** Tauri v2
- **Storage:** SQLite (`glossary.db` in the app data directory)

## Prerequisites

1. **Node.js** (v18+)
2. **Rust** — install via [rustup](https://rustup.rs):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
3. **Xcode Command Line Tools** (not full Xcode):
   ```bash
   xcode-select --install
   ```

## Setup

```bash
npm install
```

## Development

```bash
npm run tauri dev
```

Opens a native Mac window with hot-reload for the React UI.

## Build

```bash
npm run tauri build
```

Produces a `.app` bundle under `src-tauri/target/release/bundle/macos/`.

## Data location

SQLite database path:

```
~/Library/Application Support/com.glossary.desktop/glossary.db
```

## Project layout

```
glossary/
├── src/              # React frontend
├── src-tauri/        # Rust backend + SQLite
│   └── src/
│       ├── db.rs         # schema + init
│       ├── commands.rs   # load_term, save_term
│       └── lib.rs
├── REMNANT.md        # archive of the original web app
└── package.json
```
