import paginationDto from "./paginationDto";

export default class participantEventFilterDto extends paginationDto{
    EventId! : number | null
    ParticipantId! : number | null

    constructor(obj : Partial<participantEventFilterDto >) {
        super();
        Object.assign(this, obj);
        this.setTakeAndSkip(this.take, this.skip);
    }
}