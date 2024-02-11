import { Event} from "./Events";

export interface EventGroup{
    GroupId : number,
    GroupName: string,
    Events: Event[] 
}