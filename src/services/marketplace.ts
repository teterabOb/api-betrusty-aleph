import {
  initializeERC721Contract,
  initializeMarketplaceContract,
  initializeOwner,
} from "./helperService";
import {
  Item,
  addItemToList
} from "../common/helpers/data/sessionData"


// ***
// Función para mintear un NFT y permitirle al Contrato
// del Marketplace transferirlo
// También se puede utilizar approveForAll para permitirle transferir todos los NFTs
// ***
export async function mintNFTMarketplace(): Promise<string> {
  const nftContract = initializeERC721Contract(true);
  const owner = initializeOwner();
  const marketplaceContract = initializeMarketplaceContract(true);

  try {
    const tx = await nftContract.mint(owner.address);
    tx.wait();
    const itemId = await nftContract.totalSupply();
    const item: Item = {
      nftContractId: itemId.toString(),
      owner: owner.address,
    };
    const approve = await nftContract.approve(
      marketplaceContract.address,
      itemId
    );

    approve.wait();
    addItemToList(item);

    return ("NFT minted Succesfully, ID : " + itemId);
  } catch (error) {
    return ("There was an error minting or approving the NFT!");
  }
}

