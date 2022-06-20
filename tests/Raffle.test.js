const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
require("dotenv").config;
// vrf variables
const BASE_FEE = ethers.utils.parseEther("0.25");
const GAS_PRICE_LINK = 1 * 10 ** 9;
// raffle variables
const KEY_HASH =
  "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
const ENTRANCE_FEE = ethers.utils.parseEther("0.01");
const VRF_SUBSCRIPTION_FUND = ethers.utils.parseEther("1");
const CALLBACK_GAS_LIMIT = "500000";
const INTERVAL = "1";

function log(value) {
  console.log(value);
}

describe("Raffle unit tests", async function () {
  let VRFCoordinatorV2MockFactory,
    VRFCoordinatorV2Mock,
    VRFCoordinatorV2Address;
  let subscriptionId;
  let RaffleFactory, Raffle;
  beforeEach(async function () {
    // vrf mock deploy
    VRFCoordinatorV2MockFactory = await ethers.getContractFactory(
      "VRFCoordinatorV2Mock"
    );
    VRFCoordinatorV2Mock = await VRFCoordinatorV2MockFactory.deploy(
      BASE_FEE,
      GAS_PRICE_LINK
    );
    VRFCoordinatorV2Address = VRFCoordinatorV2Mock.address;
    assert(
      VRFCoordinatorV2Address.length > 0,
      "no VRFCoordinatorV2Mock address"
    );
    // vrf subscription
    let txCreateSubResponse = await VRFCoordinatorV2Mock.createSubscription();
    let txCreateSubReceipt = await txCreateSubResponse.wait();
    subscriptionId = txCreateSubReceipt.events[0].args.subId;
    assert(subscriptionId, "no subscription id found");
    let txFundSubResponse = await VRFCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUBSCRIPTION_FUND
    );
    let txFundSubReceipt = await txFundSubResponse.wait();
    let newBalance = txFundSubReceipt.events[0].args.newBalance;
    assert(newBalance, "new balance missing");
    // raffle deploy
    RaffleFactory = await ethers.getContractFactory("Raffle");
    Raffle = await RaffleFactory.deploy(
      VRFCoordinatorV2Address,
      ENTRANCE_FEE,
      KEY_HASH,
      subscriptionId,
      CALLBACK_GAS_LIMIT,
      INTERVAL
    );
  });

  it("get initial recent winner", async function () {
    let tx = await Raffle.getRecentWinner();
    assert(
      tx === "0x0000000000000000000000000000000000000000",
      "should equal 0x0 address"
    );
  });

  it("enter raffle", async function () {
    let tx = await Raffle.enterRaffle({
      value: ethers.utils.parseEther("0.02"),
    });
    log(tx);
    let txReceipt = await tx.wait();
    log(txReceipt);
  });

  it("check upkeep", async function () {
    let tx = await Raffle.checkUpkeep("0x");
    log(tx);
  });

  it("perform upkeep", async function () {
    let tx = await Raffle.performUpkeep("0x");
    log(tx);
  });
});
