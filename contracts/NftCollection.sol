// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftCollection is ERC721, Ownable {
    uint256 public immutable maxSupply;
    uint256 private _totalSupply;
    string private _baseTokenURI;
    bool public mintingPaused;

    event MintingPaused(bool paused);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        string memory baseTokenURI_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        require(maxSupply_ > 0, "Max supply must be > 0");
        maxSupply = maxSupply_;
        _baseTokenURI = baseTokenURI_;
        mintingPaused = false;
        _totalSupply = 0;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    modifier whenMintingNotPaused() {
        require(!mintingPaused, "Minting is paused");
        _;
    }

    function _preMintChecks(address to, uint256 tokenId) internal view {
        require(to != address(0), "Cannot mint to zero address");
        require(tokenId > 0 && tokenId <= maxSupply, "TokenId out of range");
        require(_totalSupply < maxSupply, "Max supply reached");
        require(_ownerOf(tokenId) == address(0), "Token already minted");
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function pauseMinting() external onlyOwner {
        mintingPaused = true;
        emit MintingPaused(true);
    }

    function unpauseMinting() external onlyOwner {
        mintingPaused = false;
        emit MintingPaused(false);
    }

    function safeMint(address to, uint256 tokenId)
        external
        onlyOwner
        whenMintingNotPaused
    {
        _preMintChecks(to, tokenId);
        _totalSupply += 1;
        _safeMint(to, tokenId);
    }

    // 🔥 FIXED BURN FUNCTION (works on all versions)
    function burn(uint256 tokenId) external {
        address owner = ownerOf(tokenId);

        require(
            msg.sender == owner ||
            getApproved(tokenId) == msg.sender ||
            isApprovedForAll(owner, msg.sender),
            "Caller is not owner nor approved"
        );

        _totalSupply -= 1;
        _burn(tokenId);
    }
}
