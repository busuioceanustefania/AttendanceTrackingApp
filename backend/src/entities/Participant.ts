import db from "../dbConfig";
import  Sequelize, { ModelDefined }  from "sequelize";

export interface ParticipantAttributes {

    ParticipantId : number,
    ParticipantName : string,
    ParticipantEmail : string
}

export interface ParticipantCreationAttributes extends ParticipantAttributes {

}

const Participant : ModelDefined<ParticipantAttributes, ParticipantCreationAttributes> = db.define("Participant", {

    ParticipantId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    ParticipantName: {
        type: Sequelize.STRING,
        allowNull: false
    },

    ParticipantEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
})

export default Participant;