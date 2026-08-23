import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with deployer account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "0G");

  // 1. Deploy MockUSDC
  console.log("Deploying MockUSDC...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const usdcAddr = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", usdcAddr);

  // 2. Deploy SocialVault passing the MockUSDC address
  console.log("Deploying SocialVault...");
  const SocialVault = await hre.ethers.getContractFactory("SocialVault");
  const vault = await SocialVault.deploy(usdcAddr);
  await vault.waitForDeployment();
  const vaultAddr = await vault.getAddress();
  console.log("SocialVault deployed to:", vaultAddr);

  // 3. Deploy AgentNFT
  console.log("Deploying AgentNFT (Agentic ID)...");
  const AgentNFT = await hre.ethers.getContractFactory("AgentNFT");
  const agentNFT = await AgentNFT.deploy();
  await agentNFT.waitForDeployment();
  const agentNFTAddr = await agentNFT.getAddress();
  console.log("AgentNFT deployed to:", agentNFTAddr);

  console.log("\n=======================================================");
  console.log("✅ Deployed Contract summary:");
  console.log("MockUSDC Address:  ", usdcAddr);
  console.log("SocialVault Address:", vaultAddr);
  console.log("AgentNFT Address:   ", agentNFTAddr);
  console.log("=======================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
