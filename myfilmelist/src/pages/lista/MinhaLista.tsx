import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header"
import { UserService } from "../../services/UserService";
import { ListaMovieService } from "../../services/ListaMovieService";
import type { MovieDetails } from "../../types/Movie";
import CardPrincipal from "../../components/cardPrincipal/CardPrincipal";
import { MovieService } from "../../services/MovieService";

function MinhaLista () {
    const abaAtiva = "minha-lista";
    const [loading, setLoading] = useState(true);
    const [faltando, setFaltando] = useState(0);
    const [usuarioLogado, setUsuarioLogado] = useState(false);
    const [movies, setMovies] = useState<MovieDetails[]>([]);

    const removerFilmeLocal = (id: number) => {
        setMovies(prev => prev.filter(f => f.id !== id));
    };


    
    useEffect(() => {
        const carregarFilmes = async () => {
            const isLogged = UserService.usuarioEstaLogado();
            setUsuarioLogado(isLogged);
            if (!isLogged) return;

            const dadosUser = UserService.getUsuarioLogado();
            if (!dadosUser) return;

            const userData = ListaMovieService.getMovieAll(dadosUser.id);

            const listaIds = userData.movies;

            const filmesCompletos = await Promise.all(
                listaIds.map((item) =>
                    MovieService.getMovieId(item.idMovie)
                )
            );

            const filmesValidos = filmesCompletos.filter(
                (f): f is MovieDetails => f !== null
            );

            setMovies(filmesValidos);
        };

        carregarFilmes();
    }, []);


    useEffect(()=>{
        if(faltando === 0) setLoading(false);
    }, [faltando]);


    if (!usuarioLogado) {
        return (
            <div className="flex flex-col items-center h-full w-full bg-dark">
                <Header abaAtiva={abaAtiva} />
                
                <div className="flex w-full max-w-[1980px] h-screen flex-col p-4 items-center">
                    <div className="max-w-[375px] bg-primary-red-dark text-white px-4 py-2 rounded-lg shadow-lg z-50">
                        Você precisa fazer <Link className="font-bold underline text-light-purple ml-1" to="/Login">LOGIN</Link> para usar esta função.
                    </div>
                
                </div>
            </div>
        );
    }


    return (
        <div className="flex flex-col min-h-screen w-full bg-dark">
            <Header abaAtiva={abaAtiva} />

            {loading ? (
                <div className="flex w-full h-full max-w-[1980px] justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-400 border-t-primary-red"></div>
                </div>
            ) : (
                <div className="flex w-full max-w-[1980px] flex-col flex-1 p-8 pt-24">

                    {movies.length === 0 ? (
                        <div className="flex w-full h-full justify-center">
                            <p className="text-white text-xl  px-6 py-4 rounded-lg">
                                Você não tem filmes adicionados à sua lista.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full h-full grid grid-flow-col auto-cols-max pt-2 pb-3 rounded-2xl gap-4 overflow-x-hidden">
                            {movies.map((filme) => (
                                <CardPrincipal filme={filme} key={filme.id} onRemoveMovie={removerFilmeLocal} podeRemover={true}/>
                            ))}
                        </div>
                    )}

                </div>
            )}

 

        </div>
    );
};

export default MinhaLista;
