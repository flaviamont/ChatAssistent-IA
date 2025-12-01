import { useState } from "react";
import { api } from "../../../api/api";

export default function useCalendarEventDelete() {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    async function deleteEvent(eventId: any){
        try{
            setLoading(true);
            setError("");

            const response = await api.delete(`/delete/event/${eventId}`);
        }catch(error: any){
            setError(error.response?.data?.message || "Ocorreu um erro ao apagar o evento")
        }finally{
            setLoading(false);
        }
    }

    return{
        deleteEvent
    }
}