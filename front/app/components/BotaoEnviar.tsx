"use client";

import { useFormStatus } from "react-dom";

interface BotaoEnviarProps {
  texto: string;
  textoEnviando: string;
  className: string;
  desabilitado?: boolean;
}

// O estado de envio de um <form action={...}> só pode ser lido em um componente filho do form
export default function BotaoEnviar({ texto, textoEnviando, className, desabilitado = false }: BotaoEnviarProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending || desabilitado} className={className}>
      {pending ? textoEnviando : texto}
    </button>
  );
}
