import hardhatViem from "@nomicfoundation/hardhat-viem";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatViem],
  paths: {
    sources: "contracts/src",
    tests: "contracts/test",
    artifacts: "contracts/artifacts",
    cache: "contracts/cache",
  },
  solidity: {
    profiles: {
      default: {
        version: "0.8.24",
      },
      production: {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    avalancheFuji: {
      type: "http",
      chainType: "l1",
      chainId: 43113,
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [configVariable("AVALANCHE_FUJI_PRIVATE_KEY")],
    },
    avalancheMainnet: {
      type: "http",
      chainType: "l1",
      chainId: 43114,
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [configVariable("AVALANCHE_MAINNET_PRIVATE_KEY")],
    },
  },
});
