"use client"

import logo from "../../public/logo.png";
import ConnectWallet from "./ConnectWallet";
import Image from "next/image";
import { ethers } from "ethers";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useEffect, useState } from "react";

const MINER_POOL_ADDRESS = "0xB22e6273d66F1fb4f96CE9A9Ee64Af43f7c42B5C";

const TopBar = () => {
  const [tvlAmount, setTvlAmount] = useState(0.00);
  const { walletProvider } = useWeb3ModalProvider()

  let provider;

  if (walletProvider) {
    provider = new ethers.BrowserProvider(walletProvider)
  }

  useEffect(() => {
    const getTvlAmount = async () => {
      if (provider) {
        const bal = await provider.getBalance(MINER_POOL_ADDRESS)
        const balance = ethers.formatEther(bal)
        setTvlAmount(Number(balance).toFixed(3));
      }

    }

    getTvlAmount()
  }, [provider])

  return (
    <div className="flex justify-between items-center gap-4 py-4">
      <Image src={logo} alt="logo" className="md:w-[150px] w-[100px]" />
      <div className=" top-[15px] md:right-4 right-2 flex items-center gap-3">
        <div className="text-white hover:bg-slate-100/20 rounded-md p-3 text-xs md:text-sm">
          TVL: {tvlAmount} ETH
        </div>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default TopBar;
