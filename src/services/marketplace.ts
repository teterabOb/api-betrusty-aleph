import {
  initializeERC20Contract,
  initializeERC721Contract,
  initializeMarketplaceContract,
  initializeOwner,
  initializeProvider,
} from "./helperService";
import {
  Item,
  SignatureMarketplace,
  addItemToList,
  getListOfAvailableItems,
  getListOfSignatures,
} from "../common/helpers/data/sessionData";
import { getAbiMockERC721 } from "../common/helpers/abi/abi";
import { ethers } from "ethers";

// ***
// Función para mintear un NFT y permitirle al Contrato
// del Marketplace transferirlo
// También se puede utilizar approveForAll para permitirle transferir todos los NFTs
// ***
export async function mintNFTMarketplace(): Promise<any> {
  const nftContract = initializeERC721Contract(true);
  const owner = initializeOwner();
  const marketplaceContract = initializeMarketplaceContract(true);

  try {
    const tx = await nftContract.mint(owner.address);
    const receipt = await tx.wait();

    const itemId = await getTokenIdByTxEventTransfer(receipt.transactionHash);

    const item: Item = {
      nftContractId: itemId.toString(),
      owner: owner.address,
    };

    const erc721Contract = initializeERC721Contract(true);
    const isMarketplaceApproved = await erc721Contract.isApprovedForAll(
      initializeOwner().address,
      initializeMarketplaceContract(true).address
    );

    if (!isMarketplaceApproved) {
      const txApprovalForAll = await nftContract.setApprovalForAll(
        marketplaceContract.address,
        true
      );

      txApprovalForAll.wait();
    }

    addItemToList(item);

    return (
      "NFT minted Succesfully, ID : " +
      itemId +
      ". With the following tx hash : " +
      receipt.transactionHash
    );
  } catch (error: any) {
    return error.message;
  }
}

export async function mintTokensERC20(
  address: string,
  amount: string
): Promise<any> {
  try {
    const erc20Contract = initializeERC20Contract(true);
    const tx = await erc20Contract.mint(address, ethers.utils.parseUnits(amount));
    const receipt = await tx.wait();
    return "Tokens succesfully minted. Tx hash: " + receipt.transactionHash;
  } catch (error) {
    return (
      "There was an error minting. Please check you are sending a valid address : " +
      address
    );
  }
}

// Obtener el Token desde los Logs de la tx
async function getTokenIdByTxEventTransfer(txHash: any): Promise<any> {
  const iface = new ethers.utils.Interface(getAbiMockERC721());
  const txtReceipt = await initializeProvider().getTransactionReceipt(txHash);
  const maps = txtReceipt.logs.map((log) => iface.parseLog(log));
  const tokenId = maps[0].args[2].toString();
  return tokenId;
}

export function GetListOfSignatures(): SignatureMarketplace[] {
  return getListOfSignatures();
}
