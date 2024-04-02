"use client"

import { useState } from "react";
import TopBar from "./TopBar";

const Miner = () => {
  const [disabled,] = useState(true);
  const [amount, setAmount] = useState(0);

  return (
    <div className="relative">
      <div className="flex flex-col justify-center items-center relative">
        {/* <div>
          <p className="text-[#d5d5d5] text-center -mt-5">
            Introducing Solana's First Rebase Token And <br />
            Interest Derivative.
          </p>
        </div> */}
        <div className="lg:w-[32%] md:w-[50%]  container mt-10 ">
          <div className="bg-white p-3 w-full rounded-[10px]  shadow-lg pb-5">
            <div className="px-2 py-2 flex justify-between ">
              <p className="font-light text-[#5d5d5d]">Deposited</p>
              <p className="text-[#AFE84B] font-bold">0.0 ETH</p>
            </div>
            <div className="px-2 py-2 flex justify-between ">
              <p className="font-light text-[#5d5d5d]">ETH Balance</p>
              <p className="text-[#AFE84B] font-bold">0.0 ETH</p>
            </div>

            <div className="border-b pb-3 border-[#c5c5c5]">
              <div className="flex items-center gap-2">

                <input
                  type="number"
                  placeholder="0.0 ETH"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="outline-none placeholder-[#AFE84B] placeholder-custom w-full placeholder-text-right px-2 py-2 mt-2 border"
                />
                <button className="py-1 px-3 bg-[#AFE84B] h-full" onClick={() => setAmount(100)}>
                  <p>MAX</p>
                </button>
              </div>
              <div>
                <button
                  className={
                    disabled
                      ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                      : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  <p>Deposit ETH</p>
                </button>
              </div>
            </div>

            <div>
              <button
                className={
                  disabled
                    ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                    : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                }
                disabled={disabled}
              >
                <p>Withdraw ETH </p>
              </button>
            </div>

            <div className="mt-2">
              <div className="px-2 py-2 flex justify-between ">
                <p className="font-semibold text-[#AFE84B]">ETH Mined</p>
                <p className="text-[#AFE84B] font-bold">0.0 ETH</p>
              </div>
              <div className="flex justify-between ">
                <button
                  className={
                    disabled
                      ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                      : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  <p className="md:text-[15px] text-[12px]">RE-MINE</p>
                </button>
                <button
                  className={
                    disabled
                      ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                      : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  <p className="md:text-[15px] text-[12px]">CLAIM REWARD</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Miner;
