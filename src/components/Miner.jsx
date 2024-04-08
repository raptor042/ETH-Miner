"use client"

import { MINER_ABI, MINER_CA } from "@/context/config";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  let provider;

  if (walletProvider) {
    provider = new ethers.BrowserProvider(walletProvider)
  }

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

    if(lastDeposited >= lastClaimed) {
      duration = (block.timestamp - lastDeposited) / 86400
      console.log(duration)
    } else {
      duration = (block.timestamp - lastClaimed) / 86400
      console.log(duration)
    }

    if(duration >= (Number(minDuration) / 86400)) {
      const eth_mined = (roi * 2) / 365
      console.log(eth_mined)

      if(eth_mined > 0) {
        setETHMined(Number(eth_mined).toFixed(10))
      } else {
        setETHMined(0.0)
      }
    } else {
      const eth_mined = (roi * duration) / 365
      console.log(eth_mined)

      if(eth_mined > 0) {
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

      await miner.mine(ethers.ZeroAddress, {value: ethers.parseEther(`${deposit}`)})

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

      await miner.withdraw({value: ethers.parseEther(`${tFee}`)})

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

      await miner.re_mine({value: ethers.parseEther(`${tFee}`)})

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

      await miner.claimRewards({value: ethers.parseEther(`${tFee}`)})

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
      <ToastContainer/>
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
              <p className="text-[#AFE84B] font-bold">{deposited} ETH</p>
            </div>
            <div className="px-2 py-2 flex justify-between ">
              <p className="font-light text-[#5d5d5d]">ETH Balance</p>
              <p className="text-[#AFE84B] font-bold">{eth_balance} ETH</p>
            </div>

            <div className="border-b pb-3 border-[#c5c5c5]">
              <div className="flex items-center gap-2 mt-3">

                <input
                  type="number"
                  placeholder="0.0 ETH"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="outline-none placeholder-[#AFE84B] placeholder-custom w-full placeholder-text-right p-3 border"
                />
                <button className="p-3 bg-[#AFE84B] h-full text-slate-100" onClick={() => setAmount(100)}>
                  <p>MAX</p>
                </button>
              </div>
              <div>
                <button
                  onClick={onDeposit}
                  className={
                    disabled
                      ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                      : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  {!loadingA && <p>Deposit ETH</p>}
                  {loadingA &&
                    <div className="flex justify-center">
                      <div role="status">
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={onWithdraw}
                className={
                  disabled
                    ? `w-full p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                    : `w-full p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                }
                disabled={disabled}
              >
                {!loadingB && <p>Withdraw ETH </p>}
                {loadingB &&
                  <div className="flex justify-center">
                    <div role="status">
                      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                }
              </button>
            </div>

            <div className="mt-2">
              <div className="px-2 py-2 flex justify-between ">
                <p className="font-semibold text-[#AFE84B]">ETH Mined</p>
                <p className="text-[#AFE84B] font-bold">{eth_mined} ETH</p>
              </div>
              <div className="flex justify-between ">
                <button
                  onClick={onReMine}
                  className={
                    disabled
                      ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                      : `w-[45%] p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  {!loadingC && <p className="md:text-[15px] text-[12px]">RE-MINE</p>}
                  {loadingC &&
                    <div className="flex justify-center">
                      <div role="status">
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
                </button>
                <button
                  onClick={onClaim}
                  className={
                    disabled
                      ? `w-[45%] p-2 mt-3 bg-[#c5c5c5] rounded-md cursor-pointer text-[#5d5d5d]`
                      : `w-[45%] p-2 mt-3 bg-[#011556] rounded-md cursor-pointer text-white`
                  }
                  disabled={disabled}
                >
                  {!loadingD && <p className="md:text-[15px] text-[12px]">CLAIM REWARD</p>}
                  {loadingD &&
                    <div className="flex justify-center">
                      <div role="status">
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  }
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
