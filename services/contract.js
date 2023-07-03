const Web3 = require('web3')
const HDWalletProvider = require("@truffle/hdwallet-provider")

const Web3Instance = async (privateKey, providerOrUrl) => {
    const provider = new HDWalletProvider({
        privateKeys: [privateKey],
        providerOrUrl,
        pollingInterval: 1000
    })

    const _web3 = await new Web3(provider)
    return _web3
}

const Instance = async (address, wallet, chainProvider) => {
    const tokenAbi = [
        { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
        { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
        { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
        { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
    ]

    const _web3 = await Web3Instance(wallet.privateKey, chainProvider)
    const contractInstance = await new _web3.eth.Contract(tokenAbi, address, {
        from: wallet.address
    })

    return contractInstance
}

module.exports = {
    Instance
}