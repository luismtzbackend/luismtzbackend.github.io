# assets/

Coloca aquí los siguientes archivos antes de desplegar:

| Archivo                  | Descripción                                                   |
|--------------------------|---------------------------------------------------------------|
| `cv-luis-martinez.pdf`   | Tu currículum en PDF (el botón "Descargar CV" lo referencia) |
| `og-image.png`           | Imagen para Open Graph / redes sociales (1200×630 px)        |
| `favicon.ico`            | Favicon del sitio (opcional pero recomendado)                |

## Pasos para activar el formulario de contacto

1. Regístrate en [https://formspree.io](https://formspree.io) (plan gratuito disponible).
2. Crea un nuevo formulario y copia el ID (ej. `xabcdefg`).
3. En `index.html`, reemplaza `https://formspree.io/f/tu-id` con tu URL real:
   ```
   action="https://formspree.io/f/xabcdefg"
   ```

## Despliegue en GitHub Pages

1. Sube todo el proyecto a un repositorio público de GitHub.
2. Ve a **Settings → Pages → Source: Deploy from branch → main → / (root)**.
3. GitHub Pages publicará el sitio en `https://<tu-usuario>.github.io/<repo>/`.
4. El dominio personalizado se configura en Settings → Pages → Custom domain.



muchas gracias.
