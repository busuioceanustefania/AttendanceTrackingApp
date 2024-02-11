import paginationDto from "./paginationDto";

export default class eventGroupFilterDto extends paginationDto{
    eventGroupName! : string | null

    constructor(obj : Partial<eventGroupFilterDto>) {
        super();
        Object.assign(this, obj);
        this.setTakeAndSkip(this.take, this.skip);
    }
}