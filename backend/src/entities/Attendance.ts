import db from "../dbConfig";
import  Sequelize, { ModelDefined }  from "sequelize";

export interface AttendanceAttributes {

    EventId : number,
    ParticipantId : number,
    AttendanceStartTime : Date | null
    
}

export interface AttendanceCreationAttributes extends AttendanceAttributes {

}

const Attendance : ModelDefined<AttendanceAttributes, AttendanceCreationAttributes> = db.define("Attendance", {

    // AttendanceId: {
    //     type: Sequelize.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true,
    //     allowNull: false
    // },

    EventId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },

    ParticipantId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },

    AttendanceStartTime: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
            isDate: true
        }
    }
})

export default Attendance;