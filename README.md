# CreacionesJoJo - 3D Cost Expert

Una calculadora de costos profesional y herramienta de gestión orientada a negocios de impresión 3D. Diseñada para ofrecer cotizaciones precisas, administrar inventario de forma reactiva y generar documentos PDF personalizados.

## 🚀 Características Principales

*   **Calculadora de Costos (Cotización 3D):** Estima de forma dinámica el precio final de venta basado en el tiempo de impresión, peso de la pieza y los costos operativos fijos, aplicando automáticamente los impuestos y márgenes de ganancia configurados.
*   **Comentarios Adicionales con Markdown:** Campo de texto en la sección de cotización que permite agregar notas, instrucciones especiales o condiciones de entrega utilizando sintaxis Markdown. Incluye un editor y una pestaña de vista previa en tiempo real. El contenido aparece renderizado en el PDF exportado, debajo de los detalles del material.
*   **Exportación a PDF personalizada:** Genera un documento de cotización profesional con los datos del negocio, detalles del material, comentarios adicionales, desglose de costos y total final. El encabezado del PDF (título del documento, nombre del negocio y lema) es completamente configurable desde la sección de Ajustes.
*   **Gestión de Filamentos:** Sistema de inventario (CRUD) para administrar bobinas de material (PLA, ABS, PETG, etc.). Los datos se persisten en el navegador mediante `localStorage`.
*   **Costos de Operación:** Configuración global de gastos base por hora (energía, depreciación de máquinas, mano de obra, postprocesado y empaquetado) que se aplican automáticamente a cada cotización.
*   **Ajustes del Negocio:** Panel de configuración persistente que permite personalizar el nombre del negocio, el subtítulo/lema, el título del documento PDF de cotización y el símbolo de moneda utilizado en toda la interfaz.
*   **Modo Oscuro / Claro:** Alternancia de tema con persistencia en `localStorage` y respeto a la preferencia del sistema operativo.

## 🛠 Tecnologías Utilizadas

Esta herramienta es un SPA (Single Page Application) ligero que no requiere procesos de build complejos:

*   **Vue.js 3 (CDN):** Manejo de estado reactivo y vinculación de datos en tiempo real.
*   **Tailwind CSS (CDN):** Estilización moderna y responsiva basada en clases de utilidad y variables CSS personalizadas.
*   **marked.js (CDN):** Parser de Markdown para renderizar los comentarios adicionales tanto en la vista previa de la interfaz como en el PDF exportado.
*   **LocalStorage:** Persistencia del lado del cliente para el inventario de filamentos, costos de operación y ajustes del negocio. No requiere backend ni base de datos.
*   **Material Symbols:** Iconografía provista por Google Fonts.

## 🏃‍♂️ Cómo Ejecutar (How To)

No se requiere instalación de paquetes (`npm`). Puedes servir el proyecto directamente desde la raíz usando cualquier servidor HTTP local.

### Usando Make
Si tienes `make` instalado, simplemente ejecuta:
```bash
make run
```


## 📋 Roadmap (Próximas Mejoras)
- [x] Generación de documento PDF para cotizaciones.
- [x] Consolidar variables operativas y guardarlas persistentemente.
- [x] Campo de comentarios adicionales con soporte Markdown en la cotización.
- [x] Título del documento PDF configurable desde Ajustes.
- [ ] Gráfico de historial de tendencias de costos (Cost Variation Trends).