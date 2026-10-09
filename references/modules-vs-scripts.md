# TypeScript — Modules vs. Scripts

This trips up almost everyone. There are **two separate** meanings of "module" to keep straight:

1. **TypeScript's module-vs-script rule** — about *scope* (is a file's top-level stuff global or private?).
2. **The module system of the emitted JS** — CommonJS vs. ES modules (what the Node
   `MODULE_TYPELESS_PACKAGE_JSON` warning was about).

---

## Part 1 — Module vs. script (TypeScript scope rule)

> "In TypeScript, just as in ECMAScript 2015, any file containing a top-level `import` or
> `export` is considered a module. Conversely, a file without any top-level `import` or
> `export` declarations is treated as a script whose contents are available in the global scope
> (and therefore to modules as well)."
> — TypeScript Handbook, *Modules*: https://www.typescriptlang.org/docs/handbook/2/modules.html

So the dividing line is simply: **does the file have a top-level `import` or `export`?**

| | **Script** (no top-level import/export) | **Module** (has import/export) |
|---|---|---|
| Scope of top-level `let`/`const`/`function` | **Global** — shared across all script files | **Local** to the file |
| Share things between files | Implicitly, via global scope | Explicitly, via `export` / `import` |
| Collisions | Easy — two files declaring `student` clash | Impossible — each file is its own scope |

### The classic gotcha

Two script files, each with a top-level `let student`:

```typescript
// a.ts (script — no import/export)
let student = "Ana";

// b.ts (script — no import/export)
let student = "Beto";   // ❌ Cannot redeclare block-scoped variable 'student'. ts(2451)
```

Both files are **scripts**, so both `student`s land in the *same* global scope and collide —
even though the files never reference each other.

### The fix: make the file a module

Add any top-level `export` (or `import`). The file gets its own scope and the collision vanishes:

```typescript
// b.ts
export {};              // this one line turns the file into a module
let student = "Beto";   // ✅ now local to b.ts
```

`export {}` is the idiomatic "make this a module" marker when you don't otherwise need to export
anything. Any real `import`/`export` does the same.

> In **this** project every `.ts` file imports `prompt-sync` or uses `export`, so they're all
> modules — no global-scope collisions.

---

## Part 2 — The emitted module *system* (CommonJS vs. ES modules)

Separately, the JavaScript that `tsc` emits has to use *a* module system so Node can run it:

| | **CommonJS (CJS)** | **ES Modules (ESM)** |
|---|---|---|
| Import syntax in emitted `.js` | `const x = require("x")` | `import x from "x"` |
| Export syntax | `module.exports = ...` | `export ...` |
| How Node treats a `.js` file | default when no `"type"` | when `package.json` has `"type": "module"` (or file is `.mjs`) |

### What caused the warning

The emitted `.js` used ESM `import`, but `package.json` had **no `"type"` field**, so Node
couldn't tell which system to use, guessed, and warned:

```
[MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///…/class_management.js is not
specified and it doesn't parse as CommonJS. Reparsing as ES module because module syntax was detected.
```

Node determines a file's module system from, in order: the file extension (`.mjs`=ESM, `.cjs`=CJS),
then the nearest `package.json` `"type"` field, defaulting to CommonJS.
(See Node docs: https://nodejs.org/api/packages.html#type)

### What controls emit

- **`tsconfig.json` → `module` / `moduleResolution`**: how TypeScript writes imports in the output.
  `"NodeNext"` means "do whatever Node would do, based on `package.json` `type` and file extension."
- **`package.json` → `"type"`**: declares the project's flavor. `"module"` = ESM, absent/`"commonjs"` = CJS.

For no warning, these two must **agree**. This project is set to full ESM:
`tsconfig` `module: "NodeNext"` + `package.json` `"type": "module"`.

---

## Part 3 — This project's setup & how to run

`tsconfig.json`:
```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,   // lets `import promptSync from "prompt-sync"` (a CJS pkg) work
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```
`package.json`: `"type": "module"`.

Compile then run:
```sh
npx tsc                                      # compiles all .ts → .js
node 001-class_management/class_management.js
```

### Gotcha: `tsc` (no args) vs. `tsc <file>` — naming a file ignores the config

```sh
tsc            # ✅ finds & uses tsconfig.json (ESM, strict, interop)
tsc file.ts    # ❌ tsconfig.json is IGNORED → bare defaults, and the module warning returns
```

The moment you pass a filename on the command line, `tsc` **ignores `tsconfig.json` entirely**
and falls back to default compiler options. Newer TypeScript makes this a loud error instead of
failing silently:

```
error TS5112: tsconfig.json is present but will not be loaded if files are specified on
commandline. Use '--ignoreConfig' to skip this error.
```

(`--ignoreConfig` only silences the error — it still skips your config, so don't use it to "fix" this.)

**Always run bare `tsc`.** It searches the current directory and up the parent chain for
`tsconfig.json`, so it works from the project root *or* any exercise subfolder (e.g. inside
`001-class_management/`). To target a specific config explicitly instead: `tsc -p path/to/tsconfig.json`.

| Command | Uses `tsconfig.json`? |
|---|---|
| `tsc file.ts` | ❌ no — file arg disables the config (TS5112) |
| `tsc` | ✅ yes — finds & uses it |
| `tsc -p path/to/tsconfig.json` | ✅ yes — explicit project |

---

## ESM gotchas to expect (because `"type": "module"`)

1. **Relative imports need the `.js` extension** — even though the source is `.ts`:
   ```typescript
   import { Student } from "./student.js";   // ✅ (NOT "./student" or "./student.ts")
   ```
   Package imports like `"prompt-sync"` are unaffected.
2. **`__dirname` / `__filename` don't exist** in ESM. Use:
   ```typescript
   import { fileURLToPath } from "url";
   const __dirname = fileURLToPath(new URL(".", import.meta.url));
   ```
3. **`require()` isn't available** in ESM. Use `import`, or `createRequire(import.meta.url)` if you must.

If these feel like too much while learning, the alternative is to go CommonJS instead: set
`"module": "CommonJS"` in `tsconfig` and remove `"type": "module"` from `package.json`. Then `.js`
output uses `require`, no extensions are needed, and `__dirname` exists.
