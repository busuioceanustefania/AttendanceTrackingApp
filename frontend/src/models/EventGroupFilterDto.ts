import { PaginationDto } from "./PaginationDto";

export interface EventGroupFilterDto extends PaginationDto{
    eventGroupName: string;
}