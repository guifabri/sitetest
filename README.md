# Fionas Chick

Landing page de un salon de belleza, hecha con HTML, CSS y JavaScript sin frameworks ni build.

## Correr el sitio

Abrilo con **Live Server** de VS Code: click derecho sobre `index.html` > *Open with Live Server*.

Es importante que lo abras por `http://localhost` y no con doble clic. Chrome bloquea la
geolocalizacion y los modulos ES en `file://`, asi que con doble clic el menu hamburguesa
y el clima no funcionan.

## API de clima

El sitio usa la Geolocation API del navegador para obtener la ubicacion y despues consulta
OpenWeatherMap para mostrar temperatura e icono en el header.

1. Copia `js/config.example.js` como `js/config.local.js`
2. Pega tu clave:

```js
export const OPENWEATHER_API_KEY = "tu-clave-aqui";
```

`config.local.js` esta en `.gitignore`, asi que la clave nunca se sube al repositorio.
Si el archivo no existe, el sitio sigue funcionando y muestra un selector de ciudades
en lugar de la temperatura.

Restringi tu clave por dominio en el panel de OpenWeatherMap
(*Settings* > *API keys* > *Allowed domains*). Asi solo tu sitio puede usarla.

## Musica de fondo

Hay un boton de musica en el header. El archivo `assets/audio/background-music.mp3`
**no se versiona** en Git por ser una grabacion con derechos de autor. Ponerlo ahi es
opcional: si no esta, el boton se oculta solo.

## Estructura

```
index.html
css/styles.css        5 capas: tokens, base, layout, components, utilities
js/
  main.js             importa e inicializa cada modulo
  config.js           clave vacia, versionada
  config.example.js   plantilla, versionada
  config.local.js     tu clave real, ignorada por git
  nav.js              menu hamburguesa
  audio.js            toggle de musica
  weather.js          geolocalizacion + OpenWeatherMap
  accordion.js        FAQ multi-open
  gallery.js          lightbox
  form.js             registro con localStorage
  reveal.js          animaciones al hacer scroll
assets/img/           imagenes optimizadas
images/               originales sin tocar
```

## Imagenes

Los originales pesan 2,8 MB. Las copias en `assets/img/` pesan 427 KB en total:

| Original | Optimizada | Peso |
|---|---|---|
| `logo.png` (1021 KB) | `logo.jpg` recortada al contenido | 21 KB |
| `hero.png` (1519 KB) | `hero-720.jpg` / `hero-1100.jpg` con `srcset` | 65 / 117 KB |
| 8 archivos `.webp` | renombrados a ASCII | sin recomprimir |

Se renombraron a ASCII porque los acentos en los nombres exigen URL-encoding y fallan de
forma inconsistente entre servidores. Los originales no se modifican.

## Decisiones

- **Colores**: los rosados claros no llegan a 4,5:1 de contraste sobre blanco, asi que se usan
  para superficies. `#8e2f4f` y `#4a2130` cubren texto y botones.
- **Hero**: imagen cuadrada en un panel de proportion 1:1, no de fondo full-bleed, para
  no recortarla en pantallas anchas.
- **Accordion**: multi-open. Se anima con `grid-template-rows: 0fr -> 1fr` en vez de
  `max-height` para no adivinar la altura.
- **Revelado al hacer scroll**: usa `IntersectionObserver`. Sin JS el contenido es visible.
- **Audio**: `preload="none"`, asi que no descarga un solo byte hasta el primer click.
