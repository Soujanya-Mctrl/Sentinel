const { Wallet } = require('ethers')

function main() {
  const wallet = Wallet.createRandom()
  console.log('--- Wallet (local generation) ---')
  console.log('Address:', wallet.address)
  // Mnemonic may be undefined in some environments; print when available
  if (wallet.mnemonic && wallet.mnemonic.phrase) {
    console.log('Mnemonic:', wallet.mnemonic.phrase)
  }
  console.log('Private Key:', wallet.privateKey)
  console.log('--------------------------------')
}

main()
