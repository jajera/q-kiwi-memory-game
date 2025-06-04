# Using Amazon Q CLI to Build the Kiwi Memory Game

This guide explains how Amazon Q Developer CLI was used to create the Kiwi Memory Game, including setup, usage, and troubleshooting.

---

## 🛠 Prerequisites

* An AWS Builder ID (free)
* Amazon Q CLI installed
* Bash or other supported shell
* A folder containing your project (e.g., `q-kiwi-memory-game/`)

---

## 🚪 Step 1: Log in to Amazon Q CLI

Start by logging in:

```sh
q login
```

You’ll be prompted to select a login method:

```sh
? Select login method ›
❯ Use for Free with Builder ID
  Use with Pro license
```

Choose **Use for Free with Builder ID**. You’ll receive a unique verification code and a URL. For example:

```sh
Confirm the following code in the browser
Code: XXXX-XXXX

Open this URL: https://view.awsapps.com/start/#/device?user_code=XXXX-XXXX
▰▰▰▰▰▰▰ Logging in...
```

1. Open the URL in a browser
2. Paste the provided code
3. Once the device is authorized, you’ll see:

```sh
Device authorized
Logged in successfully
```

You’re now ready to begin using Q CLI commands.

---

## 💬 Step 3: Chat with Amazon Q

Run the following command to begin a chat session with Amazon Q:

```sh
q chat
```

Paste your full specification (see [`kiwi-game-spec.md`](./kiwi-game-spec.md)). The more **precise and structured** your instructions, the better the results Q will generate.

You may need to **iterate and refine** the output — especially to fix layout issues, logic bugs, or polish user experience.

Example prompt:

> Create a fully functional 4x4 memory matching game using New Zealand-themed emojis…

Q will output:

* `index.html`
* `style.css`
* `script.js`

---

## ✅ Final Notes

Once Q generates your files, customize them and redeploy as needed. This workflow supports iterative development — just open `q chat` again and request enhancements.

For the full prompt specification, see: [`docs/kiwi-game-spec.md`](./kiwi-game-spec.md)
