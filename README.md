### Prerequisites

Instalar las dependencias

* npm
  ```sh
  npm install npm@latest -g
  ```

  Configurar las variables de entorno que utiliza la API, si estas variables no se setean correctamente, las funcionalidades no se ejecutarán de manera satisfactoria.

  Debes crear un archivo cuyo nombre sea .env. Dentro de este archivo debes copiar las variables que están en el recuadro inferior. 

* .env
  ```sh
OWNER_PRIVATE_KEY="..."
BIDDER_PRIVATE_KEY="..."
RPC_ENDPOINT="..."
ERC20_CONTRACT_ADDRESS="0xbd65c58D6F46d5c682Bf2f36306D461e3561C747" 
ERC721_CONTRACT_ADDRESS="0xFCE9b92eC11680898c7FE57C4dDCea83AeabA3ff"
MARKETPLACE_CONTRACT_ADDRESS="0x597C9bC3F00a4Df00F85E9334628f6cDf03A1184"
  ```