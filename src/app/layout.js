import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ToasterProvider from "../components/ui/ToasterProvider";
import CartDrawer from "../components/layout/CartDrawer";

export const metadata = {
  title: "VESTRA | Modern Premium Fashion Store",
  description: "VESTRA offers high-quality, modern, and minimalist wardrobe essentials for Men, Women, and Kids. Shop clean styles today.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-body min-h-full flex flex-col antialiased bg-white">
        <ToasterProvider />
        <CartDrawer />
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
