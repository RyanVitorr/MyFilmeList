// interface padrão do usuario
export interface User {
  id: string; 
  nome: string;
  email: string;
  senha: string; 
}

// interface para a criação 
export type UserCreate = Omit<User, 'id'>;

// interface para usuario logado 
export type UserSession = Omit<User, 'senha'> & {_token: string};