import React from "react";
import { useState, useEffect }from "react";
import logoClaquete from '../../assets/img/claquete.png'
import LoginForm from "../../components/loginform/LoginForm";
import CadastroForm from "../../components/cadastroform/CadastroForm";

function Login() {
    const [cadastro, setCadastro] = useState(false);

    const toggleForm = () => {
        setCadastro(!cadastro);
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-dark-purple">
        
            <div className="flex flex-col items-center w-11/12 min-w-52 max-w-[360px] h-auto bg-accent-blue-light p-4 rounded-xl">
                <div className="flex flex-col justify-center items-center w-full h-10 p-7">
                    <img className=" h-full" src={logoClaquete} alt="logo claquete" />
                </div>

            <div className="flex w-full">
                {!cadastro ?  <LoginForm/> : <CadastroForm setCadastro={setCadastro}/>}
            </div>
            </div>
            <div className="flex justify-center w-11/12 min-w-52 max-w-[360px]">
                <h2 className="mt-4 text-white text-sm">{!cadastro ? "Não possui uma conta ?": "Já possui uma conta ?"} <span className="text-primary-red cursor-pointer hover:underline" onClick={toggleForm}>{!cadastro ? "Cadastre-se" : "Entrar"}</span></h2>
            </div>
        </div>
  );
}

export default Login;