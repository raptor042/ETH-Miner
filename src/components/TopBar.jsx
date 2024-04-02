"use client"

import logo from "../assets/img/logo.png";
import ConnectWallet from "./ConnectWallet";
import Image from "next/image";

const TopBar = () => {
  return (
    <div className="flex justify-between items-center gap-4 py-4">
      <Image src={logo} alt="logo" className="md:w-[150px] w-[100px]" />
      <div className=" top-[15px] md:right-4 right-2 ">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default TopBar;
