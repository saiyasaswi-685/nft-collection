FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to optimize Docker caching
COPY package*.json ./

# Install all Node + Hardhat dependencies
RUN npm install

# Copy the rest of the project (contracts, tests, config)
COPY . .

# Compile Solidity contracts
RUN npx hardhat compile

# When the container runs, it will automatically execute the test suite
CMD ["npx", "hardhat", "test"]
