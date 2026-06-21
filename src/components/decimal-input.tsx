"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * Campo numérico que SÍ deja escribir decimales.
 *
 * Un <input type="number"> controlado por un número reparsea en cada tecla y
 * descarta el punto intermedio ("63." → 63), impidiendo teclear decimales. Aquí
 * mantenemos el texto crudo mientras se edita y emitimos el número con onChange.
 */
export function DecimalInput({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: number;
  onChange: (n: number) => void;
  className?: string;
  placeholder?: string;
}) {
  const [text, setText] = useState<string>(value == null ? "" : String(value));

  // Si el valor externo cambia (p. ej. al cambiar de país/registro) y no
  // coincide con lo que se está escribiendo, sincroniza el texto mostrado.
  useEffect(() => {
    const parsed = parseFloat(text);
    const sameNumber = !Number.isNaN(parsed) && parsed === value;
    const bothEmptyZero = text.trim() === "" && (value === 0 || value == null);
    if (!sameNumber && !bothEmptyZero) {
      setText(value == null ? "" : String(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={text}
      placeholder={placeholder}
      className={className}
      onChange={(e) => {
        const t = e.target.value;
        // Permite vacío, dígitos y un único punto decimal.
        if (!/^\d*\.?\d*$/.test(t)) return;
        setText(t);
        const n = parseFloat(t);
        onChange(Number.isNaN(n) ? 0 : n);
      }}
    />
  );
}
