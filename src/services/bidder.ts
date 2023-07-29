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
  Signature,
} from "../common/helpers/data/sessionData";

// Estructura de datos de la subasta
export interface AuctionData {
  nftContracAddress: string;
  ERC20CurrencyAddress: string;
  nftContractId: number;
  erc20CurrencyAmount: ethers.BigNumber;
}

// Función para que el postor haga la oferta
export async function makeOffer(auctionData: AuctionData): Promise<string> {
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
  if (ethers.BigNumber.from(balance) >= auctionData.erc20CurrencyAmount) {
    // Valida que el Marketplace tenga permisos para transaccionar los items
    // de esta manera validamos que esté en venta
    if (isMarketplaceApproved) {
      // Hashea el objeto con los parámetros para obtener el messageHash
      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256"],
        [
          auctionData.nftContracAddress,
          auctionData.ERC20CurrencyAddress,
          auctionData.nftContractId,
          auctionData.erc20CurrencyAmount,
        ]
      );

      // Firma el messageHash con la clave privada del postor (buyer/bidder)
      const bidderSig = await buyer.signMessage(
        ethers.utils.arrayify(messageHash)
      );
      const signature: Signature = {
        price: auctionData.erc20CurrencyAmount,
        nftContractId: auctionData.nftContractId,
        signature: bidderSig,
      };
      // Agrega la Firma al arreglo de Firmas para guardarlo en memoria
      addSignatureToList(signature);
      // Lógica para enviar la firma del postor al propietario a través de la API REST
      return ("Bid signed succesfully!! " + bidderSig);
    } else {
      throw new Error("You don't have enough funds!!");
    }
  } else {
    throw new Error("You don't have enough funds!!");
  }
}
