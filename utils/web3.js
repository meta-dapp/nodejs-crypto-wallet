const { toBn } = require("evm-bn")
const ethers = require('ethers')
const tokens = require("../base/tokens")

const fromWei = (amount, decimals) => {
    return amount / (10 ** decimals)
}

const toWei = (amount, decimals) => {
    return ethers.BigNumber
        .from(toBn(amount.toString(), decimals)._hex).toString()
}

const getTokenBySymbol = (symbol, chain) => {
    const allTokens = tokens[chain]

    if (symbol === true) {
        return null
    }

    return allTokens.find(token => {
        return token.symbol.toLowerCase() === symbol.toLowerCase()
    })
}

module.exports = {
    toWei,
    fromWei,
    getTokenBySymbol
}