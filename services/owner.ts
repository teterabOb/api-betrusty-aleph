import { AuctionData } from "./bidder";
import { BigNumber, ethers } from "ethers";
import {
  initializeBidder,
  initializeERC20Contract,
  initializeMarketplaceContract,
  initializeOwner,
} from "./helperService";
import { getEnvData } from "../common/helpers/data/envData";
import { GetListOfSignatures } from "../services/marketplace";
import { SignatureMarketplace } from "../common/helpers/data/sessionData";

// Función para que el propietario acepte la oferta
export async function acceptOffer(auctionData: AuctionData): Promise<any> {
  // Setea el address del token ERC20 y del ERC721 desde las variables de entorno
  auctionData.ERC20CurrencyAddress = getEnvData().ERC20CcontractAddress;
  auctionData.nftContracAddress = getEnvData().ERC721ContractAddres;
  const buyer = initializeBidder();
  const owner = initializeOwner();
  const marketplaceContract = initializeMarketplaceContract(true);
  const erc20Contract = initializeERC20Contract(false);

  // Hashea el objeto con los parámetros para obtener el messageHash
  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "address", "uint256", "uint256"],
    [
      auctionData.nftContracAddress,
      auctionData.ERC20CurrencyAddress,
      auctionData.nftContractId,
      ethers.utils.parseUnits(auctionData.erc20CurrencyAmount),
    ]
  );

  // Firma el messageHash con la clave privada del postor (bidder)
  const bidderSig = await buyer.signMessage(ethers.utils.arrayify(messageHash));
  // Obtiene el item listado segun los parametros del request
  // Para validar que los datos coincidan con los enviados en la Oferta
  const itemListed: SignatureMarketplace = getItemListedByInputs(
    auctionData.nftContractId,
    auctionData.erc20CurrencyAmount
  );
  
  // Valida que la firma exista dentro de las ofertas firmadas que 
  // se almacenan en memoria
  if (bidderSig === itemListed.signature) {
    // Hashea la firma del postor para obtener hashedBidderSig
    const hashedBidderSig = ethers.utils.keccak256(
      ethers.utils.arrayify(bidderSig)
    );

    // Firma hashedBidderSig con la clave privada del propietario (owner)
    const ownerSig = await owner.signMessage(
      ethers.utils.arrayify(hashedBidderSig)
    );

    const allowance = await erc20Contract.allowance(buyer.address, marketplaceContract.address);
    
    // Valida que exista allowance desde el Bidder/Buyer hacia el contrato Marketplace
    // para poder transferir los tokens ERC20 correspondientes a la oferta
    if(BigNumber.from(allowance.toString()) < ethers.utils.parseUnits(auctionData.erc20CurrencyAmount)){
      const approve = await erc20Contract.approve(marketplaceContract.address, ethers.utils.parseUnits(auctionData.erc20CurrencyAmount))
      approve.wait()
    }

    // Ejecuta la funcion finishAuction desde el Contrato para Aceptar la oferta
    const finishAuction = await marketplaceContract.finishAuction(
      {
        collectionAddress: auctionData.nftContracAddress,
        erc20Address: auctionData.ERC20CurrencyAddress,
        tokenId: auctionData.nftContractId,
        bid: ethers.utils.parseUnits(auctionData.erc20CurrencyAmount),
      },
      bidderSig,
      ownerSig
    );
    const receipt = await finishAuction.wait();

    //return receipt.transactionHash;
    return receipt;
  }else{
    throw Error("The token ID sent is not for sale or you're sending wrong values.")
  }
}

// Función auxiliar para obtener los datos de una oferta hecha previamente
// apuntando a -> api/transactions/make-offer
export function getItemListedByInputs(
  nftContractId: number,
  erc20CurrencyAmount: string
): SignatureMarketplace {
  let sig: SignatureMarketplace = {} as SignatureMarketplace;
  const listOfAvailableItems = GetListOfSignatures();
  if (listOfAvailableItems.length > 0) {
    const result = listOfAvailableItems.find(
      (item) =>
        item.price === erc20CurrencyAmount &&
        item.nftContractId === nftContractId
    );
    result === undefined ? false : (sig = result);
  }
  return sig;
}
