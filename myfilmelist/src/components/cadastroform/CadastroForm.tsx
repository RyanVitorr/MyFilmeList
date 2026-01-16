import React, { useState } from "react";
import { UserService } from "../../services/UserService";

interface cadastroFormProps {
  setCadastro: React.Dispatch<React.SetStateAction<boolean>>;
}

function CadastroForm({setCadastro}: cadastroFormProps) {
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    senha: "",
    confirmeSenha: ""
  });

  const [erros, setErros] = useState({
    usuario: "",
    email: "",
    senha: "",
    confirmeSenha: "",
    geral: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (erros[name as keyof typeof erros]) {
      setErros((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&.*-_]).{8,}$/;
    return regex.test(senha);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let novosErros = { ...erros, geral: "" };
    let temErro = false;

    //VALIDAÇÕES DAS CREDENCIAIS
    if (formData.usuario.length < 4) {
      novosErros.usuario = "O usuário deve ter no mínimo 4 caracteres.";
      temErro = true;
    }
    if (!validarSenha(formData.senha)) {
      novosErros.senha = "A senha deve ter 8 caracteres, 1 letra maiúscula e 1 especial.";
      temErro = true;
    }
    if (formData.senha !== formData.confirmeSenha) {
      novosErros.confirmeSenha = "As senhas não coincidem.";
      temErro = true;
    }
    if (temErro) {
      setErros(novosErros);
      return;
    }

    // VALIDAÇÕES DE NOME E EMAIL JÁ EXISTENTES
    const verificarUsuario = UserService.usuarioExiste(formData.usuario, formData.email);
    if(verificarUsuario.existe) {
      novosErros.geral = verificarUsuario.mensagem || "Nome de usuário ou email já estão em uso.";
      setErros(novosErros);
      alert(novosErros.geral);
      return;
    }

    const novoUsuario = {
      nome: formData.usuario,
      email: formData.email,
      senha: formData.senha
    }

    UserService.create(novoUsuario);

    alert("Cadastro realizado com sucesso!");
    setFormData({ usuario: "", email: "", senha: "", confirmeSenha: "" });

    setCadastro(false);

  };
  return (
    <form className="flex flex-col w-full gap-4 text-white" onSubmit={handleSubmit}>

      <div className="flex flex-col gap-1">
        <label htmlFor="usuario" className="text-dark-purple">Usuário:</label>
        <input
          className="h-10 px-2 rounded bg-dark-purple text-white placeholder-gray-300 focus:outline-none"
          type="text"
          id="usuario"
          name="usuario"
          placeholder="Digite seu nome de usuário"
          value={formData.usuario}
          onChange={handleChange}
        />
        {erros.usuario && <span className="text-xs text-red-400">{erros.usuario}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-dark-purple">Email:</label>
        <input
          className="h-10 px-2 rounded bg-dark-purple text-white placeholder-gray-300 focus:outline-none"
          type="email"
          id="email"
          name="email"
          placeholder="Digite seu email"
          value={formData.email}
          onChange={handleChange}
        />
        {erros.email && <span className="text-xs text-red-400">{erros.email}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="senha" className="text-dark-purple">Senha:</label>
        <input
          className="h-10 px-2 rounded bg-dark-purple text-white placeholder-gray-300 focus:outline-none"
          type="password"
          id="senha"
          name="senha"
          placeholder="Digite sua senha"
          value={formData.senha}
          onChange={handleChange}
        />
        {erros.senha && <span className="text-xs text-red-400">{erros.senha}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmeSenha" className="text-dark-purple">Confirme sua Senha:</label>
        <input
          className="h-10 px-2 rounded bg-dark-purple text-white placeholder-gray-300 focus:outline-none"
          type="password"
          id="confirmeSenha"
          name="confirmeSenha"
          placeholder="Confirme sua senha"
          value={formData.confirmeSenha}
          onChange={handleChange}
        />
        {erros.confirmeSenha && <span className="text-xs text-red-400">{erros.confirmeSenha}</span>}
      </div>
      

      <button className="mt-8 p-3 rounded bg-primary-red hover:bg-primary-red-dark transition text-white font-semibold">
        Cadastrar
      </button>

    </form>
  );
}

export default CadastroForm;
