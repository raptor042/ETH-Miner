"use client"

import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react"
import { useEffect, useState } from "react"

export default function ConnectWallet() {
    const { address, isConnected } = useWeb3ModalAccount()

    const { open } = useWeb3Modal()

    const [account, setAccount] = useState()

    useEffect(() => {
        if (isConnected) {
            const _address = truncate(address)

            setAccount(_address)
        }
    }, [address, isConnected])

    const truncate = (_address) => {
        const start = _address.substring(0, 6)
        const end = _address.substring(36, 42)

        return start + "..." + end
    }

    return (
        <div id="connect-wallet">
            <button onClick={() => open()} className="py-3 px-4 rounded-md flex justify-center items-center bg-[#04BF45] text-white">
                {isConnected ?
                    account : "Connect Wallet"
                }
            </button>
        </div>
    )
} 