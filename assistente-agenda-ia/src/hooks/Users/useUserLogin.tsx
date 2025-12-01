import { useState } from "react";
import { api } from "../../api/api";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

export function useUserLogin() {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const navigate = useNavigate();

    const UsuarioSchema = Yup.object().shape({
        email: Yup.string().required("O campo de e-mail é obrigatório!"),
        senha: Yup.string().required("O campo de senha é obrigatório!"),
    });

    async function login(values: any) {
        try {
            setLoading(true);
            setError(null);

            const email = values.email;
            const senha = values.senha;

            console.log("values", values)
            const response = await api.post("/login", {
                email: values.email,
                senha: values.senha,
                withCredentials: true,
            });

            if(response.status === 200){
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('nome', response.data.user.nome);
                console.log("O token: ", response.data.token)
                navigate("/", {
                    state: { message: "Usuário logado com sucesso", type: "success" }
                });
                return response.data;
            }

            return response.data;
        } catch (error: any) {
            setError(error.response?.data?.message || "Ocorreu um erro ao realizar o login");
        }finally{
            setLoading(false);
        }
    }

    return{
        UsuarioSchema,
        login,
        loading,
        error,
        setError
    }
}