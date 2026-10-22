"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, mensagemDeErro } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Evento } from "@/app/types/evento";

interface Resultado {
  eventoId: number;
  evento: Evento | null;
  erro: string | null;
}

// Carrega o evento da URL e garante a regra de posse: só o organizador dono gerencia
// palestrantes e inscrições. Quem não é dono volta para /eventos.
export function useEventoDoOrganizador(eventoId: number | null, acao: string) {
  const router = useRouter();
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    if (!eventoId) return;
    let ativo = true;

    api
      .get<Evento>(`/eventos/${eventoId}`)
      .then((resposta) => {
        if (!ativo) return;
        if (resposta.data.organizador?.id !== getOrganizadorLogado()?.id) {
          alert(`Você só pode ${acao} em eventos organizados por você.`);
          router.push("/eventos");
          return;
        }
        setResultado({ eventoId, evento: resposta.data, erro: null });
      })
      .catch((error) => {
        if (ativo) {
          setResultado({
            eventoId,
            evento: null,
            erro: mensagemDeErro(error, "Não foi possível carregar o evento."),
          });
        }
      });

    return () => {
      ativo = false;
    };
  }, [eventoId, acao, router]);

  // Ignora o resultado de um evento anterior enquanto o novo ainda carrega
  const atual = eventoId && resultado?.eventoId === eventoId ? resultado : null;

  return {
    evento: atual?.evento ?? null,
    erro: atual?.erro ?? null,
    carregando: Boolean(eventoId) && !atual,
  };
}
