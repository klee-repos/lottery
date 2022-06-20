const { ethers } = require("hardhat");
require("dotenv").config;
const { RPC_SERVER, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

const { CONTRACT_NAME } = process.env;
const CONTRACT = require(`../artifacts/contracts/${CONTRACT_NAME}.sol/${CONTRACT_NAME}.json`);

const enterRaffle = async () => {
  let provider = new ethers.providers.JsonRpcProvider(RPC_SERVER);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log(wallet);
  const abi = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT.abi, wallet);
  let tx = await abi.enterRaffle({ value: ethers.utils.parseEther("0.02") });
  let txReceipt = tx.wait();
  console.log(txReceipt);
};

enterRaffle()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
