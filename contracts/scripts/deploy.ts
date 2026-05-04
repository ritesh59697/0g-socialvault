import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "0G");

  const SocialVault = await hre.ethers.getContractFactory("SocialVault");
  const vault = await SocialVault.deploy();
  await vault.waitForDeployment();

  const address = await vault.getAddress();
  console.log("\n✅ SocialVault deployed!");
  console.log("Contract address:", address);
  console.log("Explorer:", `https://chainscan.0g.ai/address/${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});