import { ethers } from "ethers";

export interface Item {
  nftContractId: string;
  owner: string;
}

export interface Signature {
  price: ethers.BigNumber;
  nftContractId: number;
  signature: string;
}

let itemsForSale: Array<Item> = Array<Item>();
let listOfSignatures: Array<Signature> = Array<Signature>();

// Retorna la Lista de los Items en Venta
export function getListOfAvailableItems(): Item[] {
  return itemsForSale;
}

// Retorna la Lista de las Firmas
export function getListOfSignatures(): Signature[] {
  return listOfSignatures;
}

export function addItemToList(item: Item) {
  itemsForSale.push(item);
}

export function addSignatureToList(signature: Signature) {
  listOfSignatures.push(signature);
}
