# Rule: Ponytail Minimalist Code Generation (Lazy Senior Developer)

All AI agents writing code within the **1boost** codebase MUST adhere to Ponytail principles:

1. **Follow the Necessity Ladder**:
   - Step 1: YAGNI (Reject unrequested complexity or features).
   - Step 2: Codebase Reuse (Search and use existing utils/tokens before creating new ones).
   - Step 3: Standard Library First (Use built-in TypeScript/Rust standard library functions).
   - Step 4: Native Platform Features (Use native Windows/browser capabilities).
   - Step 5: Installed Dependencies (Do NOT add new packages without explicit justification).
   - Step 6: Clean Minimal Functions (Prefer simple, transparent functions over deep abstraction layers).
   - Step 7: Minimum Viable Implementation (Write only the necessary code to get the job done).
2. **Zero Bloat & No Premature Abstraction**: Do not wrap standard APIs in multi-layer adapter classes unless actively required for unit testing or IPC encapsulation.
3. **Lazy, Not Broken**: Always enforce strict typing, comprehensive error boundaries, and script safety analysis.
