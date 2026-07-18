# VESTRA | Premium Modern Minimalist Fashion Store

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-success?logo=vercel&logoColor=white&color=000000)](https://vestra-fashion-store.vercel.app/)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%204-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**VESTRA** is a premium, state-of-the-art e-commerce storefront presenting clean lines, modern typography, and curated minimalist wardrobe essentials for Men, Women, and Kids.

Live Demo: [https://vestra-fashion-store.vercel.app/](https://vestra-fashion-store.vercel.app/)

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js (App Router) using Turbopack for high-performance builds.
- **Styling:** Vanilla CSS & Tailwind CSS featuring custom minimalist design tokens (such as `primary` VESTRA Lime `#C9FA75` and bold `#111111` accents).
- **Notifications:** React Hot Toast styled with custom dark pill badges and lime green success checks.
- **Icons:** Gravity UI Icons paired with custom high-fidelity SVG paths.
- **State Management:** Decentralized, event-driven client state synced with `localStorage` (incredibly lightweight, zero-dependency, and junior-developer friendly).

---

## 🌟 Key Features

### 1. Dynamic Landing Page
- **Hero Banner:** Bold header with custom brand trust statements and clean calls-to-action utilizing Gravity UI icons.
- **Shop By Category:** Staggered category grids with responsive border outlines matching selected circles.
- **The Vestra Difference:** Embedded value propositions directly integrated into the brand manifesto with high-contrast truck and return icons.
- **Discover Mosaic:** Responsive staggered 2x2 grid image layout flanking custom CTA collection links.
- **Customer Reviews:** Responsive horizontal swipeable review row displaying customer avatars and star ratings.

### 2. Shop Page (`/products`)
- **Category Filter Tabs:** Simple interactive tabs pre-selected dynamically on URL click.
- **Dynamic Price Range:** Calculated dynamically from the maximum product price found in the database.
- **Case-Insensitive Search:** Real-time filter matching search input directly with product titles.

### 3. Product Details Page (`/products/[id]`)
- **Dynamic Retrieval:** Matches route parameters to display details dynamically from the database.
- **Interactive Gallery:** Lets users click thumbnails to cycle product images.
- **Select Options:** Dynamic states for sizes and colors.
- **Item Count Counters:** Simple `+/-` increment triggers.
- **Fallback Card:** Renders an inline *"Product Not Available"* warning if the ID is invalid instead of crashing.

### 4. Slide-over Cart Drawer
- **Responsive Drawer:** Slides out from the right with a clean dark backdrop overlay.
- **Event-Driven Auto-Open:** Automatically opens the drawer whenever an item is added to the cart from the details page.
- **Real-Time Counters:** Syncs item count badges instantly inside the main navigation bar.

### 5. Static & Auth Pages
- **Authentication:** Dedicated `/login` and `/register` pages featuring interactive input controls and form validation.
- **Corporate Info:** Dedicated `/about` and `/contact` sheets containing statistics cards and contact form logs.

---

## 📂 Project Directory Structure

```text
VESTRA/
├── public/                 # Static assets (images, vectors, fonts)
├── src/
│   ├── app/                # Next.js App Router routing directories
│   │   ├── about/          # About page route
│   │   ├── cart/           # Redundant (Removed in favor of Drawer)
│   │   ├── contact/        # Contact form page route
│   │   ├── login/          # Login access form
│   │   ├── products/       # Products list & dynamic Details routes
│   │   ├── register/       # Create account form
│   │   ├── globals.css     # Global Tailwind configurations
│   │   └── layout.js       # Root Layout wrapper
│   ├── components/         # Reusable layouts and components
│   │   ├── home/           # Homepage modular sections
│   │   ├── layout/         # Navigation, Footer, and CartDrawer
│   │   └── ui/             # Core UI atoms (buttons, cards, stars, toaster)
│   ├── data/               # Local JSON database arrays (products, categories, reviews)
│   └── utils/              # Centralized helpers (cart localStorage manager)
├── package.json            # Scripts and dependencies
└── README.md               # Presentation guidelines
```

---

## 🛠️ Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Zabedfolio/Vestra-Fashion-Store.git
   cd Vestra-Fashion-Store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the app locally.

4. **Verify production compile:**
   ```bash
   npm run build
   ```
