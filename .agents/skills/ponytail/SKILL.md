---
name: ponytail
description: Lazy Senior Developer philosophy for AI agents. Enforces YAGNI, standard library primacy, code reuse, zero bloat, and the Necessity Ladder to prevent over-engineering and token waste in generated code.
---

# Ponytail: Lazy Senior Developer Code Generation Protocol

> *"The best code is the code you never wrote."*

Ponytail is an architectural and code generation guideline that treats complexity as liability. It stops agents from over-engineering solutions, adding unnecessary dependencies, or writing custom abstractions when standard tools suffice.

## The Necessity Ladder

Before writing any new line of code or introducing an abstraction, ascend the ladder:

1. **Step 1: Is this strictly necessary? (YAGNI)**
   - If the user didn't ask for it and the feature doesn't directly solve the requirement, do NOT write it.
   - Say NO to speculative generalizations, unused getters/setters, factory wrappers, and hypothetical future extension hooks.

2. **Step 2: Does it already exist in the codebase?**
   - Search the workspace first (`grep_search` / `list_dir`).
   - Reuse existing design tokens, CSS classes, helper functions, and components.

3. **Step 3: Can the Standard Library / Built-in API do it?**
   - Prioritize language built-ins:
     - JavaScript/TypeScript: `fetch`, `URL`, `crypto.subtle`, `Array.prototype`, `localStorage`, `Intl`.
     - Rust: `std::fs`, `std::process::Command`, `std::time::Instant`, `std::path::Path`.
   - Never reinvent data structures or helper algorithms already in stdlib.

4. **Step 4: Is there a native platform/OS feature?**
   - Use native browser/OS controls (`<dialog>`, `<input type="color">`, Windows Registry, PowerShell cmdlets) instead of 500-line custom UI widgets.

5. **Step 5: Is there an already installed dependency?**
   - Never add a new npm package or cargo crate without absolute necessity. Check `package.json` and `Cargo.toml`.

6. **Step 6: Can it be written in a simple, readable one-liner or pure function?**
   - Prefer simple, transparent, readable functions over multi-layered class hierarchies or premature modularization.

7. **Step 7: Final Resort — Minimum Viable Implementation**
   - Write the cleanest, smallest amount of production-grade code that satisfies the requirements.

## Safety Carve-Out ("Lazy, Not Negligent")

Ponytail is minimalist, never sloppy. The following MUST NOT be skipped or compromised:
- Security validation & shell argument escaping.
- Error handling at external boundaries (Tauri IPC, Registry calls, File IO).
- TypeScript strict typing (no loose `any` bypasses).
- Unit tests & safety verifications.

## Anti-Patterns Banished by Ponytail
- ❌ Installing an npm package for string manipulation or basic date formatting.
- ❌ Creating 5-layer abstraction hierarchies for a single component.
- ❌ Writing custom event buses when simple state stores or native callbacks exist.
- ❌ Duplicating CSS utilities instead of using the MD3 design system tokens.
