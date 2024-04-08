"use client"

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react"

const projectId = "a7784566359fedc53b9586ee543d8b35"

// const mainnet = {
//     chainId: 1,
//     name: "Ethereum",
//     currency: "ETH",
//     explorerUrl: "https://etherscan.io",
//     rpcUrl: "https://mainnet.infura.io/v3/0253203d40d344978948e4641ac65adb"
// }

// const sepolia = {
//     chainId: 11155111,
//     name: "Sepolia Testnet",
//     currency: "SepoliaETH",
//     explorerUrl: "https://sepolia.etherscan.io",
//     rpcUrl: "https://sepolia.infura.io/v3/0253203d40d344978948e4641ac65adb"
// }

const base_mainnet = {
    chainId: 8453,
    name: "Base Mainnet",
    currency: "ETH",
    explorerUrl: "https://basescan.org",
    rpcUrl: "https://mainnet.base.org"
}

const base_sepolia = {
    chainId: 84532,
    name: "Base Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.basescan.org",
    rpcUrl: "https://sepolia.base.org"
}

const metadata = {
    name: "Profit-IQ - Ethereum Miner",
    description: "Profit-IQ - Ethereum Miner."
}

createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    projectId,
    chains: [base_mainnet, base_sepolia]
})

export function Web3ModalProvider({ children }) {
    return children
}