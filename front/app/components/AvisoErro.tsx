// Mesmo visual do aviso de erro que já existia na tela de login
export default function AvisoErro({ mensagem }: { mensagem: string | null }) {
  if (!mensagem) return null;

  return (
    <div
      role="alert"
      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm whitespace-pre-line"
    >
      {mensagem}
    </div>
  );
}
