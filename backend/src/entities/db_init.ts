import mysql from 'mysql2/promise.js'
import env from 'dotenv';
import EventGroup from './EventGroup';
import Event from './Event';
import Attendance from './Attendance';
import Participant from './Participant';

env.config();

async function createDatabase(){
    mysql.createConnection({
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD
    })
    .then((connection) => {
    return connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`)
    })
    .catch((err) => {
    console.warn(err.stack)
    })
}


function fkConfig()
{
    //trb sa facem entitatile
    // Employee.hasMany(Address, {as : Addresses, foreignKey: "EmployeeId"});
    // Address.belongsTo(Employee, { foreignKey: "EmployeeId"})

    //relationship 1->n
    EventGroup.hasMany(Event, {as : "EventGroups", foreignKey: 'GroupId'});
    Event.belongsTo(EventGroup, { foreignKey: 'GroupId'});

    // //relationship n->n
    Participant.belongsToMany(Event, {through: "Attendance", as: "Events", foreignKey: "ParticipantId"});
    Event.belongsToMany(Participant, {through: "Attendance", as: "Participants", foreignKey: "EventId"});

    // Event.hasMany(Attendance, {as : "Event", foreignKey: 'EventId'});
    // Attendance.belongsTo(Event, {foreignKey: 'EventId'});

    // Participant.hasMany(Attendance, {as : "Participant", foreignKey: 'ParticipantId'});
    // Attendance.belongsTo(Participant, {foreignKey: 'ParticipantId'});


}

function db_init(){
    createDatabase();
    fkConfig();
}

export default db_init;