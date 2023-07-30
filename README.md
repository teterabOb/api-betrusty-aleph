### Prerequisites

Instalar las dependencias

```sh
npm install npm@latest -g
```

Configurar las variables de entorno que utiliza la API, si estas variables no se setean correctamente, las funcionalidades no se ejecutarán de manera satisfactoria.

Debes crear un archivo cuyo nombre sea .env. Dentro de este archivo debes copiar las variables que están en el recuadro inferior. 

```sh
OWNER_PRIVATE_KEY="..."
BIDDER_PRIVATE_KEY="..."
RPC_ENDPOINT="..."
ERC20_CONTRACT_ADDRESS="0xbd65c58D6F46d5c682Bf2f36306D461e3561C747" 
ERC721_CONTRACT_ADDRESS="0xFCE9b92eC11680898c7FE57C4dDCea83AeabA3ff"
MARKETPLACE_CONTRACT_ADDRESS="0x597C9bC3F00a4Df00F85E9334628f6cDf03A1184"
```

Para ejecutar la API debes utilizar el siguiente comando

```sh
npm run dev
```

Mint ERC20

```sh
{
    "address": "0x1c71Ce6C4d052723010a0C7320DE890fDc1622b6",
    "amount": "10"
}
```

Mint NFT

```sh
No se envía nada. Tomará la cuenta de la private key de la variable OWNER_PRIVATE_KEY del archivo .env como el owner.
```

Make Offer

```sh
{
    "auctionData": {
        "nftContracAddress": string,
        "ERC20CurrencyAddress": string,
        "nftContractId": number,
        "erc20CurrencyAmount": "0.1"
    }
}
  ```