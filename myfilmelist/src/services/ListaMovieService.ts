import type { ListMovies, ListUser } from "../types/myList";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_LIST;


export const ListaMovieService = {

    toggleSavedViewed: (idUser: string, movie: ListMovies[]): void => {
        const data = localStorage.getItem(STORAGE_KEY);
        let allList: ListUser[] = [];

        if(data) allList = JSON.parse(data) as ListUser[]

        const userIndex = allList.findIndex(user => user.idUser === idUser);

        if (userIndex !== -1) {
            movie.forEach(movieToUpdate => {
                const movieIndex = allList[userIndex].movies.findIndex(m => m.idMovie === movieToUpdate.idMovie);

                if (movieIndex !== -1) {
                    allList[userIndex].movies[movieIndex] = movieToUpdate;
                } else {
                    allList[userIndex].movies.push(movieToUpdate);
                }
            });

        } else {
         
            const newUserEntry: ListUser = {
                idUser: idUser,
                movies: movie
            };
            allList.push(newUserEntry);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allList));
        console.warn("alterado")
    },

    removeMovie: (idUser: string, idMovie: number): {message: string} => {
        const data = localStorage.getItem(STORAGE_KEY);
        let allList: ListUser[] = [];

        if(data) allList = JSON.parse(data);

        const userIndex = allList.findIndex(u => u.idUser === idUser);

        if(userIndex !== -1){
            const movies = allList[userIndex].movies.filter(u => u.idMovie !== idMovie);

            allList[userIndex].movies = movies;

            localStorage.setItem(STORAGE_KEY,JSON.stringify(allList));

            console.log("Filme removido com sucesso."); 
            return { message: "Filme removido com sucesso." };
        } else {
            console.warn("Usuário não encontrado."); 
            return { message: "Usuário não encontrado." };
        }
    },

    getMovieById: (idMovie:number, idUser:number | string): ListMovies | null =>{
        const data = localStorage.getItem(STORAGE_KEY);
        let allList: ListUser[] = []

        if(data) allList = JSON.parse(data) as ListUser[];

        const indexUser = allList.findIndex(u => u.idUser === idUser);

        const movieData = allList[indexUser].movies.find(m => m.idMovie === idMovie);

        return movieData ?? null;
    },

    getMovieAll: (idUser: string | number) => {
        const data = localStorage.getItem(STORAGE_KEY);
        let allList: ListUser[] = [];

        if (data) allList = JSON.parse(data);

        const user = allList.find(u => u.idUser === idUser);

        return user ?? { idUser, movies: [] };
    }


};