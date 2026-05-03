# 🪪 ID Card Maker Pro

A free, offline-capable, browser-based ID card generator built for Indian government offices, corporate setups, and bulk card issuance. Built with vanilla HTML + CSS + JavaScript — **no build step, no backend.**

> Originally designed for the **Office of SDM (Revenue), Palari, District Balodabazar–Bhatapara, Chhattisgarh** but fully customizable for any office.

---

## ✨ Features

- 📐 **Standard CR80 size** — Portrait (54×85.6mm) and Landscape modes
- 📦 **Bulk import** — Excel (.xlsx) + Photos ZIP, generate 50+ cards in seconds
- 🎨 **8 preset themes** + custom color picker for every element
- 💧 **Auto watermark** with size and opacity controls
- ✍️ **Smart signature** — auto background removal (transparent PNG)
- 🔠 **Live font controls** — every text element adjustable
- 🗂️ **Profiles system** — save unlimited office configurations
- 🌐 **Offline ready** — works without internet (after first load)
- 💾 **Auto-save** to browser localStorage + JSON export/import
- 🖨️ **Print-ready** — proper page breaks, exact dimensions

---

## 🚀 Quick Start

### Option A — Run locally
```bash
git clone https://github.com/<YOUR-USERNAME>/id-card-maker.git
cd id-card-maker
# Just open index.html in any modern browser
```

### Option B — Deploy free on GitHub Pages
1. Fork or push this repo to your GitHub account
2. Go to **Settings → Pages**
3. Select branch `main`, folder `/ (root)`
4. Save → Wait 1 minute → Visit `https://<your-username>.github.io/id-card-maker/`

That's it! Your tool is now live and shareable. 🎉

---

## 📂 Project Structure

```
id-card-maker/
├── index.html          # Main entry point with control panel UI
├── styles.css          # All card + UI styles, CSS variables for theming
├── app.js              # Application logic (state, render, bulk import, profiles)
├── samples/            # Example Excel + photos ZIP for testing
│   ├── sample_data.xlsx
│   └── sample_photos.zip
├── docs/
│   └── PRINT_GUIDE.md  # Detailed printing instructions
├── README.md
├── LICENSE
└── .github/workflows/  # GitHub Actions (optional auto-deploy)
```

---

## 📖 Usage Guide

### 1. Single Card (Manual Entry)
1. Open `index.html` in browser
2. Edit office headings, upload logo + signature
3. Fill person details
4. Click **🖨️ Print All**

### 2. Bulk Cards (Excel + Photos)

**Excel format** (first row = headers):

| NAME | FATHER'S NAME | DOB | EMPLOYEE CODE | BLOOD GROUP | CONTACT NUMBER | OFFICE ADRESS |
|------|---------------|-----|---------------|-------------|----------------|---------------|
| Mr. Rajat Kumar Verma | Mr. Bhagirathi Verma | 03/06/1993 | 19070060046 | B+ | 9977895556 | Tahsil Office Palari |

**Photos ZIP format:**
- Filename = `EmployeeCode.jpg` (e.g., `19070060046.jpg`)
- Supported formats: JPG, JPEG, PNG, WEBP

Upload both → Click **📥 Import Bulk Data** → Done!

### 3. Save Profile for Future Use
- Set up office headings, logo, signature, theme
- Type a profile name (e.g., "Palari SDM Office")
- Click **💾 Save**
- Next time: select from dropdown to instantly restore everything

---

## 🎨 Themes

Built-in presets:

| Theme | Best for |
|---|---|
| Navy (default) | Government / Revenue |
| Maroon | Education / Academic |
| Forest Green | Forest / Agriculture |
| Royal Purple | Judicial |
| Teal | Health / Medical |
| Saffron | Cultural / Heritage |
| Charcoal | Corporate |
| Crimson | Police / Disaster Mgmt |

Each theme can be further customized via individual color pickers.

---

## 🖨️ Printing Tips

For best results when printing:
- Paper: **A4** or **CR80 cardstock** (250+ GSM)
- Browser: Chrome or Edge (best print fidelity)
- Settings:
  - Scale: **100% / Actual Size**
  - Margins: **None** or **Default**
  - Background graphics: **ON** ✅
  - Headers/footers: **OFF**

See [docs/PRINT_GUIDE.md](docs/PRINT_GUIDE.md) for advanced setup.

---

## 🛡️ Data Safety

- All data is stored locally in your browser's `localStorage` (~5MB limit)
- **Photos and logos are NOT uploaded anywhere** — fully client-side
- Use **💾 Save / Export** regularly to download JSON backups
- Use **Profiles** for multi-office setups

---

## 🤝 Contributing

PRs welcome! Common areas to extend:
- New themes (`THEMES` object in `app.js`)
- Additional fields on the card (modify render functions)
- New paper layouts (e.g., A4 sheet with N-up cards)
- Translations / Other Indian language UIs

---

## 📜 License

MIT License — free for personal, government, and commercial use.

See [LICENSE](LICENSE) for details.

---

## 🙏 Credits

- Built with ❤️ for the Patwari office, Palari, Chhattisgarh
- Excel parsing: [SheetJS](https://sheetjs.com/)
- ZIP handling: [JSZip](https://stuk.github.io/jszip/)
- Fonts: Google Fonts (Inter, Noto Sans Devanagari)

---

**Made for offices that want professional ID cards without paying ₹50/card to a vendor.** 🪪
