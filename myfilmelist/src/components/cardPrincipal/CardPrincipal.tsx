import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { Movie } from "../../types/Movie";
import type { UserSession } from "../../types/User";
import { ListaMovieService } from "../../services/ListaMovieService";
import { UserService } from "../../services/UserService";
import type { ListMovies } from "../../types/myList";

interface CardPrincipalProps {
    filme: Movie;
    onNeedLogin?: () => void;
    onRemoveMovie?: (id: number) => void;
    podeRemover?: boolean;
}

function CardPrincipal({ filme, onNeedLogin, onRemoveMovie,  podeRemover = true }: CardPrincipalProps) {
    const [logado, setLogado] = useState(false);
    const navigate = useNavigate();
    
    const [filmeStatus, setFilmeStatus] = useState<ListMovies>({
        idMovie: filme.id,
        saved: false,
        viewed: false
    });

    const verificarUsuarioLogado = (): boolean => {
        return UserService.usuarioEstaLogado();
    }

    useEffect(() => {
        const carregarStatus = async () => {
            const estaLogado = verificarUsuarioLogado();
            setLogado(estaLogado);

            if (!estaLogado) return;

            const UserData: UserSession | null = UserService.getUsuarioLogado();
            if (!UserData) return;

            try {
                const dataFilme: ListMovies | null = await ListaMovieService.getMovieById(filme.id, UserData.id);

                setFilmeStatus({
                    idMovie: filme.id,
                    saved: dataFilme?.saved ?? false,
                    viewed: dataFilme?.viewed ?? false
                });
            } catch (error) {
                console.error("Erro ao carregar status do filme:", error);
            }
        };

        carregarStatus();
    }, [filme.id]);

    const handleToggleStatus = async (tipo: 'saved' | 'viewed') => {
        if (!logado) {
            console.warn("Você não está logado!");
            if(onNeedLogin) onNeedLogin();
            return;
        }

        const userData: UserSession | null = UserService.getUsuarioLogado();
        if (!userData) return;

        const novoStatus: ListMovies = {
            ...filmeStatus,
            [tipo]: !filmeStatus[tipo]
        };

        if (tipo === 'viewed' && novoStatus.viewed === true) {
            novoStatus.saved = true;
        }

        if(tipo === 'saved' && novoStatus.saved === false) {
            novoStatus.viewed = false;
        }

        setFilmeStatus(novoStatus);

        try {
            await ListaMovieService.toggleSavedViewed(userData.id, [novoStatus]);
            
        } catch (error) {
            console.error("Erro ao salvar alteração:", error);
            setFilmeStatus(filmeStatus); 
        }
    };

    const removerDaLista = (idFilme: number) => {
        if (!logado) {
            console.warn("Você não está logado!");
            navigate("/Login");
            return;
        }

        const userData = UserService.getUsuarioLogado();
        if (!userData) return;

        const result = ListaMovieService.removeMovie(userData.id, idFilme);

        onRemoveMovie?.(idFilme);

        return result;
    };

    const getClassesSalvo = () => 
        filmeStatus.saved 
            ? "cursor-pointer flex pl-1 bg-accent-blue hover:bg-light-purple text-dark-purple hover:text-accent-blue p-1 border-b-[1px] border-b-accent-blue-light" 
            : "cursor-pointer flex pl-1 bg-dark-purple hover:bg-light-purple text-white hover:text-accent-blue p-1 border-b-[1px] border-b-light-purple";

    const getClassesVisto = () => 
        filmeStatus.viewed 
            ? "cursor-pointer flex pl-1 bg-accent-blue hover:bg-light-purple text-dark-purple hover:text-accent-blue p-1 border-b-[1px] border-b-accent-blue-light" 
            : "cursor-pointer flex pl-1 bg-dark-purple hover:bg-light-purple text-white hover:text-accent-blue p-1 border-b-[1px] border-b-light-purple";

    return (
        <div className="flex flex-col gap-2">
            <div 
                className="group relative w-40 h-60 bg-cover bg-center rounded-lg overflow-hidden bg-no-repeat" 
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${filme.poster_path})` }}
            >
                <div className="absolute top-0 translate-y-full group-hover:translate-y-0 w-full h-full bg-zinc-900/80 transition overflow-hidden">
                    <div className="text-white flex flex-col text-center justify-between h-full">
                        <p className="w-full p-4 text-sm font-bold">{filme.title}</p>
                        
                        <div className="w-full">
                            <div className={getClassesSalvo()} onClick={() => {filmeStatus.saved  ? ( podeRemover ? removerDaLista(filmeStatus.idMovie) : handleToggleStatus('saved') ) : handleToggleStatus('saved')}}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="trakt-bookmark-path svelte-mi15e6" d="M20 2H4V22L12 18L20 22V2Z" stroke="currentColor" strokeWidth="2" fill={filmeStatus.saved ? "currentColor" : "transparent"}></path>
                                </svg>
                                <div className="w-full flex items-center justify-center">
                                    <p className="text-[12px] p-1 rounded-md">{filmeStatus.saved ? "Remover da Lista" : "Adicionar à Lista"}</p>
                                </div>
                            </div>

                            <div className={getClassesVisto()} onClick={() => handleToggleStatus('viewed')}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="transparent" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.6661 3.24663L9.16757 19.3336L1.37548 12.7952" />
                                </svg>
                                <div className="w-full flex items-center justify-center">
                                    <p className="text-[12px] p-1 rounded-md">{filmeStatus.viewed ? "Remover dos Vistos" : "Marcar como Visto"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-white bg-zinc-900/80 p-1 rounded-md text-center text-xs flex">
                <p className="flex-1">{filme.release_date.split('-')[0]}</p>
                <p className="flex-1 text-accent-blue"><Link to={`/detalhes/${filme.id}`}>Ver Mais</Link> </p>
            </div>
            
        </div>
    );
};

export default CardPrincipal;