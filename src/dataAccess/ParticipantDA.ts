import Attendance, { AttendanceCreationAttributes } from "../entities/Attendance";
import Participant, { ParticipantCreationAttributes } from "../entities/Participant";
import Event from "../entities/Event";
import { Like } from "./operators";
import participantEventFilterDto from "./models/ParticipantEventFilterDto";


async function createParticipant(participant : ParticipantCreationAttributes) {
    return await Participant.create(participant);
    
}

async function associateEventParticipant(eventParticipant : AttendanceCreationAttributes){
    return await Attendance.create(eventParticipant);
  }

  

async function getParticipantsAtEvent(eventId: number) {
  return await Participant.findAll({
    include: [
      {
        model: Event,
        as: 'Events',
        where: {
          EventId: eventId,
        },
      },
    ],
  });
}

async function getEventsForParticipant(participantId: number) {
  return await Event.findAll({
    include: [
      {
        model: Participant,
        as: 'Participants',
        where: {
          ParticipantId: participantId,
        },
      },
    ],
  });
}

async function getEventsAndParticipants(participantEventFilter: participantEventFilterDto) {

  if (!participantEventFilter.take)
  participantEventFilter.take = 10;

  if (!participantEventFilter.skip)
  participantEventFilter.skip = 0;

  let whereClause: any = {};
  if (participantEventFilter.EventId)
    whereClause.EventId = { [Like]: `%${participantEventFilter.EventId}%` };

  if (participantEventFilter.ParticipantId)
    whereClause.ParticipantId = { [Like]: `%${participantEventFilter.ParticipantId}%` };


  return await Attendance.findAndCountAll(
    {
      distinct: true,
      where: whereClause,
      limit: participantEventFilter.take,
      offset: participantEventFilter.skip * participantEventFilter.take,
    });

}

async function deleteAttendance(participantId: number, eventId: number) {
  try {
    // Find the attendance record to delete
    const attendanceRecord = await Attendance.findOne({
      where: {
        ParticipantId: participantId,
        EventId: eventId,
      },
    });

    if (!attendanceRecord) {
      return { success: false, message: 'Attendance record not found.' };
    }

    // Perform the deletion
    await attendanceRecord.destroy();

    return { success: true, message: 'Attendance record deleted successfully.' };
  } catch (error) {
    console.error('Error in deleteAttendance function:', error);
    throw error; // You might want to handle the error more gracefully in a real application
  }
}


export {createParticipant, associateEventParticipant, getEventsAndParticipants, getParticipantsAtEvent, getEventsForParticipant, deleteAttendance}