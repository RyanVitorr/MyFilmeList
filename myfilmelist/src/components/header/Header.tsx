import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoClaquete from '../../assets/img/claquete.png';
import { UserService } from "../../services/UserService";
import { MovieService } from "../../services/MovieService";
import type { MovieSearchResult } from "../../types/Movie";

interface abaAtiva {
    abaAtiva: string;
}

function Header({ abaAtiva }: abaAtiva) {
    const [logado, setLogado] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<MovieSearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const searchRef = useRef<HTMLDivElement>(null);

    const getClassesAba = (nome: string) => `text-white pr-5 pl-5 pt-2 pb-2 rounded-xl cursor-pointer hover:bg-light-purple transition ${abaAtiva === nome ? "border-b-4 border-primary-red" : ""}`;

    const logout = () => {
        if (!logado) return;
        UserService.logout();
        window.location.reload();
    };

    useEffect(() => {
        setLogado(UserService.usuarioEstaLogado());
    });

    useEffect(() => {
        if (searchTerm.trim().length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await MovieService.search(searchTerm);
                
                setResults((data as unknown as MovieSearchResult[]) || []);
                console.log(results)
                setShowResults(true);
            } catch (error) {
                console.error("Erro na busca", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleResultClick = (id: number) => {
        setShowResults(false);
        setSearchTerm(""); 
        navigate(`/detalhes/${id}`); 
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMenuAberto(false);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="w-full max-w-[2140px] h-[60px] flex items-center justify-center bg-dark-purple p-2 relative z-50">
            <div className="w-full h-full flex items-center justify-between">
                
                <div className="h-full flex items-center justify-between relative ml-5">
                    <div onClick={() => setMenuAberto(!menuAberto)} className="xl:hidden flex flex-col cursor-pointer h-full items-center justify-center hover:bg-light-purple pl-3 pr-3 pb-1 rounded-xl mr-5">
                        <span className="block w-6 h-1 mt-1 bg-white leading-none"></span>
                        <span className="block w-6 h-1 mt-1 bg-white leading-none"></span>
                        <span className="block w-6 h-1 mt-1 bg-white leading-none"></span>
                    </div>

                    <div className={`xl:static top-full left-0 xl:w-auto bg-dark-purple xl:bg-transparent flex flex-col xl:flex-row items-start xl:items-center transition-all duration-300 ${menuAberto ? "block h-44 w-32 absolute top-14 rounded-md z-10" : " hidden "} xl:h-full xl:flex`}>
                        <ul className={`w-full h-full flex ${menuAberto ? "flex-col" : ""} items-center justify-center`}>
                            <li className={`${menuAberto ? "w-full h-full items-center justify-center flex" : ""} ${getClassesAba("inicio")} `} onClick={() => navigate("/")}>Inicio</li>
                            <li className={`${menuAberto ? "w-full h-full items-center justify-center flex" : ""} ${getClassesAba("minha-lista")}`} onClick={() => navigate("/Minha-lista")}>Minha Lista</li>
                            {logado ? 
                                <li className={`text-white pr-5 pl-5 pt-2 pb-2 rounded-xl cursor-pointer hover:bg-light-purple transition ${menuAberto ? "w-ful h-full items-center justify-center flex" : ""}`} onClick={logout}>Logout</li> :
                                <li className={`text-white pr-5 pl-5 pt-2 pb-2 rounded-xl cursor-pointer hover:bg-light-purple transition ${menuAberto ? "w-full h-full items-center justify-center flex" : ""}`}><Link to={"/Login"}>Login</Link></li>
                            }
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center h-full w-full max-w-[700px] relative" ref={searchRef}>
                    <input 
                        className="w-full h-5/6 rounded-lg px-4 text-black focus:outline-none focus:ring-2 focus:ring-primary-red" 
                        type="search" 
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                    />

                    {showResults && (
                        <div className="absolute top-full left-0 w-full bg-dark-purple rounded-b-lg shadow-xl overflow-hidden max-h-[400px] overflow-y-auto z-50 mt-1">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Buscando...</div>
                            ) : results.length > 0 ? (
                                <ul>
                                    {results.map((movie) => (
                                        <li 
                                            key={movie.id} 
                                            onClick={() => handleResultClick(movie.id)}
                                            className="flex items-center gap-3 p-2 hover:bg-light-purple cursor-pointer border-b border-gray-100 last:border-none transition-colors"
                                        >
                                            {movie.poster_path ? (
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                                                    alt={movie.title} 
                                                    className="w-10 h-14 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600">Sem Foto</div>
                                            )}
                                            
                                            
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white text-sm">{movie.title}</span>
                                                
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">Nenhum filme encontrado.</div>
                            )}
                        </div>
                    )}
                </div>

                <div className={`h-10 ml-5 mr-5 flex items-end gap-2 hover:bg-light-purple rounded-lg cursor-pointer p-2 `} onClick={() => navigate("/")}>
                    <p className="text-white hidden xl:flex">My Film List</p>
                    <img className="h-full max-md:w-10" src={logoClaquete} alt="Logo My Film List" />
                </div>
            </div>
        </div>
    );
}

export default Header;