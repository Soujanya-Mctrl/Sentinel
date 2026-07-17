import { network } from "hardhat";

const contractName = process.env.CONTRACT_NAME;

if (contractName === undefined || contractName.trim() === "") {
  throw new Error("Set CONTRACT_NAME to the contract you want to deploy.");
}

const { viem } = await network.create();
const contract = await viem.deployContract(contractName.trim(), []);

console.log(`${contractName.trim()} deployed to: ${contract.address}`);
