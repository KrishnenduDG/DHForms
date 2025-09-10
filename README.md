# 🔐 DH Forms

A toy yet complete **full-stack app** that mixes cryptography with dynamic forms.

It uses:

- **Diffie-Hellman Key Exchange** ⚡️
- **AES Encryption** 🔒 (Yeahh ChatGPT-ed my way through it 😉)

to secure form data before it even leaves your browser.

**⚠️ Btw this README is also GPT-ed ⚠️**

---

## ✨ Features

- Each browser session kicks off a **Diffie-Hellman handshake** with the server.
- Once the shared secret is established, a **dynamic form** is displayed.
- Submitted form data is encrypted with **AES**, using the shared session key.
- Even if an attacker intercepts the packets, all they’ll see is useless gibberish.

---

## 🧐 Why?

Heard about **MiTM (Man-in-the-Middle) attacks**?  
That’s when someone intercepts your data in transit.

👉 We can’t stop attackers from sniffing packets.  
👉 But we _can_ make sure they can’t read them.

By combining **Diffie-Hellman** (for key exchange) and **AES** (for encryption), this app demonstrates how sensitive data can be secured _before_ it leaves the client.

---

## 🛠️ Tech Stack

- **Frontend:** Vue + Typescript + TailwindCSS + DaisyUI (Inspired from [ARC](http://github.com/ARneshRC))

- **Backend:** Node.js + Express + Typescript
- **Crypto:** Native `crypto` (Node) + Web Crypto API (Browser)

---

## 🚀 Getting Started

Clone the repo:

```bash
git clone https://github.com/your-username/dh-forms.git
cd dh-forms
```

#### 🤖 Backend

Navigate to the Backend Directory

```bash
cd backend
```

Install dependencies:

```bash
pnpm install
```

Set the Environment Variables (according to [.env.example](./backend/.env.example))

Apply DB Migrations

```bash
pnpm run db:generate && pnpm run db:migrate
```

Run the TS compilation in watch mode:

```bash
pnpm run watch:compile
```

Now, run the server:

```bash
pnpm run dev
```

#### 🖼️ Frontend

Navigate to the Frontend Directory

```bash
cd frontend
```

Install dependencies:

```bash
pnpm install
```

Set the Environment Variables (according to [.env.example](./frontend/.env.example))

Run dev server

```bash
pnpm run dev
```

## ⚠️ Disclaimer

This is **not** production-grade crypto/security.
It’s just a learning project to explore how cryptography can fit into a full-stack real-life workflow.

## 💬 Suggestions & Questions

Got ideas to improve this project? Or just wanna discuss security, full-stack dev or maybe just how to center a div?

Feel free to reach out on **[LinkedIn](https://www.linkedin.com/in/krishnendudg/)** ✨

I’d love to connect! 🚀
