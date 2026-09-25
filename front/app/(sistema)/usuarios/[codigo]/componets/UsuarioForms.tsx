import { Usuario } from "@/app/types/usuarios";
import Link from "@/node_modules/next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function UsuarioForm() {

    const router = useRouter();

    const [usuario, setUsuario] = useState<Usuario>(new Usuario(null, "", "", "ATIVO", "", ""));

    const handleChange = ( campo: 'nome' | 'email' | 'status' | 'cpf' | 'senha', valor:string) => {
        setUsuario(
            valorAnterior => 
                new Usuario(
                    valorAnterior.id,
                    campo == 'nome' ? valor : valorAnterior.nome,
                    campo == 'email' ? valor : valorAnterior.email,
                    campo == 'status' ? valor : valorAnterior.status,
                    campo == 'cpf' ? valor : valorAnterior.cpf,
                    campo == 'senha' ? valor : valorAnterior.senha,
                )
        )
    }

    const handleSalvar = async (formData: FormData) =>{

        var dadosRetorno = await axios.post<number>('http://localhost:8080/usuarios', usuario)

        if(dadosRetorno.status == 200){
            alert("Usuario salvo com sucesso!");
        }else{
            alert(dadosRetorno.data);

            return;
        }

         router.push("/usuarios");

    }

    return (
        <form action={handleSalvar} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">
                        Nome completo:
                    </label>
                    <input name="nome" onChange={(e)=>{handleChange('nome', e.target.value)}} value={usuario.nome} className="w-full px-4 py-2.5 bg-blue-950 border border-blue-800 rounded-xl text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-inner">
                    </input>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">
                        CPF:
                    </label>
                    <input name="CPF" onChange={(e)=>{handleChange('cpf', e.target.value)}} value={usuario.cpf} className="w-full px-4 py-2.5 bg-blue-950 border border-blue-800 rounded-xl text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-inner">
                    </input>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">
                        E-mail
                    </label>
                    <input name="email" onChange={(e)=>{handleChange('email', e.target.value)}} value={usuario.email} className="w-full px-4 py-2.5 bg-blue-950 border border-blue-800 rounded-xl text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-inner">
                    </input>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">
                        Senha:
                    </label>
                    <input name="Senha" onChange={(e)=>{handleChange('senha', e.target.value)}} value={usuario.senha} type="password" className="w-full px-4 py-2.5 bg-blue-950 border border-blue-800 rounded-xl text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-inner">
                    </input>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-blue-800/80">
                <Link href="/usuarios" className="px-5 py-2.5 bg-blue-800 hover:bg-blue-700 text-blue-200 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 text-center border border-blue-700"> Cancelar</Link>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"> Salvar</button>
            </div>
        </form>
    );
}