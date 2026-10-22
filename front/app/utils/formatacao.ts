export function formatarDataHora(dataIso?: string | null): string {
  if (!dataIso) return "—";
  const data = new Date(dataIso);
  if (isNaN(data.getTime())) return dataIso;
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

// Máscara aplicada enquanto o usuário digita: 000.000.000-00
export function mascararCpf(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 11);
  return digitos
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

// Mesma regra do value object CPF da API, para avisar antes de enviar
export function cpfValido(valor: string): boolean {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digitoVerificador = (tamanho: number) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }
    const resto = 11 - (soma % 11);
    return resto > 9 ? 0 : resto;
  };

  return digitoVerificador(9) === Number(cpf[9]) && digitoVerificador(10) === Number(cpf[10]);
}

// datetime-local trabalha com horário local sem fuso: "2026-12-01T10:00"
export function dataParaInput(dataIso?: string | null): string {
  if (!dataIso) return "";
  const data = new Date(dataIso);
  if (isNaN(data.getTime())) return "";
  const doisDigitos = (n: number) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

export function inputParaIso(valorInput: string): string {
  return new Date(valorInput).toISOString();
}
