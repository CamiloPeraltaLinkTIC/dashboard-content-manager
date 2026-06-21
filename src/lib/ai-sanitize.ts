/**
 * Bloqueo del término "testigos digitales" en las salidas de IA.
 *
 * - `NO_TESTIGOS_DIGITALES_RULE`: regla para inyectar en los prompts.
 * - `sanitizeAiText`: red de seguridad que reemplaza cualquier variante
 *   ("testigo digital", "testigos digitales", con mayúsculas o saltos) por el
 *   término institucional correcto "testigos electorales".
 * - `createStreamSanitizer`: versión para streaming que retiene una cola para
 *   no cortar la frase entre fragmentos.
 */

export const NO_TESTIGOS_DIGITALES_RULE =
  'Nunca uses el término "testigos digitales" ni "testigo digital". Si te refieres a observadores del proceso electoral, di "testigos electorales".';

// "testigo digital" / "testigos digitales" (cualquier espacio/salto, sin importar mayúsculas).
const FORBIDDEN = /testigos?\s+digital(?:es)?/gi;

/** Longitud máxima de una coincidencia (para el buffer de streaming). */
export const MAX_FORBIDDEN_LEN = 20;

function replacement(match: string): string {
  const singular = /^testigo\s/i.test(match);
  const base = singular ? "testigo electoral" : "testigos electorales";
  // Preserva la mayúscula inicial del original.
  return match[0] === match[0].toUpperCase()
    ? base.charAt(0).toUpperCase() + base.slice(1)
    : base;
}

export function sanitizeAiText(text: string): string {
  return text.replace(FORBIDDEN, replacement);
}

/**
 * Saneador incremental para respuestas en streaming. `push` devuelve el texto
 * seguro para emitir hasta ahora (reteniendo la cola que aún podría formar la
 * frase prohibida); `flush` devuelve el resto al terminar.
 */
export function createStreamSanitizer() {
  let raw = "";
  let emitted = 0;
  const HOLD = MAX_FORBIDDEN_LEN + 4;

  return {
    push(delta: string): string {
      raw += delta;
      const clean = sanitizeAiText(raw);
      const safe = Math.max(0, clean.length - HOLD);
      if (safe > emitted) {
        const out = clean.slice(emitted, safe);
        emitted = safe;
        return out;
      }
      return "";
    },
    flush(): string {
      const clean = sanitizeAiText(raw);
      if (clean.length > emitted) {
        const out = clean.slice(emitted);
        emitted = clean.length;
        return out;
      }
      return "";
    },
  };
}
