import { useState } from "react";
import { api } from "../../../api/api";

export default function useCalendarEventFind(){
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ eventId, setEventId] = useState<string | null>(null);

     async function findEventID(busca: string){
            try{
                setLoading(true);
                setError("");

                const response = await api.post("/find/event", {
                    busca
                });
    
                if(response.status === 200){
                    setLoading(false);
                    setEventId(response.data.eventId);
                }
    
            }catch(error: any){
                console.log("Ocorreu um erro ao buscar esse evento no banco");
                setError(error.response?.data?.message || "Ocorreu um erro ao buscar o evento")
            }
        }

    return{
        eventId,
        findEventID
    }
}