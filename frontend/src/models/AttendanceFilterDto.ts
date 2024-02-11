import { PaginationDto } from "./PaginationDto";

export interface AttendanceFilterDto extends PaginationDto {
    EventId : number
    ParticipantId : number
    AttendanceStartTime : Date
}