const { ethers } = require("hardhat");
require("dotenv").config;

const { CONTRACT_NAME, CHAINLINK_CONTRACT, RPC_SERVER, PRIVATE_KEY } =
  process.env;
const KEY_HASH =
  "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
const ENTRANCE_FEE = ethers.utils.parseEther("0.01");
const VRF_SUBSCRIPTION_FUND = ethers.utils.parseEther("1");
const CALLBACK_GAS_LIMIT = "500000";
const INTERVAL = "30";

const VRFCoordinatorV2Mock = require("../artifacts/@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol/VRFCoordinatorV2Mock.json");
const deploy = async () => {
  let provider = new ethers.providers.JsonRpcProvider(RPC_SERVER);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log(wallet);
  const vrfCoordinatorV2Mock = new ethers.Contract(
    CHAINLINK_CONTRACT,
    VRFCoordinatorV2Mock.abi,
    wallet
  );
  let txCreateSubResponse = await vrfCoordinatorV2Mock.createSubscription();
  let txCreateSubReceipt = await txCreateSubResponse.wait(1);
  console.log(txCreateSubReceipt);
  const SUBSCRIPTION_ID = txCreateSubReceipt.events[0].args.subId;
  let txFundSubResponse = await vrfCoordinatorV2Mock.fundSubscription(
    SUBSCRIPTION_ID,
    VRF_SUBSCRIPTION_FUND
  );
  let txFundSubReceipt = await txFundSubResponse.wait(1);
  console.log(txFundSubReceipt);

  const contractFactory = await ethers.getContractFactory(CONTRACT_NAME);
  const contract = await contractFactory.deploy(
    CHAINLINK_CONTRACT,
    ENTRANCE_FEE,
    KEY_HASH,
    SUBSCRIPTION_ID,
    CALLBACK_GAS_LIMIT,
    INTERVAL
  );
  console.log("Contract deployed to address:", contract.address);
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
