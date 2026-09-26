import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AddressProvider } from "@/lib/address-context";
import { CartProvider } from "@/lib/cart-context";
import StoreChrome from "@/components/StoreChrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Plavii — Eletrônicos, acessórios e utilidades com frete grátis",
  description:
    "Loja multicategoria em Sobradinho/DF — eletrônicos, acessórios, brinquedos e utilidades com frete grátis e garantia de até 1 ano.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <AddressProvider>
              <StoreChrome>{children}</StoreChrome>
            </AddressProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
