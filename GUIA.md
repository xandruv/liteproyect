# LiteProyect – Guía de puesta en marcha

Esta carpeta contiene la app LiteProyect como **PWA**: una app web instalable que funciona sin conexión y guarda los datos en **tu cuenta de Google** mediante Firebase. Si cambias de móvil, instalas la app, inicias sesión con la misma cuenta y tienes todos tus datos.

Tiempo estimado: 20–30 minutos, una sola vez. Coste: 0 €. El plan gratuito de Firebase (Spark) no pide tarjeta y nunca genera facturas.

## Contenido de la carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa |
| `firebase-config.js` | **Lo tienes que editar** con los datos de tu proyecto de Firebase (paso 3) |
| `firestore.rules` | Reglas de seguridad de la base de datos (paso 4) |
| `sw.js` | Permite que la app funcione sin conexión |
| `manifest.webmanifest` e `icons/` | Hacen la app instalable, con su nombre e icono |
| `GUIA.md` | Esta guía |

---

## 1. Crear el proyecto de Firebase

1. Entra en <https://console.firebase.google.com> con tu cuenta de Google.
2. Pulsa **Crear un proyecto** (o *Añadir proyecto*) y ponle un nombre, por ejemplo `liteproyect`.
3. Cuando pregunte por Google Analytics, puedes **desactivarlo**: no hace falta.
4. Espera a que se cree y pulsa **Continuar**.

## 2. Activar el inicio de sesión con Google

1. En el menú izquierdo: **Compilación › Authentication** (o *Seguridad › Authentication*) › **Comenzar**.
2. En la pestaña **Método de acceso**, elige **Google**.
3. Actívalo, selecciona tu correo como *correo de asistencia* y pulsa **Guardar**.

## 3. Registrar la app web y copiar la configuración

1. En la página principal del proyecto (icono de la casa), pulsa el icono **`</>`** (*Web*).
2. Ponle un apodo, por ejemplo `LiteProyect`. **No** marques Firebase Hosting. Pulsa **Registrar app**.
3. Firebase te mostrará un bloque de código con `const firebaseConfig = { ... }`. Copia solo los valores que van entre llaves.
4. Abre `firebase-config.js` con cualquier editor de texto (el Bloc de notas sirve) y sustituye los valores de ejemplo por los tuyos. Debe quedar así, con tus datos:

```js
export const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "liteproyect-xxxx.firebaseapp.com",
  projectId: "liteproyect-xxxx",
  storageBucket: "liteproyect-xxxx.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

> Estos datos no son secretos: identifican tu proyecto, pero no dan acceso a tus datos. Lo que protege la información son las reglas del paso 4 y el inicio de sesión con tu cuenta.

## 4. Crear la base de datos y sus reglas

1. Menú izquierdo: **Compilación › Firestore Database** › **Crear base de datos**.
2. Edición: **Standard**, si te lo pregunta.
3. Ubicación: **europe-southwest1 (Madrid)** o cualquier otra de Europa. No se puede cambiar después.
4. Elige **Iniciar en modo de producción** y pulsa **Crear**.
5. Ve a la pestaña **Reglas**, borra lo que haya, pega el contenido del archivo `firestore.rules` y pulsa **Publicar**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Con estas reglas, cada persona que inicie sesión solo puede ver y modificar sus propios datos.

**Opcional (recomendado): que solo tú puedas usarla.** Si quieres que nadie más pueda iniciar sesión y guardar datos en tu Firebase, cambia la línea `allow` por esta, con tu correo:

```
allow read, write: if request.auth != null && request.auth.uid == uid && request.auth.token.email == "tu_correo@gmail.com";
```

## 5. Publicar la app en internet (GitHub Pages, gratis)

La app necesita una dirección web con HTTPS para poder instalarse. No necesita servidor: basta con subir los archivos.

1. Crea una cuenta gratuita en <https://github.com> si no la tienes.
2. Pulsa **+ › New repository**:
   - Nombre: `liteproyect`.
   - Visibilidad: **Public**. GitHub Pages es gratis en repositorios públicos. El código de la app será visible, pero **tus datos no**, porque están en Firebase protegidos por tu cuenta.
   - Pulsa **Create repository**.
3. En el repositorio vacío, pulsa **uploading an existing file** y **arrastra todo el contenido de esta carpeta**: `index.html`, `firebase-config.js` (ya editado), `sw.js`, `manifest.webmanifest`, `firestore.rules`, `GUIA.md` y la carpeta `icons`. Pulsa **Commit changes**.
4. Ve a **Settings › Pages**. En *Build and deployment*, elige **Source: Deploy from a branch**, **Branch: main** y **/ (root)**. Pulsa **Save**.
5. Al cabo de uno o dos minutos aparecerá la dirección de tu app, del tipo `https://TU_USUARIO.github.io/liteproyect/`.
6. **Autoriza ese dominio en Firebase:** vuelve a Firebase › **Authentication › Configuración › Dominios autorizados** › **Agregar dominio**, escribe `TU_USUARIO.github.io` (sin `https://` y sin `/liteproyect`) y guarda.

> Alternativas igual de válidas: **Cloudflare Pages** o **Netlify** (arrastrando la carpeta en su web). En ese caso, autoriza en el paso 6 el dominio que te den.

## 6. Instalarla en el móvil Android

1. Abre la dirección de tu app en **Chrome** con conexión a internet.
2. Pulsa **Continuar con Google** e inicia sesión.
3. Menú **⋮ › Instalar aplicación** (o *Añadir a pantalla de inicio*).
4. Ya tienes el icono de LiteProyect. Se abre a pantalla completa, como una app normal.

En el ordenador puedes usarla igual desde Chrome o Edge. También se puede instalar con el icono de instalar de la barra de direcciones.

## 7. Pasar tus datos actuales a la nueva app

1. Abre la versión actual de LiteProyect (la publicada en Claude).
2. En la pantalla de inicio, abajo del todo: **Copia de seguridad › Exportar todo (.json)**.
3. Abre la nueva app, inicia sesión y en la pantalla de inicio pulsa **Importar copia**. Elige el archivo descargado.
4. Tus proyectos aparecerán y se subirán a tu cuenta.

---

## Uso diario

- **Sin conexión:** la app funciona igual. Todo se guarda en el móvil y, cuando vuelve la conexión, se sube solo. El indicador de arriba muestra *Sincronizado*, *Sincronizando…* o *Sin conexión*.
- **Cambiar de móvil:** instala la app en el nuevo (paso 6) e inicia sesión con la misma cuenta. Aparece todo.
- **Varios dispositivos:** los cambios se ven en todos casi al instante.
- **Antes de cerrar sesión o desinstalar**, comprueba que el indicador ponga *Sincronizado*. Si no, los cambios aún no subidos se perderían.
- **Copia extra:** de vez en cuando puedes usar *Exportar todo (.json)* y guardar el archivo en tu Drive. Es opcional.

## Actualizar la app en el futuro

Cuando haya una versión nueva de `index.html`:
1. Súbela al repositorio de GitHub, sustituyendo la anterior.
2. Abre `sw.js` y cambia el número de `VERSION` (por ejemplo, de `liteproyect-v1` a `liteproyect-v2`). Súbelo también.
3. Los móviles reciben la versión nueva la siguiente vez que abran la app con conexión. Puede hacer falta abrirla dos veces.

## Límites del plan gratuito

Firestore gratis incluye 1 GiB de datos y 50.000 lecturas y 20.000 escrituras al día. Para uso personal sobra con mucho. Si alguna vez se superase (muy improbable), la sincronización se pausaría hasta el día siguiente, sin cobros ni pérdida de datos en el móvil.

## Problemas frecuentes

| Mensaje | Solución |
|---|---|
| *Falta conectar la app con tu proyecto de Firebase* | `firebase-config.js` sigue con los valores de ejemplo (paso 3). |
| *Este dominio no está autorizado en Firebase* | Añade el dominio en *Dominios autorizados* (paso 5.6). |
| *El inicio de sesión con Google no está activado* | Paso 2. |
| *Firebase ha denegado el acceso* o *Sin permiso para guardar* | Revisa las reglas (paso 4). Si usas la versión con tu correo, comprueba que esté bien escrito. |
| No aparece la opción de instalar | Ábrela con Chrome y en la dirección `https://`. Espera unos segundos tras cargar. |
