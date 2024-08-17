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

Como resultado obtenemos información relevante cómo:

1. `access_token`
2. `expires_in`
3. `refresh_token`
4. `refresh_token_expires_in`

Con el `access_token` ya podemos acceder a la información del usuario. Sin embargo hay una información que es bastante relevante, este es el `refresh_token`. Que lo utilizamos para no repetir todo el proceso nuevamente. 

*El `access_token` y el `refresh_token` debemos almacenarlos para luego refrescar el `access_token` para consultar la insformación del usuario sin necesidad de volver a realizar todo el proceso.*

*Nota: * Cada vez que se refresca el token se debe almacenar nuevamente `access_token` y `refresh_token`.

### Accediendo a la Información

Habiendo realizado los procesos anteriores ya podríamos acceder a la información del usuario. 

*Endpoint*

```shell
https://la-url-de-nuestra-api.com/github/user-info
```

*Ejemplo de solicitud*

```shell
curl -X GET "https://la-url-de-nuestra-api.com/github/user-info?access_token=YOUR_ACCESS_TOKEN"
```

# Despliegue

Para hacer un despliegue en el ambiente de producción, ejecuta el siguiente comando. Tomará las variables de entorno que tienes configuradas en el archivo `.env`

```shell
vercel deploy -e NODE_ENV=production --prod
```