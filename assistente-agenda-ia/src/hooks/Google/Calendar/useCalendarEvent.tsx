import { api } from "../../../api/api";
import { useState } from "react";

export default function useCalendarEvent(){
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    async function createdEvent(event: string){
        try{
            setLoading(true);
            setError("");

            console.log("No hook de useCalendarEvent: ", event)

            const response = await api.post("/created/event", {
                event
            });

        }catch(error: any){
            console.log("Ocorreu um erro ao criar o evento: ", error);
            setError(error.response?.data?.message || "Ocorreu um erro ao criar o evento");
        }finally{
            setLoading(false);
        }
    }

    return{
        loading,
        error,
        createdEvent
    }
}