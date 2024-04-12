import { Kanit } from "next/font/google";
import "./globals.css";
import { Web3ModalProvider } from "../context/Web3Modal";

const inter = Kanit({
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata = {
  title: "Profit-IQ - Proof of Stake(POS)",
  description: "Profit-IQ - Proof of Stake(POS)",
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
