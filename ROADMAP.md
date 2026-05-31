# 🗺️ Roadmap — VeraVision

Hoja de ruta del prototipo. Marca tu tarea, trabaja en una rama y abre un PR.

**Visión:** que VeraVision deje de parecer un editor genérico y se sienta como un producto
**2026, vivo y delicioso de usar** — un panel de retención de clientes para ópticas, sustentable
con IBM Carbon y principios de HCI, que la gerente y las asesoras **amen** abrir todos los días.

## Reglas del juego

- Es **prototipo visual** (sin backend/BD). Los estados de datos se **simulan**.
- **Código que sí sirve:** todo PR pasa `npm run typecheck` y `npm run lint`.
- Reutiliza componentes (`components/primitives`, `state/app-context`) antes de crear nuevos.
- Justifica decisiones de UI con **Carbon + HCI** (flujo, affordance, feedback, accesibilidad).
- Una rama por tarea (`feat/...`, `fix/...`). PRs pequeños y enfocados.

---

## ✅ Hecho (corte actual)

### Fase 0 — Higiene y base

- [x] MCP **code-review-graph** instalado y configurado (ver README).
- [x] `package.json` y `README.md` actualizados a VeraVision.
- [ ] Subir este `ROADMAP.md` (PR pendiente).

### Fase 1 — Los 4 estados de UI

- [x] Primitivas `EmptyState`, `LoadingState`/`SkeletonBox`, `ErrorState`.
- [x] Demo de estados en **Clientes** (control HCI).

### Fase 3 — Roles, sesión y sedes

- [x] **Login** con las personas reales: Marlen (gerente), Francia y Alejandra (asesoras).
- [x] **Logout** (vuelve al login) y estado de sesión global (`VVProvider`).
- [x] **Sedes que cambian los datos**: CD Centrochía, CD Tocancipá y **"Todas las sedes"** (gerente).
- [x] **Asesoras bloqueadas a su sede**; la gerente las **asigna** desde el panel **Empleados**.

### Extras de pulido ya hechos

- [x] Modo oscuro legible · acento de color configurable · foco visible (a11y).
- [x] **Búsqueda global** de clientes · **panel de notificaciones** con cierre (X).
- [x] **Calendario** (sin fechas pasadas, navegable por meses) · **buscador de cliente** con lupa.
- [x] **Colores semánticos**: segmentos verde/amarillo/rojo · canal WhatsApp verde / Email azul.
- [x] **Vista previa del mensaje** cambia de tono según el canal · emojis en recordatorios.
- [x] **Avatares de cliente con color** (determinístico por cliente).
- [x] Pantallas **Configuración** y **Ayuda** con contenido real · botones del modal centrados.

---

## ⏸️ Fase 2 — Carbon "de verdad" (EN PAUSA, no tocar hasta nueva orden)

> Decisión del equipo. La UI ya usa tokens `--cds-*` y la clase de tema real de Carbon.

- [ ] Migrar primitivas a `@carbon/react` (Button, DataTable, Modal, Tabs, TextInput, Tag, Tile…).
- [ ] `@carbon/charts-react` para reemplazar las gráficas SVG hechas a mano.

---

## 🚀 Backlog con visión (hay HARTO por hacer)

### A. Experiencia y "wow" (HCI / UI 2026)

- [ ] Micro-animaciones y transiciones consistentes (entrada de cards, hover, press).
- [ ] Onboarding/tour la primera vez que entra cada rol.
- [ ] Estados vacíos ilustrados en **todas** las pantallas (hoy solo Clientes).
- [ ] Modo compacto/cómodo (densidad de tabla) configurable.
- [ ] Responsive real para pantallas pequeñas (la óptica podría usar portátil chico).
- [ ] Command palette (Ctrl/Cmd+K) que ya use el buscador global.
- [ ] Tema de marca Opticalia (paleta propia) además del acento.

### B. Clientes (CRUD y ficha)

- [ ] Crear / editar / archivar cliente (formulario completo).
- [ ] Importar clientes desde CSV/Excel (con preview y validación).
- [ ] Ficha de cliente enriquecida: historial de compras, fórmula médica, fotos de montura.
- [ ] Filtros avanzados (por monto, última visita, producto, canal preferido).
- [ ] Etiquetas/segmentos personalizados por la gerente.

### C. Recordatorios y mensajería

- [ ] Editor de **plantillas** de mensaje por tipo y canal (con variables).
- [ ] Programación real (fecha/hora) y cola de envíos con su línea de tiempo.
- [ ] Vista de calendario mensual de recordatorios.
- [ ] Reglas automáticas ("si lleva 11 meses sin venir → control anual").
- [ ] Simulación de respuestas del cliente para la demo.

### D. Panel de la gerente

- [ ] Comparativa entre sedes (Centrochía vs Tocancipá) lado a lado.
- [ ] Metas por asesora y tablero de desempeño.
- [ ] Permisos granulares por rol (qué ve/edita cada quien).
- [ ] Bitácora/auditoría de acciones.
- [ ] Gestión de empleados: invitar, desactivar, cambiar rol.

### E. Datos, reportes y analítica

- [ ] Exportar a CSV/PDF real (dashboard, clientes, historial).
- [ ] KPIs con rango de fechas y comparación mes a mes.
- [ ] Gráfica de embudo de retención (activo → riesgo → perdido → recuperado).
- [ ] Predicción simple de "probabilidad de no volver".

### F. Plataforma y calidad

- [ ] Persistencia local (la sesión/sede/acento sobreviven al reinicio).
- [ ] Backend real opcional + sincronización (cuando deje de ser prototipo).
- [ ] Integración real WhatsApp/Email (Twilio/Meta API) — fuera del alcance actual.
- [ ] **Tests** (unitarios + e2e con Playwright) y CI que corra typecheck/lint/test.
- [ ] **Auditoría de accesibilidad** (teclado, lectores de pantalla, contraste AA).
- [ ] Internacionalización (es/en) y formato de moneda/fecha por configuración.
- [ ] Telemetría de uso (opt-in) para mejorar la UX.

---

## Sugerencia de reparto (5 personas)

| Persona | Frente sugerido                            |
| ------- | ------------------------------------------ |
| 1       | A. Experiencia/animaciones + responsive    |
| 2       | B. Clientes (CRUD + import)                |
| 3       | C. Recordatorios (plantillas + calendario) |
| 4       | D/E. Panel gerente + reportes/exportar     |
| 5       | F. Calidad: tests, a11y, persistencia      |

## Definición de "Listo" (DoD)

1. `npm run typecheck` ✅ y `npm run lint` sin errores.
2. Corre en `npm run dev` sin warnings nuevos de consola.
3. Respeta tokens/grilla de Carbon (sin hex nuevos salvo el shell oscuro).
4. Si toca datos, contempla los 4 estados donde aplique.
5. PR con descripción que justifica la decisión de UI/HCI.
