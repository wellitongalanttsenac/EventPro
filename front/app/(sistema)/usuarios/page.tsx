'use client'
import { Usuario } from "@/app/types/usuarios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Usuarios() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        carregarDados();
    }, [])

    const carregarDados = async () => {

        try {

            const dados = await axios.get<Usuario[]>("http://localhost:8080/usuarios");

            setUsuarios(dados.data);

        } catch (err) {
            console.log(err)
        }

    }
    return (
        <>
            <div className="min-h-screen bg-[#150606] text-[#F5EDEC] font-sans antialiased px-6 py-16">
                <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
                    <h1 className="text-3xl font-bold tracking-tight">Titulo</h1>
                    <Link
                        href="/usuarios/novo"
                        className="inline-flex items-center px-6 py-3 bg-[#FF3B3B] text-[#150606] font-semibold rounded-full hover:bg-[#ff5c5c] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B3B]"
                    ></Link>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(255,59,59,0.25)]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-medium tracking-wider uppercase text-white/50">ID</th>
                                    <th className="px-6 py-4 text-xs font-medium tracking-wider uppercase text-white/50">Nome</th>
                                    <th className="px-6 py-4 text-xs font-medium tracking-wider uppercase text-white/50">CPF</th>
                                    <th className="px-6 py-4 text-xs font-medium tracking-wider uppercase text-white/50">Email</th>
                                    <th className="px-6 py-4 text-xs font-medium tracking-wider uppercase text-white/50">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.length > 0 ? (
                                    usuarios.map((usuario) => (
                                        <tr key={usuario.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-sm text-white/80">{usuario.id}</td>
                                            <td className="px-6 py-4 text-sm text-white/80">{usuario.nome}</td>
                                            <td className="px-6 py-4 text-sm text-white/80">{usuario.cpf}</td>
                                            <td className="px-6 py-4 text-sm text-white/80">{usuario.email}</td>
                                            <td className="px-6 py-4 text-sm text-white/80">{usuario.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-sm text-white/50 text-center">
                                            Nenhum usuário encontrado
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}