# Claude Code Desktop

A desktop GUI wrapper for Claude Code CLI, built with Tauri 2, React, and TypeScript.

## Features

- 🖥️ **Native Desktop Experience** - Cross-platform desktop application
- 💬 **Session Management** - Create and manage multiple Claude Code sessions
- 📂 **Project Browser** - Automatically discover and manage Claude Code projects
- 🎨 **Modern UI** - Clean, responsive interface with dark theme
- ⚡ **Fast & Lightweight** - Built with Tauri for minimal resource usage

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Zustand
- **Backend**: Rust, Tauri 2
- **Terminal**: xterm.js
- **Build**: GitHub Actions

## Prerequisites

- Claude Code CLI installed (`claude` command)
- Node.js 18+ (for development)
- Rust 1.70+ (for development)

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm tauri dev

# Build for production
pnpm tauri build
```

## GitHub Actions Build

The project uses GitHub Actions for automated building. Push to `main` or create a tag to trigger builds:

```bash
# Push changes
git push origin main

# Create a release tag
git tag v0.1.0
git push origin v0.1.0
```

Build artifacts will be available in the GitHub Releases page.

## Project Structure

```
claude-code-desktop/
├── src-tauri/           # Rust backend
│   ├── src/
│   │   ├── main.rs      # Tauri entry point
│   │   ├── commands/    # Tauri commands
│   │   ├── claude/      # Claude CLI integration
│   │   └── utils/       # Utility functions
│   └── Cargo.toml
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── stores/          # Zustand state management
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── .github/workflows/   # CI/CD configuration
└── package.json
```

## License

MIT
