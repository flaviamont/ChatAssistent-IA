import { api } from "../../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function useGoogleLogin() {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const navigate = useNavigate();

    async function login(){
        try{
            setLoading(true);
            setError(null);
            console.log("Iniciando processo de login oAuth2")
            const response = await api.get("/auth/google");

            if(response.data.url){
                window.location.href = response.data.url;
            }else{
                console.log("Não foi possível obter a URL de reedirecionamento");
            }
        }catch(error: any){
            console.log("Ocorreu um erro ao tentar logar com o google: ", error);
            setError(error.response?.data?.message || "Ocorreu um erro ao tentar logar com o google");
        }
    }

    return {
        loading,
        error,
        login
    }
}
