import { Kanit } from "next/font/google";
import "./globals.css";
import { Web3ModalProvider } from "../context/Web3Modal";

const inter = Kanit({
  subsets: ["latin"],
  weight: "300",
});

export const metadata = {
  title: "Profit-IQ - Ethereum Miner",
  description: "Profit-IQ - Ethereum Miner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}
