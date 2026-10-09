# Gotcha — reading input with `prompt-sync`

## The mistake

```typescript
import promptSync from "prompt-sync";

let student: string = "";
student = promptSync();   // ❌ Type 'Prompt' is not assignable to type 'string'
```

`promptSync()` does **not** read any input. It is a **factory**: calling it builds and returns a
`prompt` *function*. Assigning that function to a `string` variable is the type error.

## The fix — it's a two-step API

```typescript
import promptSync from "prompt-sync";

const prompt = promptSync();   // step 1: build the prompt fn ONCE (do this at module level)

let student: string = "";

function addStudent(): void {
    student = prompt("Enter student name: ");   // step 2: call it → returns the typed string
}
```

- **Step 1** `promptSync()` → returns a prompt function. Do it **once**, at the top of the module,
  not inside the function (otherwise it's rebuilt on every call).
- **Step 2** `prompt("label")` → actually reads a line from the terminal and returns it.

---

## Citations (official `prompt-sync` README)

Source: https://github.com/heapwolf/prompt-sync (README / "BASIC MODE" + "API")

**The factory is called first, then the returned function reads input:**

> ```js
> var prompt = require('prompt-sync')();
> //
> // get input from the user.
> //
> var n = prompt('How many more times? ');
> ```

**The API confirms the factory returns the prompt function:**

> `require('prompt-sync')(config) => prompt`
> "Returns an instance of the `prompt` function."

**The prompt function's signature:**

> `prompt(ask, value, opts)`
> "`ask` is the label of the prompt, `value` is the default value in absence of a response."

So `require('prompt-sync')` (the import) and `require('prompt-sync')()` (the factory call) are
two different things — the first is the factory, the second is the usable `prompt` function.
In ESM/TypeScript this is `import promptSync from "prompt-sync"` then `const prompt = promptSync()`.

---

## Related gotcha — the return type can be `null`

Per the README's `config` options:

> `sigint`: Default is `false`. … If sigint is `false`, prompt returns `null`.

Because the user can send `^C`, the typed return is effectively `string | null`, and
`@types/prompt-sync` reflects that. Guard before using it as a plain `string`:

```typescript
const answer = prompt("Enter student name: ");
if (answer === null) {
    return; // user aborted with Ctrl-C
}
student = answer; // now safely a string
```

To make `^C` throw/exit instead of returning `null`, build the prompt with `{ sigint: true }`:

```typescript
const prompt = promptSync({ sigint: true });
```

---

## Related gotcha — input is always a string

Even typing `90` gives the string `"90"`. Convert explicitly for numbers, and validate:

```typescript
const scoreText = prompt("Enter a score: ");
const score = Number(scoreText);           // "90" → 90
if (Number.isNaN(score)) {
    console.log("Not a valid number.");
}
```

## Install (TypeScript needs the types too)

```sh
npm install prompt-sync
npm install --save-dev @types/prompt-sync
```
