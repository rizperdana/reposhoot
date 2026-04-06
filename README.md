<p align="center">
  <img src="https://social卡片生成的图片链接在此" alt="reposhoot" width="120">
</p>

<h1 align="center">reposhoot</h1>

<p align="center">
  Turn GitHub repos into beautiful, shareable images for social media
</p>

<p align="center">
  <a href="https://reposhoot.pages.dev"><img src="https://img.shields.io/badge/部署-Cloudflare Pages-blue?style=flat&logo=cloudflare" alt="Cloudflare Pages"></a>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="License">
</p>

---

## ✨ Features

- **Enter any GitHub repo** — just type `owner/repo` or paste a GitHub URL
- **6 beautiful templates:**
  - 📝 README Focus — Large rendered markdown
  - 👥 Contributors — Avatar grid + count  
  - 🚀 Release Hype — Latest release hero
  - 📊 Stats Dashboard — Stars/forks/watchers/issues
  - 🛠️ Tech Stack — Language bars
  - 💨 Minimal — Name + description
- **Export anyway you want:**
  - Download PNG or JPG
  - Copy to clipboard
  - Share to Twitter, LinkedIn, Hacker News
- **Saves your last repo** — cookie storage, 30 days

---

## 🚀 Live Demo

👉 **[reposhoot.pages.dev](https://reposhoot.pages.dev)**

Enter `facebook/react` or `vercel/next.js` — get a beautiful image instantly.

---

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) — App Router, static export
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [html2canvas](https://html2canvas.hertzen.com/) — Image generation
- [Cloudflare Pages](https://pages.dev/) — Deployment

---

## 📦 Deploy Your Own

```bash
# Clone
git clone https://github.com/rizperdana/reposhoot.git
cd reposhoot

# Install
npm install

# Build
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages project create reposhoot --production-branch=main
npx wrangler pages deploy .next --project-name=reposhoot --branch=main
```

---

## 📝 License

MIT — [rizperdana](https://github.com/rizperdana)

---

<p align="center">
  <sub>Made with ☕ for developers who want their repos to look good</sub>
</p>