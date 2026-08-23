import { expect } from "chai";
import { ethers } from "hardhat";

describe("Upgrades and SocialVault Tips", function () {
  async function deployFixture() {
    const [owner, author, tipper] = await ethers.getSigners();

    // 1. Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    // 2. Deploy SocialVault passing the MockUSDC address
    const SocialVault = await ethers.getContractFactory("SocialVault");
    const socialVault = await SocialVault.deploy(await mockUSDC.getAddress());
    await socialVault.waitForDeployment();

    // 3. Deploy AgentNFT
    const AgentNFT = await ethers.getContractFactory("AgentNFT");
    const agentNFT = await AgentNFT.deploy();
    await agentNFT.waitForDeployment();

    // Distribute some USDC to tipper
    const tipAmount = ethers.parseEther("100");
    await mockUSDC.mint(tipper.address, tipAmount);

    return { socialVault, mockUSDC, agentNFT, owner, author, tipper, tipAmount };
  }

  describe("AgentNFT (ERC-7857)", function () {
    it("Should mint an Intelligent NFT profile with metadata hashes", async function () {
      const { agentNFT, author } = await deployFixture();
      const tokenURI = "https://example.com/agent-1";
      const dataDescription = "0G SocialVault profile agent with custom prompt models";
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("prompt-weights-hash-v1"));

      const tx = await agentNFT.mintIntelligentNFT(
        author.address,
        tokenURI,
        dataDescription,
        dataHash
      );
      await tx.wait();

      expect(await agentNFT.ownerOf(0)).to.equal(author.address);
      expect(await agentNFT.tokenURI(0)).to.equal(tokenURI);

      const info = await agentNFT.intelligentDataOf(0);
      expect(info.dataDescription).to.equal(dataDescription);
      expect(info.dataHash).to.equal(dataHash);
    });

    it("Should allow the owner to update the IntelligentData memory", async function () {
      const { agentNFT, author } = await deployFixture();
      const dataHash1 = ethers.keccak256(ethers.toUtf8Bytes("hash-1"));
      await agentNFT.mintIntelligentNFT(author.address, "uri", "desc1", dataHash1);

      const dataHash2 = ethers.keccak256(ethers.toUtf8Bytes("hash-2"));
      // update memory state
      await agentNFT.connect(author).updateIntelligentData(0, "desc2", dataHash2);

      const info = await agentNFT.intelligentDataOf(0);
      expect(info.dataDescription).to.equal("desc2");
      expect(info.dataHash).to.equal(dataHash2);
    });

    it("Should support mock iTransferFrom", async function () {
      const { agentNFT, author, tipper } = await deployFixture();
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("hash"));
      await agentNFT.mintIntelligentNFT(author.address, "uri", "desc", dataHash);

      // authorize tipper to transfer
      await agentNFT.connect(author).approve(tipper.address, 0);

      // perform iTransferFrom
      await agentNFT.connect(tipper).iTransferFrom(author.address, tipper.address, 0, "0x", "0x");

      expect(await agentNFT.ownerOf(0)).to.equal(tipper.address);
    });
  });

  describe("SocialVault USDC Tipping", function () {
    it("Should allow tipping a post with USDC using 0G Pay mechanism", async function () {
      const { socialVault, mockUSDC, author, tipper, tipAmount } = await deployFixture();

      // Author creates a post
      const createTx = await socialVault.connect(author).createPost(
        "storage-root-hash",
        "metadata-root-hash",
        0, // TEXT
        500 // 5% royalty
      );
      await createTx.wait();

      // Tipper approves SocialVault to spend USDC
      await mockUSDC.connect(tipper).approve(await socialVault.getAddress(), tipAmount);

      // Tipper tips the post with USDC
      const tipTx = await socialVault.connect(tipper).tipPostUSDC(1, tipAmount);
      await expect(tipTx)
        .to.emit(socialVault, "TipUSDCSent")
        .withArgs(1, tipper.address, author.address, tipAmount);

      // Verify balances (2% fee to treasury/owner, 98% to author)
      const fee = (tipAmount * 200n) / 10000n; // 2%
      const creatorAmt = tipAmount - fee;

      expect(await mockUSDC.balanceOf(author.address)).to.equal(creatorAmt);
      const initialOwnerBalance = 1000000n * 10n ** 18n;
      expect(await mockUSDC.balanceOf(await socialVault.treasury())).to.equal(initialOwnerBalance + fee);

      const post = await socialVault.posts(1);
      expect(post.tipUSDCTotal).to.equal(tipAmount);
    });
  });
});
