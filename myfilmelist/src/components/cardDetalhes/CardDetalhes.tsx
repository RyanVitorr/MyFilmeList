
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { MovieDetails } from "../../types/Movie";
import type { ListMovies } from "../../types/myList";
import type { UserSession } from "../../types/User";
import { UserService } from "../../services/UserService";
import { ListaMovieService } from "../../services/ListaMovieService";

interface CardDetalhesProps {
    movie: MovieDetails;
    id: number;
    onNeedLogin?: () => void;
}

function CardDetalhes( {movie, id, onNeedLogin}:CardDetalhesProps ){
    const [filmeStatus, setFilmeStatus] = useState<ListMovies>({
        idMovie: id, 
        saved: false,
        viewed: false
    });
    

    useEffect(() => {
        const carregarStatus = async () => {
            if (!movie) return;

            const estaLogado = UserService.usuarioEstaLogado();
            if (!estaLogado) return;

            const userData: UserSession | null = UserService.getUsuarioLogado();
            if (!userData) return;

            try {
                const dataFilme: ListMovies | null = await ListaMovieService.getMovieById(movie.id, userData.id);
                
                setFilmeStatus({
                    idMovie: movie.id,
                    saved: dataFilme?.saved ?? false,
                    viewed: dataFilme?.viewed ?? false
                });
            } catch (error) {
                console.error("Erro ao carregar status do filme:", error);
            }
        };

        if (movie) {
            carregarStatus();
        }
    }, [movie]); 

    const handleToggleStatus = async (tipo: 'saved' | 'viewed') => {
        if (!UserService.usuarioEstaLogado()) {
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

        setFilmeStatus(novoStatus);

        try {
            await ListaMovieService.toggleSavedViewed(userData.id, [novoStatus]);
        } catch (error) {
            console.error("Erro ao salvar alteração:", error);
            setFilmeStatus(filmeStatus); 
        }
    };

    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "";
    const ano = movie.release_date ? movie.release_date.split('-')[0] : "N/A";

    return (
        <div className="container mx-auto px-6 py-12 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="shrink-0 w-full max-w-[300px] rounded-lg overflow-hidden border-2 border-light-purple shadow-[0_0_20px_rgba(233,80,90,0.2)]">
                <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
            </div>
            <div className="flex-1 space-y-6">

                <div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                        {movie.title}
                        <span className="ml-3 text-primary-red font-light text-4xl">{ano}</span>
                    </h1>
                    <p className="text-lg text-accent-blue italic mt-1">{movie.original_title}</p>
                </div>
                <div className="flex flex-wrap items-center gap-6">

                    <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-dark-purple border-4 border-primary-red shadow-lg">
                            <span className="text-xl font-bold text-white">{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-accent-blue uppercase tracking-wide">Avaliação</span>
                            <span className="text-xs text-accent-blue-opacity">{movie.vote_count} votos</span>
                        </div>
                    </div>
                    <button
                        onClick={() => handleToggleStatus('saved')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg border-2 ${filmeStatus.saved
                                ? "bg-white text-dark-purple border-white hover:bg-gray-200"
                                : "bg-primary-red text-white border-primary-red hover:bg-primary-red-dark hover:border-primary-red-dark"
                            }`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 2H4V22L12 18L20 22V2Z" stroke="currentColor" strokeWidth="2" fill={filmeStatus.saved ? "currentColor" : "transparent"} />
                        </svg>
                        {filmeStatus.saved ? "Na Sua Lista" : "Minha Lista"}
                    </button>
                    <button
                        onClick={() => handleToggleStatus('viewed')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg border-2 ${filmeStatus.viewed
                                ? "bg-accent-blue text-dark-purple border-accent-blue hover:bg-white"
                                : "bg-transparent text-accent-blue border-accent-blue hover:bg-accent-blue/10"
                            }`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22.6661 3.24663L9.16757 19.3336L1.37548 12.7952" />
                        </svg>
                        {filmeStatus.viewed ? "Visto" : "Marcar Visto"}
                    </button>
                </div>
                <div className="bg-light-purple/30 p-6 rounded-xl border border-light-purple backdrop-blur-sm">
                    <h3 className="text-xl font-semibold mb-2 text-primary-red">Sinopse</h3>
                    <p className="text-accent-blue-light leading-relaxed text-lg">
                        {movie.overview || "Sem descrição disponível."}
                    </p>
                </div>
                <div className="pt-4 flex flex-col gap-4">
                    <div className="flex gap-6 text-center md:text-left">
                        <div className="flex flex-col items-center">
                            <h4 className="font-bold text-accent-blue text-sm uppercase">Lançamento</h4>
                            <p>{movie.release_date.split('-').reverse().join('/')}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="font-bold text-accent-blue text-sm uppercase">Popularidade</h4>
                            <p>{movie.popularity.toFixed(0)} pontos</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="font-bold text-accent-blue text-sm uppercase">Votos Totais</h4>
                            <p>{movie.vote_count}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="font-bold text-accent-blue text-sm uppercase">Gêneros</h4>
                            <div className="flex gap-3">
                                {movie.genres?.map(genre => (
                                    <span key={genre.id}>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link to="/" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg border-2">
                            &larr; Voltar para o catálogo
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CardDetalhes;