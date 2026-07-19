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

## 📂 Project Directory Structure (Line-by-Line Guide)

### 🖥️ Next.js Application Pages (`src/app/`)
* **[layout.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/layout.js)**: Root application wrapper. Configures the React Query client, Authentication context provider, global fonts, and mounts global layout elements: [Navbar](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/layout/Navbar.jsx), [CartDrawer](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/layout/CartDrawer.jsx), [WishlistDrawer](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/layout/WishlistDrawer.jsx), and [ChatWidget](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/ai/ChatWidget.jsx).
* **[page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/page.js)**: Front store landing page. Renders the main Hero banner, featured catalog lists, brand trust statements, and customer testomonials.
* **[products/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/products/page.js)**: Main shopping catalog search page. Features category tabs, price range filters, search inputs, and pagination controls.
* **[products/[id]/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/products/%5Bid%5D/page.js)**: Dynamic product details page. Implements selector options for sizes, color pickers, reviews timeline, and DB-synchronized wishlist toggle buttons.
* **[profile/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/profile/page.js)**: Customer profile dashboard. Allows authenticated clients to view and modify their Name, Email, and Mobile number.
* **[orders/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/orders/page.js)**: Customer orders tracking board, displaying all purchase receipts and checkout timeline status.
* **[reports/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/reports/page.js)**: Customer contact log tracker, matching authenticated user profile records.
* **[contact/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/contact/page.js)**: Contact Us form. Pre-fills customer identity fields automatically using active sessions.
* **[about/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/about/page.js)**: Minimalist brand story details, mission manifesto, and corporate figures.
* **[login/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/login/page.js)** & **[register/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/register/page.js)**: Client authorization forms.

### 🛡️ Admin Dashboard Console (`src/app/dashboard/`)
* **[layout.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/dashboard/layout.js)**: Admin dashboard sidebar navigation and headers. Implements responsive sidebar touch-out auto-closing behavior.
* **[page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/dashboard/page.js)**: Admin overview KPI dashboard, graphing revenue, orders, and sales distribution.
* **[products/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/dashboard/products/page.js)**: Product catalog inventory manager (adding, editing, deleting items with AI descriptive tag generator).
* **[orders/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/dashboard/orders/page.js)**: Platform order tracker. Allows administrators to update checkout states to 'Delivered' or cancel shipments.
* **[reviews/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/dashboard/reviews/page.js)**: Customer reviews feedback board.
* **[reports/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/dashboard/reports/page.js)**: Customer contact message logs moderation table.
* **[users/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/dashboard/users/page.js)**: Platform user moderation. Allows admins to block or unblock client accounts.
* **[chats/page.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/app/dashboard/chats/page.js)**: Stylist chat console. Supports manual takeover toggles and catalog tagging tools.

### 📦 Modular Components (`src/components/`)
* **[layout/Navbar.jsx](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/layout/Navbar.jsx)**: Global navigation bar featuring custom badges and dropdown profile menus.
* **[layout/CartDrawer.jsx](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/layout/CartDrawer.jsx)**: Shopping bag slider.
* **[layout/WishlistDrawer.jsx](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/layout/WishlistDrawer.jsx)**: Storefront wishlist drawer.
* **[ai/ChatWidget.jsx](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/ai/ChatWidget.jsx)**: Floating AI chatbot widget. Implements real-time background query polling.
* **[ai/CaptionGenerator.jsx](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/ai/CaptionGenerator.jsx)**: Gemini AI describer. Generates tags based on image uploads.
* **[ui/ProductCard.jsx](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/components/ui/ProductCard.jsx)**: Store product grid card with synchronized MongoDB wishlist triggers.

### ⚙️ Infrastructure Libraries (`src/lib/`)
* **[apiClient.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/lib/apiClient.js)**: Unified Axios wrapper.
* **[auth-context.js](file:///Users/zabedmahmud/Documents/Projects/Vestra-Fashion/Vestra-Fasion-Client/src/lib/auth-context.js)**: Session management framework.

---

## 🔗 Live Application Links
- **Front Storefront**: [https://vestra-fashion-store.vercel.app/](https://vestra-fashion-store.vercel.app/)
- **API Server Endpoint**: `https://vestra-fashion-server.vercel.app` (Substitute with production API gateway url as needed)

---

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
