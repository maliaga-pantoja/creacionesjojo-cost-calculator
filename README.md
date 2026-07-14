# CreacionesJoJo - 3D Cost Expert

Una calculadora de costos profesional y herramienta de gestión orientada a negocios de impresión 3D. Diseñada para ofrecer cotizaciones precisas y administrar inventario de forma reactiva y elegante.

## 🚀 Características Principales

*   **Calculadora de Costos (Cotización 3D):** Estima de forma dinámica el precio final de venta basado en el tiempo de impresión, peso de la pieza y los costos operativos fijos, aplicando automáticamente los impuestos y márgenes de ganancia. Además, permite exportar el resumen generado como PDF.
*   **Gestión de Filamentos:** Un sistema de inventario (CRUD) para administrar tus bobinas de material (PLA, ABS, PETG, etc.). Los datos se persisten en el navegador.
*   **Costos de Operación:** Configuración global de gastos base (energía, depreciación de máquinas, mano de obra, postprocesado y empaquetado) para calcular el costo real de producción por hora de forma automática en cada cotización.

## 🛠 Tecnologías Utilizadas

Esta herramienta es un SPA (Single Page Application) ligero y rápido que no requiere procesos de build complejos:
*   **Vue.js 3 (CDN):** Manejo de estado reactivo y vinculación de datos en tiempo real.
*   **Tailwind CSS (CDN):** Estilización moderna y responsiva basada en clases de utilidad y variables CSS customizadas ("Bento-style").
*   **LocalStorage:** Persistencia de datos del lado del cliente (inventario de filamentos y configuración de operación) sin necesidad de backend o base de datos.
*   **Material Symbols:** Iconografía proveída por Google Fonts.

## 🏃‍♂️ Cómo Ejecutar (How To)

No se requiere instalación de paquetes (`npm`). Puedes servir el proyecto directamente desde la raíz usando cualquier servidor HTTP local.

### Usando Make
Si tienes `make` instalado, simplemente ejecuta:
```bash
make run
```

### Otras alternativas
Si tienes Python instalado:
```bash
python -m http.server 8000
```
O usando Node (si tienes `http-server` global):
```bash
npx http-server .
```

Luego, abre `http://localhost:8000` o la URL que te provea el servidor en tu navegador web.

## 📋 Roadmap (Próximas Mejoras)
- [x] Generación de documento PDF para cotizaciones.
- [x] Consolidar variables operativas y guardarlas persistentemente.
- [ ] Gráfico de historial de tendencias de costos (Cost Variation Trends).