# Documentation

## How to Build and Run the Docker Container

This project includes a Dockerfile that automatically installs all dependencies, compiles the smart contract, and runs the full test suite. No external services or manual steps are required.

### Running the Tests

Build the Docker image:
```
docker build -t nft-contract .
```

Run the tests using Docker:
```
docker run nft-contract
```

The Dockerfile automatically:
- Installs required Node.js packages  
- Sets up Hardhat  
- Compiles all Solidity contracts  
- Executes the complete automated test suite  

---

## Common Mistakes To Avoid

- Not enforcing ERC-721 invariants (unique ownership, non-zero owners)  
- Allowing unauthorized mint or transfer  
- Missing required events (Transfer, Approval, ApprovalForAll)  
- Not reverting on:
  - invalid token IDs  
  - minting over max supply  
  - minting to zero address  
  - double-minting  
- Writing incomplete tests  
- Docker files requiring manual interaction  
- Depending on network access or external blockchain nodes  
- Forgetting necessary files in Docker context  
- Inefficient Docker builds  

