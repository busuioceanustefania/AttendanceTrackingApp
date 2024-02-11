import express from "express";
import { associateEventParticipant, createParticipant, deleteAttendance, getEventsAndParticipants, getEventsForParticipant, getParticipantsAtEvent } from "../dataAccess/ParticipantDA";
import participantEventFilterDto from "../dataAccess/models/ParticipantEventFilterDto";
import { getEventByAccessCode } from "../dataAccess/EventGroupDA";
import Event from "../entities/Event"
import Attendance, { AttendanceCreationAttributes } from "../entities/Attendance";
import Participant, { ParticipantCreationAttributes } from "../entities/Participant";

let attendanceRoute = express.Router();

attendanceRoute.route('/participant').post(async (req, res) => {
  return res.json(await createParticipant(req.body));
})

attendanceRoute.route('/attendance').post(async (req, res) => {
  return res.json(await associateEventParticipant(req.body));
})

attendanceRoute.post('/join-event', async (req, res) => {
  try {
    const { accessCode, participantId, eventId } = req.body;

    // Find the event associated with the provided access code
    const event = await Event.findOne({ where: { EventAccessCode: req.body.EventAccessCode } });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the participant
    const participant = await Participant.findByPk(req.body.ParticipantId);

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    await Attendance.create({
      EventId: req.body.EventId,
      ParticipantId: req.body.ParticipantId,
      AttendanceStartTime: req.body.AttendanceStartTime
    });

    return res.json({ message: 'Participant joined event successfully' });
  } catch (error) {
    console.error('Error joining event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


attendanceRoute.route('/attendance').get(async (req, res) => {
  var queryParams = new participantEventFilterDto(req.query)
  return res.json(await getEventsAndParticipants(queryParams));
})

attendanceRoute.route('/participant-at-event/:id').get(async (req, res) => {
  return res.json(await getParticipantsAtEvent(parseInt(req.params.id)));
})

attendanceRoute.route('/events-for-participant/:id').get(async (req, res) => {
  return res.json(await getEventsForParticipant(parseInt(req.params.id)));
})


attendanceRoute.delete('/delete-attendance/:participantId/:eventId', async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId, 10);
    const eventId = parseInt(req.params.eventId, 10);

    if (isNaN(participantId) || isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid participant or event ID' });
    }

    const result = await deleteAttendance(participantId, eventId);

    if (result.success) {
      return res.json({ message: result.message });
    } else {
      return res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error in deleteAttendance route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



export default attendanceRoute;