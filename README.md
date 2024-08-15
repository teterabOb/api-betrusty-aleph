# API para Autenticación y Obtención de Información

Esta API tiene la funcionalidad de manejar las autorizaciones de los usuarios a distintas aplicaciones, en este momento los servicios integrados son los siguientes:

1. Github
2. MercadoLibre (Argentina/Chile)
3. WorldCoin (WorldID)

# Cómo funciona el proceso de Autenticación

Para la utilización de la API se deben configurar las siguientes variables de entorno para la autenticación con `Github`.

```shell
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GITHUB_REDIRECT_URI=..."
```

*Nota: la redirect URI debe coincidir con alguna que esté configurada en `Github`*

1. El usuario es 