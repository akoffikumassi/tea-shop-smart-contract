const { getNamedAccounts, deployments, network, run, ethers } = require("hardhat");
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const teaShopContract = await ethers.getContract("TeaShop", deployer);

    log(`TeaShop contract deployed to: ${teaShopContract.address}`);

    let contractBalance = ethers.utils.formatEther(
        await teaShopContract.provider.getBalance(teaShopContract.address)
    );

    log(`Contract balance: ${contractBalance} $ether`);

    /*
     * Let's try to buy a tea
     */
    const buyTeaTxn = await teaShopContract.buyTea(
        "This is tea #1",
        "Yada",
        ethers.utils.parseEther("0.001")
    );
    await buyTeaTxn.wait();

    //Get balance to see what happen
    contractBalance = ethers.utils.formatEther(
        await teaShopContract.provider.getBalance(teaShopContract.address)
    );

    log(`Contract balance After buy tea: ${contractBalance}`);

    let allTea = await teaShopContract.getTotalTea();

    console.log(`allTea: ${allTea}`);
};

module.exports.tags = ["all", "tea-shop"];
