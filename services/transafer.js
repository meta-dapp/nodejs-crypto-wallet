const Web3 = require('web3')
const chains = require('../base/chains')

const sendTransaction = async (chain, amount, wallet, toAddress) => {
    const web3 = new Web3(chains[chain])
    const gasPrice = await web3.eth.getGasPrice()
    const gasPriceHex = web3.utils.toHex(gasPrice)
    const gasLimitHex = web3.utils.toHex(3000000)

    const nonce = await web3.eth.getTransactionCount(wallet.address)
    const transaction = {
        from: web3.utils.toChecksumAddress(wallet.address),
        nonce: web3.utils.toHex(nonce),
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        to: web3.utils.toChecksumAddress(toAddress),
        value: web3.utils.toWei(amount)
    }

    const signedTx = await web3.eth.accounts.signTransaction(
        transaction,
        wallet.privateKey
    )

    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
}

module.exports = {
    sendTransaction
}