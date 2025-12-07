const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftCollection", function () {
  let NftCollection, nft;
  let owner, addr1, addr2;

  const NAME = "MyNFTCollection";
  const SYMBOL = "MNFT";
  const MAX_SUPPLY = 5;
  const BASE_URI = "https://example.com/metadata/";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    NftCollection = await ethers.getContractFactory("NftCollection");
    nft = await NftCollection.deploy(NAME, SYMBOL, MAX_SUPPLY, BASE_URI);
    await nft.waitForDeployment();
  });

  it("initial configuration is correct", async function () {
    expect(await nft.name()).to.equal(NAME);
    expect(await nft.symbol()).to.equal(SYMBOL);
    expect(await nft.maxSupply()).to.equal(MAX_SUPPLY);
    expect(await nft.totalSupply()).to.equal(0);
    expect(await nft.baseURI()).to.equal(BASE_URI);
  });

  it("only owner can mint", async function () {
    // Should revert (any revert is ok in OZ v5)
    await expect(
      nft.connect(addr1).safeMint(addr1.address, 1)
    ).to.be.reverted;

    // Should succeed
    await expect(nft.safeMint(addr1.address, 1))
      .to.emit(nft, "Transfer")
      .withArgs(ethers.ZeroAddress, addr1.address, 1);

    expect(await nft.totalSupply()).to.equal(1);
    expect(await nft.balanceOf(addr1.address)).to.equal(1);
    expect(await nft.ownerOf(1)).to.equal(addr1.address);
  });

  it("cannot mint when minting is paused", async function () {
    await nft.pauseMinting();

    await expect(
      nft.safeMint(addr1.address, 1)
    ).to.be.reverted;

    await nft.unpauseMinting();

    await expect(nft.safeMint(addr1.address, 1))
      .to.emit(nft, "Transfer")
      .withArgs(ethers.ZeroAddress, addr1.address, 1);
  });

  it("enforces max supply and valid tokenId range", async function () {
    await expect(
      nft.safeMint(addr1.address, 0)
    ).to.be.reverted;

    await expect(
      nft.safeMint(addr1.address, MAX_SUPPLY + 1)
    ).to.be.reverted;

    for (let i = 1; i <= MAX_SUPPLY; i++) {
      await nft.safeMint(addr1.address, i);
    }

    expect(await nft.totalSupply()).to.equal(MAX_SUPPLY);

    // OP version reverts on TokenId out of range, not max supply
    await expect(
      nft.safeMint(addr1.address, 99)
    ).to.be.reverted;
  });

  it("prevents double minting of same tokenId", async function () {
    await nft.safeMint(addr1.address, 1);

    await expect(
      nft.safeMint(addr1.address, 1)
    ).to.be.revertedWith("Token already minted");
  });

  it("prevents minting to zero address", async function () {
    await expect(
      nft.safeMint(ethers.ZeroAddress, 1)
    ).to.be.revertedWith("Cannot mint to zero address");
  });

  it("supports transfers by owner", async function () {
    await nft.safeMint(addr1.address, 1);

    await expect(
      nft.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
    )
      .to.emit(nft, "Transfer")
      .withArgs(addr1.address, addr2.address, 1);

    expect(await nft.ownerOf(1)).to.equal(addr2.address);
    expect(await nft.balanceOf(addr1.address)).to.equal(0);
    expect(await nft.balanceOf(addr2.address)).to.equal(1);
  });

  it("prevents unauthorized transfers", async function () {
    await nft.safeMint(addr1.address, 1);

    await expect(
      nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1)
    ).to.be.reverted; // OZ v5: custom error, not string message
  });

  it("allows approved address to transfer token", async function () {
    await nft.safeMint(addr1.address, 1);

    await expect(
      nft.connect(addr1).approve(addr2.address, 1)
    )
      .to.emit(nft, "Approval")
      .withArgs(addr1.address, addr2.address, 1);

    await expect(
      nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1)
    )
      .to.emit(nft, "Transfer")
      .withArgs(addr1.address, addr2.address, 1);
  });

  it("allows operator approvals for all tokens", async function () {
    await nft.safeMint(addr1.address, 1);
    await nft.safeMint(addr1.address, 2);

    await expect(
      nft.connect(addr1).setApprovalForAll(addr2.address, true)
    )
      .to.emit(nft, "ApprovalForAll")
      .withArgs(addr1.address, addr2.address, true);

    expect(await nft.isApprovedForAll(addr1.address, addr2.address)).to.equal(true);

    await expect(
      nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1)
    )
      .to.emit(nft, "Transfer")
      .withArgs(addr1.address, addr2.address, 1);
  });

  it("burning updates balances and supply", async function () {
    await nft.safeMint(addr1.address, 1);

    expect(await nft.totalSupply()).to.equal(1);
    expect(await nft.balanceOf(addr1.address)).to.equal(1);

    await expect(
      nft.connect(addr1).burn(1)
    )
      .to.emit(nft, "Transfer")
      .withArgs(addr1.address, ethers.ZeroAddress, 1);

    expect(await nft.totalSupply()).to.equal(0);
    expect(await nft.balanceOf(addr1.address)).to.equal(0);

    await expect(nft.ownerOf(1)).to.be.reverted; // OZ v5 uses custom error
  });

  it("tokenURI returns proper URL", async function () {
    await nft.safeMint(addr1.address, 1);

    const uri = await nft.tokenURI(1);
    expect(uri).to.equal(`${BASE_URI}1`);
  });

  it("rough gas check for mint + transfer", async function () {
    const mintTx = await nft.safeMint(addr1.address, 1);
    const mintReceipt = await mintTx.wait();
    const mintGas = Number(mintReceipt.gasUsed);

    const transferTx = await nft
      .connect(addr1)
      .transferFrom(addr1.address, addr2.address, 1);
    const transferReceipt = await transferTx.wait();
    const transferGas = Number(transferReceipt.gasUsed);

    expect(mintGas).to.be.lessThan(300000);
    expect(transferGas).to.be.lessThan(300000);
  });
});
