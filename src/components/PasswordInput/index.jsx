import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as S from "./styles";

export default function PasswordInput({ Input = "input", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <S.Field>
      <Input
        {...props}
        type={visible ? "text" : "password"}
        style={{ ...props.style, paddingRight: 52 }}
      />
      <S.Toggle
        type="button"
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </S.Toggle>
    </S.Field>
  );
}
