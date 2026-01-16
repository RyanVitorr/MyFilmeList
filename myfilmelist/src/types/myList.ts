export interface ListMovies {
    idMovie: number;
    saved: boolean;
    viewed: boolean;
}

export interface ListUser {
    idUser: string;
    movies: ListMovies[];
}