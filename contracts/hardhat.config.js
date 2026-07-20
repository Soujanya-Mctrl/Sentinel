require('@nomicfoundation/hardhat-toolbox')

module.exports = {
  solidity: {
    compilers: [
      { version: '0.8.19' },
      { version: '0.8.20' },
    ],
  },
  paths: {
    sources: './src',
    tests: './test',
    cache: '../cache/hardhat-cache',
    artifacts: '../artifacts',
  },
  networks: {
    hardhat: {},
    fuji: {
      url: process.env.FUJI_RPC || '',
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
}
