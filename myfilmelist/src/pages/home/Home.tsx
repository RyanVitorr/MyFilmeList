import { useEffect, useState } from "react";
import type { Movie, Genre } from "../../types/Movie";
import { Link } from "react-router-dom";
import { MovieService } from "../../services/MovieService";
import Header from "../../components/header/Header";
import ContainerLista from "../../components/containerFilmes/ContainerLista";

function Home() {
    const [loading, setLoading] = useState(true);
    const [faltando, setFaltando] = useState(0);
    const [precisaLogin, setPrecisaLogin] = useState(false);
    const abaAtiva = "inicio";
    
    const [categorias, setCategorias] = useState<Genre[]>([]);
    const [movie, setMovie] = useState<Movie | null>(null); 

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            try {

                const dadosGeneros = await MovieService.getGenres();
                setCategorias(dadosGeneros);
                
                const dadosPopulares = await MovieService.getPopularMovie?.() || []; 
                if (dadosPopulares.length > 0) {
                    setMovie(dadosPopulares[0]);
                }

                setFaltando(dadosGeneros.length + 1);

            } catch (error) {
                console.error("Erro ao carregar home:", error);
            }
        }

        carregarDadosIniciais();
    }, []);

    useEffect(() => {
        if (precisaLogin) {
            const timer = setTimeout(() => setPrecisaLogin(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [precisaLogin]);

    useEffect(() => {
        if(faltando <= 0) setLoading(false);
    }, [faltando]);
    

    const backdrop = movie?.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
        : "";

    return ( 
        <div className="flex flex-col min-h-screen w-full bg-dark text-white overflow-x-hidden">
            
            <Header abaAtiva={abaAtiva} />

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

            {loading && (
                <div className="fixed inset-0 z-40 bg-dark flex flex-col justify-center items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-red"></div>
                    <p className="mt-4 text-accent-blue animate-pulse">Carregando catálogo...</p>
                </div>
            )}

            {movie && (
                <div 
                    className="relative w-full h-[80vh] bg-cover bg-center bg-no-repeat"
                    style={{ 
                        backgroundImage: `url(${backdrop})` 
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full p-8 pb-12 md:p-16 flex flex-col items-start max-w-2xl space-y-4">
                        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg text-white">
                            {movie.title}
                        </h1>
                        <p className="text-lg text-accent-blue-light line-clamp-3 drop-shadow-md">
                            {movie.overview}
                        </p>
                        
                        <div className="flex gap-4 mt-4">
                            <Link 
                                to={`/detalhes/${movie.id}`}
                                className="flex items-center gap-2 bg-gray-600/80 text-white px-8 py-3 rounded-md font-bold hover:bg-gray-600 transition-all backdrop-blur-sm"
                            >
                                Mais Informações
                            </Link>
                        </div>
                    </div>
                </div>
            )}


            <div className={`relative z-10 w-full max-w-[1980px] mx-auto flex flex-col gap-8 px-4 md:px-12 pb-20 ${movie ? 'mt-16' : 'pt-24'}`}>

                <div className="space-y-2">
                    <ContainerLista 
                        categoria={{id: 'populares', name: 'Tendências Agora'}} 
                        onLoaded={() => setFaltando(prev => prev - 1)} 
                        onNeedLogin={() => setPrecisaLogin(true)}
                    />
                </div>

                {categorias.map((categoria) => (
                    <ContainerLista 
                        key={categoria.id} 
                        categoria={{id: categoria.id, name: categoria.name}} 
                        onLoaded={() => setFaltando(prev => prev - 1)} 
                        onNeedLogin={() => setPrecisaLogin(true)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;