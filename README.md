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

*Nota: la redirect URI debe coincidir con alguna que esté configurada en `Github` de otra manera fallará la solicitud*

### Pasos para la Autenticación

1. El usuario da click y es redireccionado a la siguiente URL. Lo que sucede aquí es que el front-end o aplicación que vaya a consumir esta API debe pegarle al siguiente endpoint. Y este se encargará de redireccionar a la URL para que el usuario otorgue los permisos.

URL

```shell
https://github.com/login/oauth/authorize?client_id=GITHUB_CLIENT_ID&redirect_uri=GITHUB_REDIRECT_URI
```

Endpoint

```shell
https://la-url-de-nuestra-api.com/github
```

2. En `github` hemos configurado la `callback URL` para el siguiente endpoint

```shell
https://la-url-de-nuestra-api.com/github/callback
```

Este callback realiza una solicitud `POST` al siguiente endpoint de `github`

```shell
https://github.com/login/oauth/access_token
```