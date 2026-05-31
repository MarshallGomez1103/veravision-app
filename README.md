# VeraVision · Opticalia

Prototipo **front-end de escritorio** para la óptica Opticalia: un panel de gestión que
ayuda a **retener clientes** (segmenta clientes, muestra KPIs y genera recordatorios de
control visual, cumpleaños y post-venta). Construido con **Electron + React + TypeScript**
y el sistema de diseño **IBM Carbon**. Es un prototipo visual con datos de ejemplo.

> Proyecto colaborativo de Interacción Persona-Computadora. Plan de trabajo en [ROADMAP.md](./ROADMAP.md).

## Requisitos

- **Node.js** ≥ 18 (probado con v20).
- **npm** (incluido con Node).
- Python 3.10+ **solo** si vas a usar el MCP `code-review-graph` (ver abajo).

## Iniciar la app (lo básico)

```bash
npm install        # instala dependencias (la 1ª vez baja Electron; tarda)
npm run dev        # abre la app de escritorio con recarga en caliente
```

Eso es todo para verla funcionar. 👇 El resto es opcional/avanzado.

## Verificar antes de subir cambios

```bash
npm run typecheck  # OBLIGATORIO antes de push (hook de Husky lo exige)
npm run lint
npm run format
```

## Build (empaquetar)

```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

---

## 🧠 code-review-graph (MCP)

Este repo está configurado para usar **[code-review-graph](https://github.com/tirth8205/code-review-graph)**
(CRG): un MCP que construye un **grafo del código** para que los agentes de IA (Claude Code,
Cursor, etc.) exploren con menos tokens y mejor contexto. El `CLAUDE.md` pide usarlo antes
que Grep/Read. El config del MCP ya está en `.mcp.json`.

### Setup (una vez por máquina)

```bash
pip install code-review-graph                       # requiere Python 3.10+
code-review-graph install --platform claude-code    # registra el MCP en este repo
code-review-graph build                             # indexa el código (crea el grafo)
```

Luego **reinicia Claude Code** para que cargue el MCP (aprobarás el servidor del proyecto).
Para actualizar el grafo tras cambios: `code-review-graph update`.

> En Windows, si el comando `code-review-graph` no está en el PATH, úsalo como
> `python -m code_review_graph <subcomando>`.

### Activarlo en Claude Code

Tras el setup, abre Claude Code en este repo y ejecuta el comando **`/mcp`**: ahí verás el
servidor `code-review-graph`. **Apruébalo** (los MCP de proyecto, definidos en `.mcp.json`,
no se cargan hasta que el usuario los aprueba). Si no aparece, reinicia Claude Code y repite.

### ⚠️ Por qué `.mcp.json` NO es portable entre máquinas (importante)

Cuando corres `code-review-graph install`, el `.mcp.json` se genera apuntando al **Python de
TU equipo con una ruta absoluta**, por ejemplo:

```json
{
  "mcpServers": {
    "code-review-graph": {
      "command": "C:\\Users\\TU_USUARIO\\AppData\\Local\\Python\\...\\python.exe",
      "args": ["-m", "code_review_graph", "serve"],
      "cwd": "C:\\ruta\\a\\veravision-app",
      "type": "stdio"
    }
  }
}
```

Esa ruta (`C:\Users\TU_USUARIO\...`) **solo existe en esa máquina**. Si ese archivo se sube al
repo, a los demás **no les va a funcionar** porque su Python está en otra ruta. Por eso:

**Opción recomendada (cada quien genera el suyo):**

1. Añade `.mcp.json` y `.claude/` a `.gitignore` (no los subas).
2. Cada integrante hace una vez:
   ```bash
   pip install code-review-graph
   code-review-graph install --platform claude-code   # genera SU propio .mcp.json
   code-review-graph build
   ```
3. Luego `/mcp` en Claude Code y aprobar.

**Opción alternativa (config portable a mano):** editar `.mcp.json` para usar un comando que
no dependa de la ruta, p. ej. `"command": "code-review-graph"` (si el ejecutable quedó en el
PATH) o `"command": "python"` con `"args": ["-m", "code_review_graph", "serve"]`. Funciona solo
si en todas las máquinas `code-review-graph`/`python` resuelven a la versión correcta — por eso
la opción recomendada es la de arriba.

### Estado actual del grafo (esta máquina)

`69 nodos · 482 edges · 18 archivos` (typescript/tsx). Verifica con `code-review-graph status`.
