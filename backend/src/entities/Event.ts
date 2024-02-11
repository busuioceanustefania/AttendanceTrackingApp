import db from "../dbConfig";
import  Sequelize, { ModelDefined }  from "sequelize";
import { ParticipantAttributes } from "./Participant";

export interface EventAttributes {

    EventId : number,
    GroupId : number,
    EventName : string,
    EventStartTime : Date,
    EventEndTime : Date,
    EventStatus : string,
    EventAccessCode : string
    //Participants: ParticipantAttributes[]
}

export interface EventCreationAttributes extends EventAttributes {

}

const Event : ModelDefined<EventAttributes, EventCreationAttributes> = db.define("Event", {
    EventId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    GroupId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    EventName: {
        type: Sequelize.STRING,
        allowNull: false
    },

    EventStartTime: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },

    EventEndTime: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },

    EventStatus: {
        type: Sequelize.STRING,
        values: ['CLOSED', 'OPENED'],
        allowNull: false,
        validate: {
            isIn: [['CLOSED', 'OPENED']],
        }
    },

    EventAccessCode: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

export default Event;