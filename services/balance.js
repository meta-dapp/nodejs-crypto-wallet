const Web3 = require('web3')
const chains = require('../base/chains')

const getBalance = async (chain, address) => {
    const web3 = new Web3(chains[chain])
    return web3.utils.fromWei(await web3.eth.getBalance(address), 'ether')
}

module.exports = {
    getBalance
}