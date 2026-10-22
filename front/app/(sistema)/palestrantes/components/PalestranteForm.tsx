"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, mensagemDeErro } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { PalestranteFormProps, PalestranteRequest } from "@/app/types/palestrante";
import SeletorEvento from "@/app/components/SeletorEvento";
import AvisoErro from "@/app/components/AvisoErro";
import { cpfValido, mascararCpf } from "@/app/utils/formatacao";
import {
  CLASSE_BOTAO_PRIMARIO,
  CLASSE_BOTAO_SECUNDARIO,
  CLASSE_CAMPO,
  CLASSE_ERRO_CAMPO,
  CLASSE_LABEL,
  CLASSE_RODAPE_FORM,
} from "@/app/utils/estilos";

export default function PalestranteForm({
  palestranteExistente,
  eventoIdPredefinido,
}: PalestranteFormProps) {
  const router = useRouter();

  const [nome, setNome] = useState(palestranteExistente?.nome ?? "");
  const [cpf, setCpf] = useState(mascararCpf(palestranteExistente?.cpf ?? ""));
  const [email, setEmail] = useState(palestranteExistente?.email ?? "");
  const [eventoId, setEventoId] = useState<number | null>(
    eventoIdPredefinido ?? palestranteExistente?.eventoId ?? null
  );

  const [erroCpf, setErroCpf] = useState<string | null>(null);
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErroApi(null);

    if (!eventoId) {
      setErroApi("Selecione o evento do palestrante.");
      return;
    }

    if (!cpfValido(cpf)) {
      setErroCpf("CPF inválido. Confira os 11 dígitos.");
      return;
    }
    setErroCpf(null);

    const organizadorLogado = getOrganizadorLogado();
    if (!organizadorLogado) {
      router.push("/login");
      return;
    }

    setSalvando(true);
    const payload: PalestranteRequest = {
      nome: nome.trim(),
      cpf,
      email: email.trim().toLowerCase(),
    };

    try {
      if (palestranteExistente) {
        await api.put(
          `/eventos/${eventoId}/palestrantes/${palestranteExistente.id}?organizadorId=${organizadorLogado.id}`,
          payload
        );
        alert("Palestrante atualizado com sucesso!");
      } else {
        await api.post(
          `/eventos/${eventoId}/palestrantes?organizadorId=${organizadorLogado.id}`,
          payload
        );
        alert("Palestrante cadastrado com sucesso!");
      }
      router.push(`/palestrantes?eventoId=${eventoId}`);
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível salvar o palestrante."));
    } finally {
      setSalvando(false);
    }
  };

  const voltarUrl = eventoId ? `/palestrantes?eventoId=${eventoId}` : "/palestrantes";

  return (
    <form onSubmit={handleSalvar} className="space-y-6">
      <AvisoErro mensagem={erroApi} />

      <div className="space-y-2">
        <SeletorEvento
          eventoIdSelecionado={eventoId}
          onEventoChange={(id) => setEventoId(id)}
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
            type="text"
            required
            maxLength={255}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
            type="text"
            inputMode="numeric"
            required
            value={cpf}
            onChange={(e) => {
              setCpf(mascararCpf(e.target.value));
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
            type="email"
            required
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="palestrante@evento.com"
            className={CLASSE_CAMPO}
          />
        </div>
      </div>

      <div className={CLASSE_RODAPE_FORM}>
        <Link href={voltarUrl} className={CLASSE_BOTAO_SECUNDARIO}>
          Cancelar
        </Link>
        <button type="submit" disabled={salvando || !eventoId} className={CLASSE_BOTAO_PRIMARIO}>
          {salvando ? "Salvando..." : palestranteExistente ? "Salvar alterações" : "Cadastrar palestrante"}
        </button>
      </div>
    </form>
  );
}
