import { ethers } from "ethers";
import { getEnvData } from "../common/helpers/data/envData";
import {
  getAbiMockERC721,
  getAbiMarketplace,
  getAbiMockERC20,
} from "../common/helpers/abi/abi";

const envData = getEnvData();

function initializeMarketplaceContract(isOwner: boolean): ethers.Contract {
  const marketplaceContract = new ethers.Contract(
    envData.MarketplaceContractAddress,
    getAbiMarketplace(),
    setSigner(isOwner)
  );
  return marketplaceContract;
}

function initializeERC20Contract(isOwner: boolean): ethers.Contract {
  const ERC20Contract = new ethers.Contract(
    envData.ERC20CcontractAddress,
    getAbiMockERC20(),
    setSigner(isOwner)
  );
  return ERC20Contract;
}

function initializeERC721Contract(isOwner: boolean): ethers.Contract {
  const ERC721Contract = new ethers.Contract(
    envData.ERC721ContractAddres,
    getAbiMockERC721(),
    setSigner(isOwner)
  );
  return ERC721Contract;
}

function initializeOwner(): ethers.Wallet {
  const owner = new ethers.Wallet(
    envData.ownerPrivateKey,
    initializeProvider()
  );
  return owner;
}

function initializeBidder(): ethers.Wallet {
  const bidder = new ethers.Wallet(
    envData.bidderPrivateKey,
    initializeProvider()
  );
  return bidder;
}

function initializeProvider(): ethers.providers.JsonRpcProvider {
  const provider = new ethers.providers.JsonRpcProvider(envData.rpcEndpoint);
  return provider;
}

function setSigner(isOwner: boolean): ethers.Wallet {
  return isOwner ? initializeOwner() : initializeBidder();
}

export {
  initializeMarketplaceContract,
  initializeERC20Contract,
  initializeERC721Contract,
  initializeOwner,
  initializeBidder,
  initializeProvider,
};
