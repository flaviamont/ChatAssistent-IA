const express = require("express");
const router = express.Router();
const Calendar = require("../controller/GoogleCalendar/Calendar");
const Gemini = require("../controller/Gemini/Gemini");
const auth = require("../middlewares/authMiddleware");

/* Auth with google */
router.get("/api/auth/google", Calendar.authGoogle);
router.get("/oauth2callback", Calendar.authCallback);

/* routes api Google Calendar */
router.post("/api/created/event", auth, Calendar.createdEvent);
router.post("/api/update/event/:id", auth, Calendar.updateEvent);
router.post("/api/find/event", auth, Calendar.findEventId);
router.delete("/api/delete/event/:id", auth, Calendar.deletedEvent);

/* routes api Google Gemini */
router.post("/api/gemini", auth, Gemini.prompt);

module.exports = router;
