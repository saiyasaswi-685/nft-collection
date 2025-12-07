# NFT Collection – ERC721 Smart Contract (Hardhat + Docker)

This project implements a complete ERC-721 NFT Collection smart contract using Solidity, Hardhat, and OpenZeppelin.  
It includes a full automated test suite and a fully Dockerized environment to ensure reproducible, offline execution.  
This work fulfills all requirements of the Partnr Blockchain Development Task.

---

# 📌 Overview

The goal of this project is to build a reliable, secure, and fully tested NFT contract that supports:

- ERC-721 standard compliance  
- Unique token ownership  
- Minting restrictions  
- Metadata support  
- Approval and operator mechanisms  
- Burn functionality  
- Comprehensive automated testing  
- Docker-based testing environment  

---

# 🚀 Features

### ✔ Smart Contract Functionality
- ERC-721 compliant using OpenZeppelin  
- Owner-only minting  
- Maximum supply limit  
- Token ID validation  
- Pause / unpause minting  
- Token URI using baseURI + tokenId  
- Burn functionality  
- Transfer, approve, setApprovalForAll  
- Proper event emissions  

### ✔ Testing
- 13 automated tests validating:
  - Minting  
  - Transfers  
  - Approvals  
  - Operator approvals  
  - Burn behavior  
  - Supply tracking  
  - Unauthorized access prevention  
  - Gas usage estimation  
- All tests pass successfully  

### ✔ Docker Integration
- No manual steps required  
- Fully offline  
- Reproducible builds  
- Runs compilation + tests inside container  

---

# 📁 Project Structure

```
contracts/
  NftCollection.sol
test/
  NftCollection.test.js
hardhat.config.js
Dockerfile
package.json
package-lock.json
README.md
.dockerignore
```

---

# 🛠 Running Locally

### Install Dependencies
```
npm install
```

### Compile Contracts
```
npx hardhat compile
```

### Run Test Suite
```
npx hardhat test
```

Expected result:
```
13 passing
```

---

# 🐳 Running with Docker (Required for Evaluation)

This project includes a Dockerfile that automatically compiles and tests the entire project.

### Build Docker Image
```
docker build -t nft-contract .
```

### Run Tests Inside Docker
```
docker run nft-contract
```

Docker automatically:
- Installs Node.js dependencies  
- Sets up Hardhat  
- Compiles Solidity contracts  
- Executes the test suite  

Expected result:
```
13 passing
```

---

# 🔒 Security & Reliability Considerations

- Token IDs validated before mint  
- Max supply enforced  
- No double-minting  
- No minting to zero address  
- Transfers restricted to owner/approved/operator  
- Events emitted on all relevant actions  
- Reverts used for all invalid operations  
- Access control implemented via Ownable  

---

# ⚠️ Common Mistakes To Avoid

- Missing ERC-721 invariants  
- Unauthorized mint or transfer  
- Forgetting to emit Transfer / Approval events  
- Not reverting on invalid:
  - token IDs  
  - oversupply  
  - zero-address mint  
  - duplicate mint  
- Incomplete test coverage  
- Docker images requiring manual steps  
- Docker that depends on internet or external services  
- Missing files in Docker build context  

---

# 🧪 Test Coverage Summary

The test suite validates:

- Initial configuration  
- Owner-only minting  
- Mint pause handling  
- Supply and tokenId limits  
- Transfer mechanics  
- Approval + operator approval  
- Unauthorized access prevention  
- Burn updates ownership + supply  
- TokenURI correctness  
- Gas usage of mint + transfer  

All tests pass successfully.

---

# 📦 Tools & Technologies Used

- Solidity  
- Hardhat  
- OpenZeppelin  
- Docker  
- Node.js  
- Mocha / Chai  
- Git & GitHub  





