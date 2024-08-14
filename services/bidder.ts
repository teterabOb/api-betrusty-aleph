import { ethers } from "ethers";
import {
  initializeBidder,
  initializeERC20Contract,
  initializeERC721Contract,
  initializeMarketplaceContract,
  initializeOwner,
} from "./helperService";
import {
  addSignatureToList,
  SignatureMarketplace,
} from "../common/helpers/data/sessionData";
import { getEnvData } from "../common/helpers/data/envData";

// Estructura de datos de la subasta
export interface AuctionData {
  nftContracAddress: string;
  ERC20CurrencyAddress: string;
  nftContractId: number;
  erc20CurrencyAmount: string;
}

// Función para que el postor haga la oferta
export async function makeOffer(auctionData: AuctionData): Promise<string> {
  // Setea el address del token ERC20 y del ERC721 desde las variables de entorno
  auctionData.ERC20CurrencyAddress = getEnvData().ERC20CcontractAddress 
  auctionData.nftContracAddress = getEnvData().ERC721ContractAddres
  // Inicializa la cuenta del postos (bidder/buyer)
  const buyer = initializeBidder();
  const erc20Contract = initializeERC20Contract(false);
  const erc721Contract = initializeERC721Contract(false);
  //Accede a los fondos del buyer
  const balance = await erc20Contract.balanceOf(buyer.address);
  const isMarketplaceApproved = await erc721Contract.isApprovedForAll(
    initializeOwner().address,
    initializeMarketplaceContract(true).address
  );
  
  // Valida si tiene suficientes fondos
  if (balance >= ethers.utils.parseUnits(auctionData.erc20CurrencyAmount)) {
    
    // Valida que el Marketplace tenga permisos para transaccionar los items
    // de esta manera validamos que esté en venta
    if (isMarketplaceApproved) {      
      // Valida que el ID enviado exista
      if (
        await idExists(auctionData.nftContractId.toString(), erc721Contract)      
      ) {
                
        // Hashea el objeto con los parámetros para obtener el messageHash
        const messageHash = ethers.utils.solidityKeccak256(
          ["address", "address", "uint256", "uint256"],
          [
            auctionData.nftContracAddress,
            auctionData.ERC20CurrencyAddress,
            auctionData.nftContractId,
            ethers.utils.parseUnits(auctionData.erc20CurrencyAmount)
          ]
        );
                
        // Firma el messageHash con la clave privada del postor (buyer/bidder)
        const bidderSig = await buyer.signMessage(
          ethers.utils.arrayify(messageHash)
        );

        const signature: SignatureMarketplace = {
          price: auctionData.erc20CurrencyAmount,
          nftContractId: auctionData.nftContractId,
          signature: bidderSig,
        };

        // Agrega la Firma al arreglo de Firmas para guardarlo en memoria
        addSignatureToList(signature);
        // Lógica para enviar la firma del postor al propietario a través de la API REST
        return "Bid succesfully signed : " + bidderSig;
      } else {
        throw new Error("Token ID : " + auctionData.nftContractId +" does not exist.");
      }
    } else {
      throw new Error(
        "You don't have enough funds. You're offering: " +
          auctionData.erc20CurrencyAmount +
          " and you have : " +
          balance.toString()
      );
    }
  } else {
    throw new Error(
      "You don't have enough funds. You're offering: " +
        auctionData.erc20CurrencyAmount +
        " and you have : " +
        balance.toString()
    );
  }
}

async function idExists(
  nftContractId: string,
  erc721Contract: any
): Promise<boolean> {
  try {
    const idExists: any = await erc721Contract.tokenByIndex(nftContractId);
    return idExists;
  } catch (error) {
    return false;
  }
}
