import { api } from "../../../api/api";
import { use, useState } from "react";
import useCalendarEventFind from "./useCalendarEventFind";

export default function useCalendarEventUpdate() {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    
    async function updateEvent(eventId: any,event: string){
        try{
            const response = await api.post(`/update/event/${eventId}`, {
                event
            });

            return response.data;

        }catch(error: any){
            setError(error.response?.data?.message || "Ocorreu um erro ao atualizar o evento")
        }finally{
            setLoading(false);
        }
    }

    return{
        loading,
        error,
        updateEvent,
    }
}