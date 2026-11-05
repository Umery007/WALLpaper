import { useState } from "react";
import { FiMonitor, FiSend, FiSmartphone } from "react-icons/fi";
import {
  FormatOption,
  FormatToggle,
  PromptBar,
  PromptInput,
  PromptSide,
  SubmitButton,
} from "./styles";

// 9:16 = tela do celular (vertical); 16:9 = tela do computador (horizontal).
const FORMATOS = [
  { valor: "9:16", Icone: FiSmartphone, rotulo: "Celular 9:16" },
  { valor: "16:9", Icone: FiMonitor, rotulo: "Desktop 16:9" },
];

export default function Prompt({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Crie seu wallpaper",
  disabled = false,
}) {
  const [formato, setFormato] = useState("9:16");

  return (
    <PromptBar onSubmit={(event) => onSubmit(event, formato)} aria-busy={disabled}>
      <PromptInput
        aria-label={placeholder}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={1000}
        disabled={disabled}
      />

      <PromptSide>
        <FormatToggle role="group" aria-label="Formato do wallpaper">
          {FORMATOS.map(({ valor, Icone, rotulo }) => (
            <FormatOption
              key={valor}
              type="button"
              $ativo={formato === valor}
              aria-pressed={formato === valor}
              aria-label={rotulo}
              title={rotulo}
              disabled={disabled}
              onClick={() => setFormato(valor)}
            >
              <Icone />
            </FormatOption>
          ))}
        </FormatToggle>

        <SubmitButton type="submit" aria-label="Enviar prompt" title="Enviar" disabled={disabled || !value.trim()}>
          <FiSend />
        </SubmitButton>
      </PromptSide>
    </PromptBar>
  );
}
