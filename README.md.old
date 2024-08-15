# Transacciones de NFT basadas en ofertas - README

## Introducción

Este repositorio alberga un proyecto destinado a facilitar las transacciones de NFT (tokens no fungibles) mediante el uso de una API. El objetivo es permitir que un usuario (owner/seller) realice operaciones basadas en ofertas presentadas por otros usuarios (bidder/buyer). Estas operaciones incluyen la aceptación de una oferta, la transferencia del NFT al usuario ofertante (bidder/buyer) y la recepción de tokens (ERC20) como pago, todo en una sola transacción. Estas interacciones se gestionan a través de un contrato inteligente (smart contract) manejado por la API.

## Prerequisites

Antes de ejecutar la API, asegúrate de instalar las dependencias con el siguiente comando:

```sh
npm install 
```

La API utiliza variables de entorno para su correcto funcionamiento, por lo que debes configurarlas adecuadamente. Si no se establecen correctamente, es posible que las funcionalidades no se ejecuten de manera satisfactoria.

Para configurar las variables de entorno, sigue estos pasos:

Crea un archivo llamado .env.
Dentro de este archivo, copia y pega las siguientes variables de entorno junto con sus respectivos valores:

```sh
OWNER_PRIVATE_KEY="..."
BIDDER_PRIVATE_KEY="..."
RPC_ENDPOINT="..."
ERC20_CONTRACT_ADDRESS="0xbd65c58D6F46d5c682Bf2f36306D461e3561C747" 
ERC721_CONTRACT_ADDRESS="0xFCE9b92eC11680898c7FE57C4dDCea83AeabA3ff"
MARKETPLACE_CONTRACT_ADDRESS="0x597C9bC3F00a4Df00F85E9334628f6cDf03A1184"
```
## Ejecución de la API

Para ejecutar la API, utiliza el siguiente comando:

```sh
npm run dev
```

### Endpoints

## Mint de Tokens ERC20

Para realizar un mint de tokens ERC20, utiliza el siguiente formato en la solicitud:

Endpoint - POST

```sh
http://localhost:3000/api/transactions/mint-erc20
```

Payload request

```json
{
    "address": "address",
    "amount": "monto - ejemplo: 0.1"
}
```

## Mint de NFT ERC721

No es necesario enviar información en la solicitud para realizar un mint de NFT. La API tomará la cuenta de la llave privada especificada en la variable OWNER_PRIVATE_KEY del archivo .env como el owner del NFT.

Endpoint - POST

```sh
http://localhost:3000/api/transactions/mint-nft
```

### Realizar una oferta (Buyer/Bidder)

Para realizar una oferta, utiliza el siguiente formato en la solicitud:

Endpoint - POST

```sh
http://localhost:3000/api/transactions/make-offer
```
### NOTA: Es importante tener en cuenta que, aunque el objeto "auctionData" incluye los campos "nftContracAddress" y "ERC20CurrencyAddress", la API en realidad utiliza las variables de entorno configuradas previamente en el archivo .env . Se optó por desarrollar la API de esta manera para ofrecer flexibilidad en futuras modificaciones -en caso de que se requiera-. De esta forma, con cambios mínimos, el contrato inteligente Marketplace puede transaccionar cualquier Token ERC721 por Token ERC20.

Para realizar una oferta, utiliza el siguiente formato en la solicitud:

```json
{
    "auctionData": {
        "nftContracAddress": "dirección del contrato NFT",
        "ERC20CurrencyAddress": "dirección del contrato ERC20",
        "nftContractId": "ID del contrato NFT",
        "erc20CurrencyAmount": "0.1"
    }
}
```
### Listas las ofertas firmadas

Endpoint - GET

Para listar las ofertas firmadas puede ejecutar la siguiente solicitud. Recordar que estas firmas solo se almacenan en memoria. Pero de igual manera el owner ha dado permiso al Marketplace para transaccionar el item y el buyer ha autorizado al Marketplace para transaccionar los Tokens ERC20.

```sh
http://localhost:3000/api/transactions/list-of-signed
```

Para realizar una oferta, utiliza el siguiente formato en la solicitud:

### Aceptar una oferta (Owner/Seller)

Endpoint - POST

```sh
http://localhost:3000/api/transactions/accept-offer
```

Para realizar una oferta, utiliza el siguiente formato en la solicitud:

```json
{
    "auctionData": {
        "nftContracAddress": "dirección del contrato NFT",
        "ERC20CurrencyAddress": "dirección del contrato ERC20",
        "nftContractId": "ID del contrato NFT",
        "erc20CurrencyAmount": "0.1"
    }
}
```





