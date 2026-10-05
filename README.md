# Áurea — Estudio digital

Sitio web moderno, claro y minimalista para un negocio/estudio digital. Contenido en español, construido con HTML, CSS y JavaScript puros (sin dependencias ni build).

## Características

- Diseño editorial claro con paleta cálida (terracota, crema, tinta) y tipografía serif/sans (Instrument Serif + Inter).
- Hero con imagen generada, chips flotantes y marquee de clientes.
- Servicios, trabajos destacados, banda de estadísticas con contadores animados, proceso, testimonios, FAQ con acordeón, CTA y formulario de contacto con validación.
- Animaciones de aparición al hacer scroll (IntersectionObserver), menú móvil con overlay, resaltado de sección activa.
- Accesible: navegación por teclado, `prefers-reduced-motion`, skip-link y ARIA.
- Totalmente responsive.

## Estructura

```
├── index.html      # Página principal
├── styles.css      # Sistema de diseño y estilos
├── script.js       # Interacciones
└── images/         # Imágenes generadas (hero y proyectos)
```

## Ver en local

Cualquier servidor estático sirve:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```
