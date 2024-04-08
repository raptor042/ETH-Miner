"use client"

import { MINER_ABI, MINER_CA } from "@/context/config";
import { BiSolidDiamond } from "react-icons/bi"
import { FaSpinner } from "react-icons/fa"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Referral from "./Referral";

const Miner = () => {
  const [disabled, setDisabled] = useState(true)
  const [amount, setAmount] = useState(0)
  const [deposited, setDeposited] = useState(0.0)
  const [eth_balance, setETHBalance] = useState(0.0)
  const [eth_mined, setETHMined] = useState(0.0)
  const [tFee, setTransactionFee] = useState()

  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)
  const [loadingC, setLoadingC] = useState(false)
  const [loadingD, setLoadingD] = useState(false)

  const { address, isConnected } = useWeb3ModalAccount()

  const { walletProvider } = useWeb3ModalProvider()


  const [refAddress, setRefAddress] = useState("");


  let provider;

  if (walletProvider) {
    provider = new ethers.BrowserProvider(walletProvider)
  }

  const handleReferralAddress = (address) => {
    setRefAddress(address);
  };

  useEffect(() => {
    if (location.search) {
      setRefAddress(String(new URLSearchParams(location.search).get("ref")));
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      setInterval(() => {
        eth_miner()
      }, 3000)
      // eth_miner()
      setDisabled(false)
    }
  }, [
    disabled,
    deposited,
    eth_balance,
    eth_mined,
    address,
    isConnected,
    provider
  ])

  const eth_miner = async () => {
    const signer = await provider.getSigner()

    const miner = new ethers.Contract(
      MINER_CA,
      MINER_ABI,
      signer
    )

    const block = await provider.getBlock("latest")
    console.log(block)

    const minDuration = await miner.minDuration()
    console.log(Number(minDuration))

    const tFee = await miner.transaction_fee()
    console.log(ethers.formatEther(tFee))
    setTransactionFee(ethers.formatEther(tFee))

    const user = await miner.user(address)
    console.log(user)
    setDeposited(ethers.formatEther(user[1]))

    const roi = ethers.formatEther(user[2])
    const lastDeposited = Number(user[5])
    const lastClaimed = Number(user[6])
    let duration = 0

    if (lastDeposited >= lastClaimed) {
      duration = (block.timestamp - lastDeposited) / 86400
      console.log(duration)
    } else {
      duration = (block.timestamp - lastClaimed) / 86400
      console.log(duration)
    }

    if (duration >= (Number(minDuration) / 86400)) {
      const eth_mined = (roi * 2) / 365
      console.log(eth_mined)

      if (eth_mined > 0) {
        setETHMined(Number(eth_mined).toFixed(10))
      } else {
        setETHMined(0.0)
      }
    } else {
      const eth_mined = (roi * duration) / 365
      console.log(eth_mined)

      if (eth_mined > 0) {
        setETHMined(Number(eth_mined).toFixed(10))
      } else {
        setETHMined(0.0)
      }
    }

    const eth = await provider.getBalance(address)
    console.log(ethers.formatEther(eth))
    setETHBalance(Number(ethers.formatEther(eth)).toFixed(2))
  }

  const onDeposit = async (e) => {
    e.preventDefault()

    const signer = await provider.getSigner()

    const miner = new ethers.Contract(
      MINER_CA,
      MINER_ABI,
      signer
    )

    try {
      const deposit = Number(tFee) + Number(amount)
      console.log(deposit)

      setDisabled(true)
      setLoadingA(true)

      await miner.mine(ethers.ZeroAddress, { value: ethers.parseEther(`${deposit}`) })

      miner.on("Mine", (user, amount, e) => {
        console.log(user, ethers.formatEther(amount))

        toast.success("Deposited Successfully.")

        setDisabled(false)
        setLoadingA(false)
      })
    } catch (error) {
      console.log(error)

      toast.error("An error occured while processing your request.")

      setDisabled(false)
      setLoadingA(false)
    }
  }

  const onWithdraw = async (e) => {
    e.preventDefault()

    const signer = await provider.getSigner()

    const miner = new ethers.Contract(
      MINER_CA,
      MINER_ABI,
      signer
    )

    try {
      setDisabled(true)
      setLoadingB(true)

      await miner.withdraw({ value: ethers.parseEther(`${tFee}`) })

      miner.on("Withdraw", (user, amount, e) => {
        console.log(user, ethers.formatEther(amount))

        toast.success("Withdrawal Successful.")

        setDisabled(false)
        setLoadingB(false)
      })
    } catch (error) {
      console.log(error)

      toast.error("An error occured while processing your request.")

      setDisabled(false)
      setLoadingB(false)
    }
  }

  const onReMine = async (e) => {
    e.preventDefault()

    const signer = await provider.getSigner()

    const miner = new ethers.Contract(
      MINER_CA,
      MINER_ABI,
      signer
    )

    try {
      setDisabled(true)
      setLoadingC(true)

      await miner.re_mine({ value: ethers.parseEther(`${tFee}`) })

      miner.on("ReMine", (user, amount, e) => {
        console.log(user, ethers.formatEther(amount))

        toast.success("Re-Mined Successfully.")

        setDisabled(false)
        setLoadingC(false)
      })
    } catch (error) {
      console.log(error)

      toast.error("An error occured while processing your request.")

      setDisabled(false)
      setLoadingC(false)
    }
  }

  const onClaim = async (e) => {
    e.preventDefault()

    const signer = await provider.getSigner()

    const miner = new ethers.Contract(
      MINER_CA,
      MINER_ABI,
      signer
    )

    try {
      setDisabled(true)
      setLoadingD(true)

      await miner.claimRewards({ value: ethers.parseEther(`${tFee}`) })

      miner.on("Claim", (user, amount, e) => {
        console.log(user, ethers.formatEther(amount))

        toast.success("Claimed Successfully.")

        setDisabled(false)
        setLoadingD(false)
      })
    } catch (error) {
      console.log(error)

      toast.error("An error occured while processing your request.")

      setDisabled(false)
      setLoadingD(false)
    }
  }

  return (
    <div className="relative">
      <ToastContainer />
      <div className="flex flex-col justify-center items-center relative">
        {/* <div>
          <p className="text-[#d5d5d5] text-center -mt-5">
            Introducing Solana's First Rebase Token And <br />
            Interest Derivative.
          </p>
        </div> */}
        <div className="lg:w-[38%] md:w-[50%]  container mt-10 mb-8 ">
          <div className="bg-white p-3 w-full rounded-[10px]  shadow-lg pb-5">
            <div className="px-2 py-2 flex justify-between ">
              <p className="text-slate-950">Deposited</p>
              <p className="text-yellow-400 font-semibold">{deposited} ETH</p>
            </div>
            <div className="px-2 py-2 flex justify-between ">
              <p className="text-slate-950">ETH Balance</p>
              <p className="text-yellow-400 font-semibold">{eth_balance} ETH</p>
            </div>

            <div className="flex items-center my-3 gap-3">
              <p className="text-lg">Projected Yield</p>
              <p className="text-yellow-600 p-1 bg-yellow-200 rounded-xl text-sm">
                APY{" "}
                1578
                %
              </p>
            </div>

            <div className="border-b pb-3 border-[#c5c5c5]">
              <div className="flex items-center gap-2 mt-3">

                <input
                  type="number"
                  placeholder="0.0 ETH"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="outline-none w-full placeholder-text-right p-3 border"
                />
                <button className="p-3 bg-yellow-400 h-full text-white" onClick={() => setAmount(eth_balance - 0.0001)}>
                  <p>MAX</p>
                </button>
              </div>
              <div>
                <button
                  onClick={onDeposit}
                  className={
                    disabled
                      ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-slate-950`
                      : `w-full p-2 mt-3 bg-slate-600 rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  {!loadingA && <p>Deposit ETH</p>}
                  {loadingA &&
                    <FaSpinner className="animate-spin mx-auto text-xl" />
                  }
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={onWithdraw}
                className={
                  disabled
                    ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-slate-950`
                    : `w-full p-2 mt-3 bg-slate-600 rounded-md cursor-pointer text-white`
                }
                disabled={disabled}
              >
                {!loadingB && <p>Withdraw ETH </p>}
                {loadingB &&
                  <FaSpinner className="animate-spin mx-auto text-xl" />
                }
              </button>
            </div>

            <p className="mt-3 flex items-center justify-center gap-3">
              <BiSolidDiamond className="text-yellow-400" /> Mine ETH and earn rewards
            </p>

          </div>

          <div className="bg-white p-3 w-full rounded-[10px]  shadow-lg pb-5 mt-3">
            <div className="">
              <div className="px-2 py-2 flex justify-between ">
                <p className="font-semibold text-yellow-400">ETH Mined</p>
                <p className=" font-semibold">{eth_mined} ETH</p>
              </div>
              <div className="flex justify-between ">
                <button
                  onClick={onReMine}
                  className={
                    disabled
                      ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-slate-950`
                      : `w-[45%] p-2 mt-3 bg-slate-600 rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  {!loadingC && <p className="md:text-[15px] text-[12px]">RE-MINE</p>}
                  {loadingC &&
                    <FaSpinner className="animate-spin mx-auto text-xl" />
                  }
                </button>
                <button
                  onClick={onClaim}
                  className={
                    disabled
                      ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-slate-950`
                      : `w-[45%] p-2 mt-3 bg-slate-600 rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  {!loadingD && <p className="md:text-[15px] text-[12px]">CLAIM REWARD</p>}
                  {loadingD &&
                    <FaSpinner className="animate-spin mx-auto text-xl" />
                  }
                </button>
              </div>
            </div>
          </div>

          <Referral
            address={"0x5273hh3t33337373"} // referral addresscode for currently logged in user
            referred={false} // set true based on whether user data exists or not or if the referrer address field in userdata exists depending on how its going to work
            referrer={refAddress}
            setReferrer={handleReferralAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default Miner;
