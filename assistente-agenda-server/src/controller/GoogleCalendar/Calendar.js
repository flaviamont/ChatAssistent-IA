require("dotenv").config();
const { google } = require("googleapis");
const EventDAO = require("../../dao/EventDAO");
const dao = EventDAO();
const client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.URL_CALLBACK
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const Calendar = {

    authGoogle: async(req, res) => {
        try{
            const url = client.generateAuthUrl({
                access_type: "offline",
                scope: SCOPES,
                prompt: "consent"
            });
            console.log(url)
            res.status(200).json({url: url});
        }catch(error){
            console.log(error);
            throw new Error("Ocorreu um erro ao realizar a autenticação com o Google: ", error);
        }
    },

    authCallback: async(req, res) => {
        try{
            const { code } = req.query;
            const { tokens } = await client.getToken(code);
            client.setCredentials(tokens);
            
            res.redirect("http://localhost:3001/auth/callback?token=" + encodeURIComponent(tokens.access_token));
        }catch(error){
            console.log("o error", error)
            throw new Error("Ocorreu um erro ao realizar o redirecionamento: ", error)
        }
    },

    createdEvent: async (req, res) => {
        try{

            const { event } = req.body;
            const accessToken = req.headers["authorization"]?.split(" ")[1];
            console.log(accessToken)
            client.setCredentials({access_token: accessToken});
 
            const calendar = google.calendar({version: "v3", auth: client});

            calendar.events.insert({
                auth: client,
                calendarId: "primary",
                resource: event,
                sendNotifications: true,
                conferenceDataVersion: 1
            }, async (err, event) => {
                if(err){
                    console.log("Ocorreu um erro ao tentar criar o evento: ", err);
                    return;
                }

                const data = {
                    eventId: event.data.id,
                    summary: event.data.summary,
                    description: event.data.description,
                    creator: event.data.creator.email,
                    status: event.data.status,
                    startTime: event.data.start.dateTime,
                    endTime: event.data.end.dateTime,
                    created: event.data.created,
                    updated: event.data.updated
                 };

                 const eventSaved = await dao.saveEvent(data);
                 console.log(eventSaved);
            });


            res.status(200).json({ success: true, message: "Sucesso ao criar evento"});

        }catch(error){
            throw new Error("Ocorreu um ao criar o evento: ", error);
        }
    },

    findEventId: async(req, res) => {
        try{
            console.log(req.body)
            const eventID = await dao.findEventId(req.body);

            res.status(200).json({
                success: true,
                message: "EventID buscado com sucesso",
                eventId: eventID
            })
        }catch(error){

        }
    },

    updateEvent: async (req, res) => {
        try{
            const { event } = req.body;
            const accessToken = req.headers["authorization"]?.split(" ")[1];
            client.setCredentials({access_token: accessToken});

            const eventId = req.params.id;

        console.log("o eventId: ", eventId)
            console.log("o evento: ", event)
            const calendar = google.calendar({version: "v3", auth: client});

            calendar.events.update({
                auth: client,
                calendarId: "primary",
                resource: event,
                eventId: eventId,
                sendNotifications: true,
                conferenceDataVersion: 1,
            }, async (err, event) => {
                if(err){
                    console.log("Ocorreu um erro ao atualizar o evento: ", err);
                    return;
                }

                console.log("Evento atualizado com sucesso!");
                console.log(event.data);

                 const data = {
                    eventId: event.data.id,
                    summary: event.data.summary,
                    description: event.data.description,
                    status: event.data.status,
                    startTime: event.data.start.dateTime,
                    endTime: event.data.end.dateTime,
                    created: event.data.created,
                    updated: event.data.updated
                 };

                 const eventUpdated = await dao.updateEvent(data);
            });

            res.status(200).json({
                success: true,
                message: "Evento atualizado com sucesso."
            });
        }catch(error){
            throw new Error("Ocorreu um erro ao atualizar o evento: ", error);
        }
    },

    deletedEvent: async(req, res) => {
        try{
            const accessToken = req.headers["authorization"]?.split(" ")[1];
            client.setCredentials({access_token: accessToken});

            console.log("Iniciando o processo para deletar o evento...")

            const eventId = req.params.id;

            console.log("O eventId: ", eventId);

            const calendar = google.calendar({version: "v3", auth: client});

            calendar.events.delete({
                auth: client,
                calendarId: "primary",
                eventId: eventId
            }, async(err, event) => {
                if(err){
                    console.log("Ocorreu um erro ao deletar o evento: ", err);
                    return;
                }

                console.log("O evento foi apagado com sucesso: ", event);
                await dao.deleteEvent(eventId);
            });
            
        }catch(error){
            throw new Error("Ocorreu um erro ao deletar o evento: ", error);
        }
    }
}

module.exports = Calendar;