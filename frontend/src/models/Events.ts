import { ParticipantAttributes } from "./Participants"

export interface Event {
 


    EventId : number,
    GroupId : number,
    EventName : string,
    EventStartTime : Date,
    EventEndTime : Date,
    EventStatus : string,
    EventAccessCode : string,
   // Participants: ParticipantAttributes[]
}