const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONT_END_ADDRESSES_FILE = "../tea-shop-frontend/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../tea-shop-frontend/constants/abi.json";

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { log } = deployments;
    const { deployer } = await getNamedAccounts();
    const teaShopContract = await ethers.getContract("TeaShop", deployer);

    if (process.env.UPDATE_FRONT_END) {
        log("----------------------------------------------------------------");
        log("Updating font end...");
        updateContractAddresses(teaShopContract);
        updateAbi(teaShopContract);
        log("Front end written!");
    }
};

async function updateAbi(contract) {
    fs.writeFileSync(FRONT_END_ABI_FILE, contract.interface.format(ethers.utils.FormatTypes.json));
}

async function updateContractAddresses(contract) {
    const chainId = network.config.chainId.toString();
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"));
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(contract.address)) {
            currentAddresses[chainId].push(contract.address);
        }
    } else {
        currentAddresses[chainId] = [contract.address];
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

module.exports.tags = ["all", "frontend"];
