import React from "react";
import {Router} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { UserService } from "../../services/UserService";

import Home from "../../pages/home/Home";

function LoginForm() {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = React.useState({
    email: "",
    senha: ""
  });

  const [loginError, setLoginError] = React.useState({
    emailError: "",
    senhaError: ""
  });

  const handleChanger = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginUser((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 

    const usuarioExiste = UserService.login(loginUser.email, loginUser.senha);
    if (!usuarioExiste.existe) {
      alert(usuarioExiste.mensagem || "Erro ao efetuar login.");
      console.log("Login inválido");
      return;
    }

    //redirecionar para o home
    navigate("/");
  };

  return (
    <form className="flex flex-col w-full gap-4 text-white" onSubmit={handleSubmit}>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-dark-purple">Email:</label>
        <input
          className="h-10 px-2 rounded bg-dark-purple text-white placeholder-gray-300 focus:outline-none active:outline-none"
          type="email"
          id="email"
          name="email"
          placeholder="Digite seu email"
          value={loginUser.email}
          onChange={handleChanger}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="senha" className="text-dark-purple">Senha:</label>
        <input
          className="h-10 px-2 rounded bg-dark-purple text-white placeholder-gray-300 focus:outline-none"
          type="password"
          id="senha"
          name="senha"
          placeholder="Digite sua senha"
          value={loginUser.senha}
          onChange={handleChanger}
        />

        <h3 className="text-xs text-dark-purple opacity-80 cursor-pointer hover:opacity-100">
          Esqueceu a senha?
        </h3>
      </div>

      <button className="mt-8 p-3 rounded bg-primary-red hover:bg-primary-red-dark transition text-white font-semibold">
        Entrar
      </button>

    </form>
  );
}

export default LoginForm;
