import React, { useEffect, useRef } from "react";
import type { Movie } from "../../types/Movie";
import { MovieService } from "../../services/MovieService";
import CardPrincipal from "../cardPrincipal/CardPrincipal";

interface categoria {
    id: number | string;
    name: string;
}

interface ContainerFilmesProps {
    categoria: categoria;
    onLoaded: () => void;
    onNeedLogin?: () => void;
}

function ContainerLista ({categoria, onLoaded, onNeedLogin}: ContainerFilmesProps) {

    const [filmes, setFilmes] = React.useState<Movie[]>([]);
    const refCarrossel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        
        const carregarFilmesPorCategoria = async (id: number | string) => {

            let dados: Movie[] = [];
            if (categoria.id === 'populares') {
                dados = await MovieService.getPopularMovie();
            } else {
                dados = await MovieService.getMovieGenre(Number(id));
            }
            
            setFilmes(dados || []);
            onLoaded();
        };

        carregarFilmesPorCategoria(categoria.id);
    },[]);

    const passarDireita = (e: React.FormEvent) =>{
        e.preventDefault
        const div = refCarrossel.current;
        if (!div) return;

        const width = div.clientWidth;

        div.scrollBy({ left: width, behavior: "smooth" });

        setTimeout(() => {
            if (div.scrollLeft >= div.scrollWidth / 2) {
                div.style.scrollBehavior = "auto";
                div.scrollLeft = div.scrollLeft - div.scrollWidth / 2;
                div.style.scrollBehavior = "smooth";
            }
        }, 400);
    };

    const passarEsquerda = (e: React.FormEvent) => {
        e.preventDefault();
        const div = refCarrossel.current;
        if (!div) return;

        const width = div.clientWidth;

        div.scrollBy({ left: -width, behavior: "smooth" });

        setTimeout(() => {
            if (div.scrollLeft <= 0) {
                div.style.scrollBehavior = "auto";
                div.scrollLeft = div.scrollLeft + div.scrollWidth / 2;
                div.style.scrollBehavior = "smooth";
            }
        }, 400);
    };
    
    console.log(filmes);
    return (
        <div key={categoria.id} className="w-full flex flex-col relative">
            <div className="flex text-white text-2xl font-bold p-2 gap-4">
                <p className="text-[20px]">{categoria.name}</p>
                <p className="text-[10px]">Ver Mais</p>
            </div>

            <div ref={refCarrossel} className="w-full h-auto grid grid-flow-col auto-cols-max items-center pt-2 pb-3 rounded-2xl gap-4 overflow-x-hidden">
               {[...filmes, ...filmes].map((filme, index) => (
                    <CardPrincipal 
                        key={`${filme.id}-${index}`} 
                        filme={filme} 
                        onNeedLogin={onNeedLogin}
                        podeRemover={false}
                    />
                ))}

            </div>

            <button onClick={passarEsquerda} className="flex items-center justify-center text-center absolute text-[5rem] w-24 p-4 h-[81%] top-0 translate-y-[19.5%] bottom-0 text-[#ffffff0f] hover:text-[#ffffff3d] bg-zinc-900/50 hover:bg-opacity-purple rounded-lg left-0" >
                {"<"}
            </button>
            <button onClick={passarDireita} className="flex items-center justify-center text-center absolute text-[5rem] w-24 p-4 h-[81%] top-0 translate-y-[19.5%] bottom-0 text-[#ffffff0f] hover:text-[#ffffff3d] bg-zinc-900/50 hover:bg-opacity-purple rounded-lg right-0">
                {">"}
            </button>
        </div>
    );
}

export default ContainerLista;