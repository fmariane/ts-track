# TypeScript — Functions Reference

## Sources

- **Handbook (official, basic):** https://www.typescriptlang.org/docs/handbook/2/basic-types.html
- **Handbook — More on Functions (fuller):** https://www.typescriptlang.org/docs/handbook/2/functions.html
- **Google TypeScript Style Guide (conventions):** https://ts.dev/style/

> The basic-types handbook page is short on functions. The "More on Functions" page above is the fuller official doc. Conventions (which form to use *when*) come from the Google style guide.

---

## 1. The three ways to define a function

```typescript
// 1. Function declaration — has its own name, is hoisted
function getGrade(score: number): string {
    return score >= 90 ? "A" : "B";
}

// 2. Function expression (pre-ES6) — stored in a variable. AVOID per style guide.
const getGrade2 = function (score: number): string {
    return score >= 90 ? "A" : "B";
};

// 3. Arrow function — an expression, stored in a variable or passed inline
const getGrade3 = (score: number): string => (score >= 90 ? "A" : "B");
```

### Declaration vs. expression

| Form | Has own name? | Stored in a variable? | Hoisted? |
|---|---|---|---|
| `function f() {}` (declaration) | ✅ | ❌ | ✅ callable before definition |
| `const f = function () {}` (expression) | ❌ | ✅ | ❌ |
| `const f = () => {}` (arrow expression) | ❌ | ✅ | ❌ |

Arrow functions are **always expressions** — there is no `function`-keyword version of the `=>` syntax. To reuse one you must store it in a variable or pass it directly as an argument.

---

## 2. Convention — which form to use (ts.dev/style)

> **Named functions → use `function`. Inline callbacks → use arrow functions. Never use the old `const x = function () {}` form.**

```typescript
// ✅ a real, named function (top-level OR nested) → function declaration
function averageGrade(student: Student): number { ... }

// ✅ an inline callback passed as a value → arrow function
const grades = scores.map((s) => getGrade(s));

// ❌ pre-ES6 function expression → never
const averageGrade = function (student: Student): number { ... };
```

- **Naming:** functions are `lowerCamelCase`. (Exception: React components are `UpperCamelCase`.)
- **Expression body vs. block body:** only use a concise expression body (`(s) => getGrade(s)`) if the return value is actually used. If the return is ignored, use a block body with braces:
  ```typescript
  scores.forEach((s) => {
      console.log(getGrade(s)); // return unused → block body
  });
  ```
- **`this`:** regular code should not touch `this`. Only use an arrow function to rebind `this` when genuinely necessary.
- **Avoid arrow functions as class properties** (`foo = () => {}`) — it obscures `this` binding.

---

## 3. Typing the parts

```typescript
function fn(param: ParamType): ReturnType { ... }
//          ^^^^^^^^^^^^^^^^^   ^^^^^^^^^^
//          each parameter      return type (often inferable, but explicit = a clear contract)
```

### Return types

```typescript
function getGrade(score: number): string { ... }   // returns a string
function printName(name: string): void { ... }      // returns nothing
```

You can usually **omit** the return type and let TypeScript infer it, but writing it makes the contract explicit and catches mistakes.

### Optional and default parameters

```typescript
function greet(name: string, greeting?: string): string {       // greeting may be undefined
    return `${greeting ?? "Hello"}, ${name}`;
}

function greet2(name: string, greeting: string = "Hello"): string {  // default value
    return `${greeting}, ${name}`;
}
```

Optional params (`?`) must come **after** all required params.

### Rest parameters

```typescript
function sum(...nums: number[]): number {
    return nums.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3); // 6
```

---

## 4. Function *types* (describing a function's shape)

Useful when passing functions as arguments or storing callbacks.

```typescript
// inline function type
let grader: (score: number) => string;
grader = getGrade;

// as a parameter
function applyGrader(scores: number[], grader: (score: number) => string): string[] {
    return scores.map(grader);
}

// named via a type alias
type Grader = (score: number) => string;
```

---

## 5. Tied to the class-management track

```typescript
interface Student {
    classes: string[];
    results: { class: string; grade: number }[];
}

// named function → function declaration
function averageGrade(student: Student): number {
    const total = student.results.reduce((sum, r) => sum + r.grade, 0); // arrow = inline callback
    return total / student.results.length;
}
```
