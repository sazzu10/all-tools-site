# All Tools Platform (all-tools-site)

High-performance, privacy-first multi-tool platform featuring AI writing assistants, YouTube/social creator generators, developer utilities, and calculation tools.

---

## Quickstart (Termux / Linux)

```bash
cd ~/all-tools-site

# 1. Install dependencies
npm install

# 2. Start development server on port 4000
npm start
```

Once started, open your browser or tunnel at:
```
http://127.0.0.1:4000
```

---

## Initial 8 Tools (Registered in Registry)

| # | Tool Name | Slug | Category | Type |
|---|---|---|---|---|
| 1 | **AI Text Generator** | `/tools/ai-text-generator` | AI Tools | AI |
| 2 | **YouTube Title Generator** | `/tools/youtube-title-generator` | YouTube & Social | AI |
| 3 | **YouTube Description Generator** | `/tools/youtube-description-generator` | YouTube & Social | AI |
| 4 | **Hashtag Generator** | `/tools/hashtag-generator` | Creator Tools | AI |
| 5 | **JSON Formatter & Validator** | `/tools/json-formatter` | Developer Tools | Deterministic |
| 6 | **Image Compressor** | `/tools/image-compressor` | Image Tools | Client-Side Canvas |
| 7 | **QR Code Generator** | `/tools/qrcode-generator` | Utility & Calculators | Deterministic |
| 8 | **Universal Unit Converter** | `/tools/unit-converter` | Utility & Calculators | Deterministic |

---

## Architecture Highlights

* **Port Isolation:** Binds strictly to `PORT=4000`, keeping port `3456` untouched.
* **Server-Side Rendered:** Dynamic EJS layouts for 100% crawlable SEO (`<title>`, Open Graph, JSON-LD schemas).
* **Command Palette:** Press `Ctrl+K` or click search for instant client-side tool lookup.
* **AdSlot Placeholders:** Zero Cumulative Layout Shift (CLS) with fixed-dimension monetization containers.
* **Privacy:** Deterministic tools process locally with zero tracking.
