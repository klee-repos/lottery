const { ethers } = require("hardhat");
require("dotenv").config;

const BASE_FEE = ethers.utils.parseEther("0.25");
const GAS_PRICE_LINK = 1 * 10 ** 9;

const deploy = async () => {
  const MockFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock");
  const Mock = await MockFactory.deploy(BASE_FEE, GAS_PRICE_LINK);
  console.log("Contract deployed to address:", Mock.address);
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
