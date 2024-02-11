import db from "../dbConfig";
import  Sequelize, { ModelDefined }  from "sequelize";
import { EventAttributes } from "./Event";

export interface EventGroupAttributes{
    GroupId : number,
    GroupName: string,
    Events: EventAttributes[] 
}

export interface EventGroupCreationAttributes extends EventGroupAttributes {};


const EventGroup : ModelDefined<EventGroupAttributes, EventGroupCreationAttributes> = db.define("EventGroup", {

    GroupId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    GroupName: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

export default EventGroup;