"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { PalestranteFormProps } from "@/app/types/palestrante";
import SeletorEvento from "@/app/components/SeletorEvento";

export default function PalestranteForm({
  palestranteExistente,
  eventoIdPredefinido,
}: PalestranteFormProps) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState(palestranteExistente?.nome || "");
  const [cpf, setCpf] = useState(palestranteExistente?.cpf || "");
  const [email, setEmail] = useState(palestranteExistente?.email || "");

  const [eventoId, setEventoId] = useState<number | null>(
    eventoIdPredefinido || palestranteExistente?.evento?.id || null
  );

  useEffect(() => {
    if (palestranteExistente) {
      setNome(palestranteExistente.nome || "");
      setCpf(palestranteExistente.cpf || "");
      setEmail(palestranteExistente.email || "");
      if (palestranteExistente.evento?.id) {
        setEventoId(palestranteExistente.evento.id);
      }
    }
  }, [palestranteExistente]);

  const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventoId) {
      alert("Por favor, selecione um evento válido para vincular o palestrante.");
      return;
    }

    const organizadorLogado = getOrganizadorLogado();
    if (!organizadorLogado?.id) {
      alert("Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }

    setSalvando(true);

    const payload = {
      nome: nome.trim(),
      cpf: cpf.trim(),
      email: email.trim(),
    };

    try {
      if (palestranteExistente?.id) {
        // PUT /eventos/{eventoId}/palestrantes/{id}?organizadorId=...
        const resposta = await api.put(
          `/eventos/${eventoId}/palestrantes/${palestranteExistente.id}?organizadorId=${organizadorLogado.id}`,
          payload
        );

        if (resposta.status === 200 || resposta.status === 204) {
          alert("Palestrante atualizado com sucesso!");
          router.push(`/palestrantes?eventoId=${eventoId}`);
        } else {
          alert("Não foi possível atualizar os dados do palestrante.");
        }
      } else {
        // POST /eventos/{eventoId}/palestrantes?organizadorId=...
        const resposta = await api.post(
          `/eventos/${eventoId}/palestrantes?organizadorId=${organizadorLogado.id}`,
          payload
        );

        if (resposta.status === 200 || resposta.status === 201) {
          alert("Palestrante cadastrado com sucesso!");
          router.push(`/palestrantes?eventoId=${eventoId}`);
        } else {
          alert("Não foi possível cadastrar o palestrante.");
        }
      }
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
        alert("Acesso negado: Você só pode gerenciar palestrantes dos seus próprios eventos.");
        router.push("/eventos");
      } else if (error?.response?.status === 404) {
        alert("Evento ou palestrante não encontrado no servidor.");
        router.push("/eventos");
      } else {
        alert("Erro de comunicação com o servidor ao salvar o palestrante.");
      }
    } finally {
      setSalvando(false);
    }
  };

  const voltarUrl = eventoId ? `/palestrantes?eventoId=${eventoId}` : "/palestrantes";

  return (
    <form onSubmit={handleSalvar} className="space-y-6">
      {/* Seletor de Evento Reutilizável do Organizador */}
      <div className="space-y-2">
        <SeletorEvento
          eventoIdSelecionado={eventoId}
          onEventoChange={(id) => setEventoId(id)}
          desabilitado={Boolean(palestranteExistente?.id)}
          nomeEventoFallback={palestranteExistente?.evento?.nome}
          label="Evento Vinculado *"
        />
        {palestranteExistente?.id && (
          <p className="text-[11px] text-white/40 italic">
            O evento vinculado não pode ser alterado durante a edição do palestrante.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            Nome Completo *
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Dra. Mariana Costa"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            CPF *
          </label>
          <input
            type="text"
            required
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            E-mail de Contato *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="palestrante@evento.com"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
        <Link
          href={voltarUrl}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium text-sm rounded-full transition-colors border border-white/10"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={salvando || !eventoId}
          className="px-7 py-2.5 bg-[#FF3B3B] hover:bg-[#ff5c5c] text-[#150606] font-semibold text-sm rounded-full shadow-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B] disabled:opacity-50"
        >
          {salvando
            ? "Salvando..."
            : palestranteExistente
            ? "Atualizar Palestrante"
            : "Salvar Palestrante"}
        </button>
      </div>
    </form>
  );
}
