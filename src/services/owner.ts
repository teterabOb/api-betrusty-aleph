// Estructura de datos de la subasta
/*
interface AuctionData {
  collectionAddress: string;
  erc20Address: string;
  tokenId: number;
  bid: ethers.BigNumber;
}
*/

// Variable en memoria para guardar la firma del postor
let hashedBidderSig: string;

// Función para que el propietario acepte la oferta
export async function acceptOffer(payload: any): Promise<string> {
  const {  } = payload.body

  // Lógica para verificar la autenticidad de la firma del propietario (ownerSig)
  // Recuperar el messageHash original usando la función `getSigner` en tu contrato Solidity
  // Verificar que la firma del propietario es válida utilizando la función `recover`

  // Lógica para guardar la firma del postor en la variable en memoria
  // Aquí deberías guardar la firma del postor en la variable `hashedBidderSig`

  // Lógica para enviar una respuesta a la API REST con un mensaje de confirmación
  return ( "hola mundo");
}

// Función auxiliar para obtener la firma del postor almacenada en memoria
export function getHashedBidderSig(): string {
  return hashedBidderSig;
}
