import { ethers } from "ethers";

export interface Item {
  nftContractId: string;
  owner: string;
}

export interface SignatureMarketplace {
  price: string;
  nftContractId: number;
  signature: string;
}

let itemsForSale: Array<Item> = Array<Item>();
let listOfSignatures: Array<SignatureMarketplace> =
  Array<SignatureMarketplace>();

// Retorna la Lista de los Items en Venta
export function getListOfAvailableItems(): Item[] {
  return itemsForSale;
}

// Retorna la Lista de las Firmas
export function getListOfSignatures(): SignatureMarketplace[] {
  return listOfSignatures;
}

export function addItemToList(item: Item) {
  itemsForSale.push(item);
}

export function addSignatureToList(signature: SignatureMarketplace) {
  listOfSignatures.push(signature);
}
