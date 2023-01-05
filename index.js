const Web3 = require('web3')
const args = require('args')
const fs = require('fs')
const chains = require('./base/chains')
const explorers = require('./base/explorers')
const { getBalance } = require('./services/balance')
const { sendTransaction } = require('./services/transafer')

let options
let chainToUse = 'bsc'
console.clear()

args
    .option('blockchains', 'Lista de blockchains soportadas')
    .option('info', 'Mostrar información de la wallet actual')
    .option('privateKey', 'Para mostrar la clave privada de tu wallet con --info')
    .option('chain', 'Indicar blockchain a usar [bsc]')
    .command('new', 'Crear una wallet nueva', _create)
    .command('load', 'Cargar una wallet existente', _load)
    .command('send', 'Enviar criptomoneda a una dirección', _send)

options = args.parse(process.argv)

function listAllChains() {
    console.log('====================== CHAINS SOPORTADAS =======================')

    Object.keys(chains).forEach(chain => {
        console.log(`> ${chain}: ${chains[chain]}`)
    })

    console.log('================================================================')
}

async function showWalletInfo() {
    console.log('====================== MI WALLET =======================')

    try {
        const wallet = fs.readFileSync('loaded/wallet.key', 'utf8')
        const { address, privateKey } = JSON.parse(wallet)

        console.log(`> ${chainToUse}: ${chains[chainToUse]}`)
        console.log(`> Address: ${address}`)
        if (options.p)
            console.log(`> Private key: ${privateKey}`)

        const balance = await getBalance(chainToUse, address)
        console.log(`> Balance: ${balance}`)
    } catch (err) {
        console.log('> ¡No hay ninguna wallet cargada!')
    }

    console.log('=========================================================')
}

function setChain() {
    if (chains[options.chain]) {
        chainToUse = options.chain
    } else {
        console.log(`'${options.chain}' no existe, revisa las blockchains compatibles con -b`)
        process.exit()
    }
}

async function _saveWallet(keys, dir) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir)

    fs.writeFileSync(`${dir}/wallet.key`, JSON.stringify(keys))
}

async function _create(name, data, _options) {
    options = _options
    if (options.c) {
        setChain()
    }

    const web3 = new Web3(chains[chainToUse])
    const { address, privateKey } = await web3.eth.accounts.create()

    _saveWallet({
        address,
        privateKey
    }, 'generated')

    console.log(`Wallet creada correctamente en 'generated/wallet.key'`)
}


async function _send(name, args, _options) {
    console.log('>> Transacción en curso <<')
    options = _options
    if (options.c) {
        setChain()
    }

    const web3 = new Web3(chains[chainToUse])

    if (args.length < 2 || args[0] <= 0 || !web3.utils.isAddress(args[1])) {
        console.log('> ¡Debes indicar la cantidad y el destino!')
        return
    }

    try {
        const wallet = fs.readFileSync('loaded/wallet.key', 'utf8')

        try {
            const { address, privateKey } = JSON.parse(wallet)
            const balance = await getBalance(chainToUse, address)

            if (args[0] > balance) {
                console.log('> ¡Balance insuficiente!')
                return
            }

            const receipt = await sendTransaction(
                chainToUse,
                args[0], // amount
                { address, privateKey },
                args[1] // toAddress
            )

            if (receipt && 'status' in receipt && receipt.status) {
                const { transactionHash } = receipt
                console.log('> Transacción realizada correctamente!')
                console.log(`> ${explorers[chainToUse]}/tx/${transactionHash}`)
            } else {
                console.log('> ¡No se ha podido realizar la transferencia!')
            }
        } catch (error) {
            console.log('> ¡No se ha podido realizar la transferencia!')
        }
    } catch (err) {
        console.log('> ¡No hay ninguna wallet cargada, carga una wallet primero!')
    }
}


async function _load(name, path, _options) {
    options = _options
    if (options.c) {
        setChain()
    }

    try {
        const wallet = fs.readFileSync(path[0], 'utf8')
        const { address, privateKey } = JSON.parse(wallet)

        _saveWallet({
            address,
            privateKey
        }, 'loaded')

        console.log(`> Wallet cargada correctamente!!`)
        console.log(`> Address: ${address}`)
    } catch (err) {
        console.log('> ¡No se ha podido cargar la wallet, verifica la ruta!')
    }
}

const _init = async () => {

    if (options.c) {
        setChain()
    }

    if (options.b) {
        listAllChains()
    }

    if (options.i) {
        showWalletInfo()
    }
}

_init()