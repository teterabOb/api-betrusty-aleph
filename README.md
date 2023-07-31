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

Endpoint - GET

```sh
http://localhost:3000/api/transactions/mint-erc20
```

Payload request

```json
{
    "address": "0x1c71Ce6C4d052723010a0C7320DE890fDc1622b6",
    "amount": "10"
}
```




