# Demo Plomería

Demo estática para GitHub Pages. Abrir `index.html` mediante un servidor HTTP local (por ejemplo, `python3 -m http.server 8000`). Las rutas de recursos son relativas y compatibles con el subdirectorio del repositorio.

La demo acepta `?e=` (nombre del negocio), `?n=` (alternativa si no hay `e`) y `?t=` (teléfono argentino). El nombre se inserta como texto; el teléfono se valida en `site-security.js`. Un teléfono inválido desactiva el contacto. En mobile las llamadas a la acción usan WhatsApp. En escritorio el formulario es una simulación local: no almacena ni envía datos. El número predeterminado se heredó de la versión anterior y debe confirmarse antes de usar la demo como web final.

Las imágenes `plomero-*.webp` y `servicio-*.webp` fueron generadas para esta demo y son ilustrativas; no documentan trabajos de un negocio real. Se conservan las imágenes previas del repositorio. No se agregaron dependencias ni servicios externos. El sitio mantiene `noindex, nofollow` como demostración; la directiva no restringe el acceso.
