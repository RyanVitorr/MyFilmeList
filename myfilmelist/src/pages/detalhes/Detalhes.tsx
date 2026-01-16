import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { MovieService } from "../../services/MovieService";
import type { MovieDetails } from "../../types/Movie";
import Header from "../../components/header/Header";
import CardDetalhes from "../../components/cardDetalhes/CardDetalhes";

type DetalhesParams = {
  id: string; 
};

function Detalhes() {
    const { id } = useParams<DetalhesParams>();
    
    const [precisaLogin, setPrecisaLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState<MovieDetails | null>(null);

    useEffect(() => {
        if (precisaLogin) {
            const timer = setTimeout(() => setPrecisaLogin(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [precisaLogin]);
    
    useEffect(() => {
        const getFilme = async () => {
            if (!id) return;
            try {
                const data = await MovieService.getMovieId(id);
                setMovie(data);

            } catch (error) {
                console.error("Erro ao buscar filme", error);
            } finally {
                setLoading(false);
            }
        };
        getFilme();
    }, [id]);

    useEffect(()=>{
        console.log(movie)
    },[movie]);


    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-dark text-accent-blue animate-pulse">
            Carregando dados...
        </div>  
    );
    
    if (!movie) return (
        <div className="h-screen flex items-center justify-center bg-dark text-primary-red">
            Filme não encontrado.
        </div>
    );

    if(!id) return null;

    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "";
    return (
        <div 
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative font-sans text-white bg-dark"
            style={{ 
                backgroundImage: `linear-gradient(to right, rgb(8, 4, 8) 20%, rgba(61, 30, 73, 0.85) 60%, rgba(61, 30, 73, 0.4)), url(${backdropUrl})` 
            }}
        >
            <div className="flex flex-col">
                <Header abaAtiva="detalhes"/>

                {precisaLogin && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                        <div className="bg-primary-red-dark text-white px-6 py-3 rounded-full shadow-[0_0_15px_rgba(233,80,90,0.5)] flex items-center gap-3 border border-primary-red">
                            <span>🔒 Ação restrita.</span>
                            <Link className="font-bold text-accent-blue hover:text-white underline transition-colors" to="/Login">
                                Faça Login
                            </Link>
                        </div>
                    </div>
                )}
                
                <CardDetalhes onNeedLogin={()=> setPrecisaLogin(true)} movie={movie} id={parseInt(id)}/>
            </div>
        </div>
    );
};

export default Detalhes;