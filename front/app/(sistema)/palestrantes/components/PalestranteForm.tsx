"use client";

import AvisoErro from "@/app/components/AvisoErro";
import BotaoEnviar from "@/app/components/BotaoEnviar";
import SeletorEvento from "@/app/components/SeletorEvento";
import { mensagemDeErro } from "@/app/services/api";
import { atualizarPalestrante, salvarPalestrante } from "@/app/services/palestranteService";
import { Palestrante, PalestranteFormProps } from "@/app/types/palestrante";
import {
  CLASSE_BOTAO_PRIMARIO,
  CLASSE_BOTAO_SECUNDARIO,
  CLASSE_CAMPO,
  CLASSE_ERRO_CAMPO,
  CLASSE_LABEL,
  CLASSE_RODAPE_FORM,
} from "@/app/utils/estilos";
import { cpfValido, mascararCpf } from "@/app/utils/formatacao";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PalestranteForm({ palestranteExistente, eventoIdPredefinido }: PalestranteFormProps) {
  const router = useRouter();

  const [palestrante, setPalestrante] = useState<Palestrante>(
    palestranteExistente
      ? new Palestrante(
          palestranteExistente.id,
          palestranteExistente.nome,
          mascararCpf(palestranteExistente.cpf),
          palestranteExistente.email,
          eventoIdPredefinido ?? palestranteExistente.eventoId
        )
      : new Palestrante(null, "", "", "", eventoIdPredefinido ?? null)
  );
  const [erroCpf, setErroCpf] = useState<string | null>(null);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const eventoId = palestrante.eventoId;

  const handlerChange = (campo: "nome" | "cpf" | "email", valor: string) => {
    setPalestrante(
      (valorAnterior) =>
        new Palestrante(
          valorAnterior.id,
          campo === "nome" ? valor : valorAnterior.nome,
          campo === "cpf" ? mascararCpf(valor) : valorAnterior.cpf,
          campo === "email" ? valor : valorAnterior.email,
          valorAnterior.eventoId
        )
    );
  };

  const handlerChangeEvento = (id: number) => {
    setPalestrante(
      (valorAnterior) =>
        new Palestrante(valorAnterior.id, valorAnterior.nome, valorAnterior.cpf, valorAnterior.email, id)
    );
  };

  const handlerSalvar = async () => {
    setErroApi(null);

    if (!eventoId) {
      setErroApi("Selecione o evento do palestrante.");
      return;
    }

    if (!cpfValido(palestrante.cpf)) {
      setErroCpf("CPF inválido. Confira os 11 dígitos.");
      return;
    }
    setErroCpf(null);

    const palestranteSalvar = new Palestrante(
      palestrante.id,
      palestrante.nome.trim(),
      palestrante.cpf,
      palestrante.email.trim().toLowerCase(),
      eventoId
    );

    try {
      if (palestranteExistente) {
        await atualizarPalestrante(eventoId, palestranteSalvar);
        alert("Palestrante atualizado com sucesso!");
      } else {
        await salvarPalestrante(eventoId, palestranteSalvar);
        alert("Palestrante cadastrado com sucesso!");
      }
      router.push(`/palestrantes?eventoId=${eventoId}`);
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível salvar o palestrante."));
    }
  };

  const voltarUrl = eventoId ? `/palestrantes?eventoId=${eventoId}` : "/palestrantes";

  return (
    <form action={handlerSalvar} className="space-y-6">
      <AvisoErro mensagem={erroApi} />

      <div className="space-y-2">
        <SeletorEvento
          eventoIdSelecionado={eventoId}
          onEventoChange={(id) => handlerChangeEvento(id)}
          desabilitado={Boolean(palestranteExistente)}
          label="Evento vinculado *"
        />
        {palestranteExistente && (
          <p className="text-[11px] text-white/40">
            O evento vinculado não pode ser alterado durante a edição do palestrante.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="palestrante-nome" className={CLASSE_LABEL}>
            Nome completo *
          </label>
          <input
            id="palestrante-nome"
            name="nome"
            type="text"
            required
            maxLength={255}
            value={palestrante.nome}
            onChange={(e) => handlerChange("nome", e.target.value)}
            placeholder="Ex: Dra. Mariana Costa"
            className={CLASSE_CAMPO}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="palestrante-cpf" className={CLASSE_LABEL}>
            CPF *
          </label>
          <input
            id="palestrante-cpf"
            name="cpf"
            type="text"
            inputMode="numeric"
            required
            value={palestrante.cpf}
            onChange={(e) => {
              handlerChange("cpf", e.target.value);
              setErroCpf(null);
            }}
            placeholder="000.000.000-00"
            aria-invalid={Boolean(erroCpf)}
            aria-describedby={erroCpf ? "palestrante-cpf-erro" : undefined}
            className={CLASSE_CAMPO}
          />
          {erroCpf && (
            <p id="palestrante-cpf-erro" className={CLASSE_ERRO_CAMPO}>
              {erroCpf}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="palestrante-email" className={CLASSE_LABEL}>
            E-mail de contato *
          </label>
          <input
            id="palestrante-email"
            name="email"
            type="email"
            required
            maxLength={255}
            value={palestrante.email}
            onChange={(e) => handlerChange("email", e.target.value)}
            placeholder="palestrante@evento.com"
            className={CLASSE_CAMPO}
          />
        </div>
      </div>

      <div className={CLASSE_RODAPE_FORM}>
        <Link href={voltarUrl} className={CLASSE_BOTAO_SECUNDARIO}>
          Cancelar
        </Link>
        <BotaoEnviar
          texto={palestranteExistente ? "Salvar alterações" : "Cadastrar palestrante"}
          textoEnviando="Salvando..."
          desabilitado={!eventoId}
          className={CLASSE_BOTAO_PRIMARIO}
        />
      </div>
    </form>
  );
}
