import { PaginationDto } from "./PaginationDto";

export interface ParticipantsFilterDto extends PaginationDto {
    ParticipantName : string
    ParticipantEmail : string
}