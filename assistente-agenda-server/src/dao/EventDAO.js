const EventModel = require("../models/EventModel");

const EventDAO = () => {

    const saveEvent = async(data) => {

        if(!data){
            console.log("Os dados vieram vazios");
            return;
        }
        const { eventId, summary, description, creator, status, startTime, endTime,created, updated } = data;

        try{
            const event = await EventModel({
                eventId,
                summary,
                description,
                creator,
                status,
                startTime,
                endTime,
                created,
                updated
            });

            await event.save();

            return event;

        }catch(error){
            console.log("Ocorreu um erro ao salvar evento: ", error);
            throw new Error("Ocorreu um erro ao salvar o evento no banco: ", error);
        }
        
    },

    updateEvent = async(data) => {
         if(!data){
            console.log("Os dados vieram vazios");
            return;
        }
        const { eventId, summary, description, creator, status, stratTime, endTime,created, updated } = data;

        try{
            const existsEvent = await EventModel.findOne({ eventId: eventId })

            if(!existsEvent){
                console.log("O evento não existe");
                return;
            }

            const event = await EventModel.findByIdAndUpdate( 
                existsEvent._id,
            {
                eventId,
                summary,
                description,
                status,
                created, 
                updated,    
            });

            return event;

        }catch(error){
            console.log("Ocorreu um erro ao atualizar o evento: ", error);
            throw new Error("Ocorreu um erro ao atualizar o evento no banco: ", error);
        }
    },

    deleteEvent = async(eventId) => {
        try{
            const eventExists = await EventModel.findOne({ eventId: eventId });

            if(!eventExists){
                console.log("O evento não existe");
                return;
            }

            const event = await EventModel.findByIdAndDelete(eventExists._id);
            return event;
        }catch(error){
            console.log("Ocorreu um erro ao atualizar o evento: ", error);
            throw new Error("Ocorreu um erro ao atualizar o evento no banco: ", error);
        }
    }

    findEventId = async(data) => {
        try{
            const { summary, start, end} = data.busca;
            console.log("A data no dao: ", data.busca)
            const filter = {
                startTime: start.dateTime,
                endTime: end.dateTime
            };

            if (summary) {
                filter.summary = summary;
            }
            const existsEvent = await EventModel.findOne(filter);
            if(!existsEvent){
                console.log("O evento não existe");
                return;
            }

            const eventID = existsEvent.eventId;

            return eventID;

        }catch(error){
            console.log("Ocorreu um erro ao atualizar o evento: ", error);
            throw new Error("Ocorreu um erro ao atualizar o evento no banco: ", error);
        }
    }

    return{
        saveEvent,
        updateEvent,
        deleteEvent,
        findEventId,
    }
}

module.exports = EventDAO;