import type { User, UserCreate, UserSession } from '../types/User';

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export const UserService = {
  
  getAll: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  },

  usuarioEstaLogado: (): boolean => {
    try{
      const token = localStorage.getItem(TOKEN_KEY);
      if(!token) return false;

      const sessao: UserSession = JSON.parse(token);
      return !!sessao._token;
      
    } catch{
      return false;
    };

  },

  getUsuarioLogado: (): UserSession | null => {
    try {
      const dados = localStorage.getItem(TOKEN_KEY);
      if (!dados) return null;

      const sessao = JSON.parse(dados);
      if(!sessao._token) return null

      return sessao;
      
    } catch {
      return null;
    }

  },

  usuarioExiste: (nome: string, email:string): {existe: boolean, mensagem?: string} => {
    const usuariosAtuais = UserService.getAll();
    const nomeExiste = usuariosAtuais.some(u => u.nome === nome);
    if (nomeExiste) {
      return {existe: true, mensagem: "Este nome de usuário já está em uso."};
    }

    const emailExiste = usuariosAtuais.some(u => u.email === email);
    if (emailExiste) {
      return {existe: true, mensagem: "Este email já está cadastrado."};
    }

    return {existe: false};
  },

  create: (dados: UserCreate): User => {
    const usuariosAtuais = UserService.getAll();

    const novoUsuario: User = {
      id: crypto.randomUUID(),
      ...dados
    };

    const novaLista = [...usuariosAtuais, novoUsuario];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));

    return novoUsuario;
  },

  login: (email: string, senha: string): {existe: boolean, mensagem?: string} => {
    const usuariosAtuais = UserService.getAll();
    const usuarioValido = usuariosAtuais.find(user => user.email === email && user.senha === senha);

    if(usuarioValido) {
      const tokenCriacao = {
        id: usuarioValido.id,
        nome: usuarioValido.nome,
        email: usuarioValido.email,
        _token: crypto.randomUUID()
      };

      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenCriacao));
      return {existe: true};
    }

    return {existe: false, mensagem: "Email ou senha inválidos."};
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    console.warn("usuario deslogado")
  }
};