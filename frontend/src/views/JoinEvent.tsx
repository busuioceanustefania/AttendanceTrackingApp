import { TextField, Button, Box, InputAdornment, Dialog, DialogActions, DialogContent, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from "@mui/material";
import axios from "axios";
import { ChangeEvent, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction, useEffect, useState } from "react";
import { Event } from "../models/Events";
import _, { get } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { post, put } from "../api/Calls";
import { ParticipantAttributes } from "../models/Participants";
import { Attendance } from "../models/Attendance";
import SaveIcon from '@mui/icons-material/Save';
 //import QRCode from 'qrcode';
import QRCode from 'qrcode.react';

export default function JoinEvent() {

  const [accessCode, setAccessCode] = useState('');

  const [Event, setEvent] = useState<Event>({
    EventId: 0,
    GroupId: 0,
    EventName: "",
    EventStartTime: new Date(),
    EventEndTime: new Date(),
    EventStatus: "",
    EventAccessCode: ""
  })


  const [Participant, setParticipant] = useState<ParticipantAttributes>({
    ParticipantId: 0,
    ParticipantName: "",
    ParticipantEmail: ""
  })

  const [Attendance, setAttendance] = useState<Attendance>({
    EventId: Event.EventId,
    ParticipantId: Participant.ParticipantId,
    AttendanceStartTime: new Date()
  })

  const navigation = useNavigate();
  const { id } = useParams();

  function onChangeAccessCode(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setEvent({ ...Event, EventAccessCode: e.target.value });
  }


  function onChangeParticipant(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setParticipant({ ...Participant, [e.target.name]: e.target.value });
  }

  async function saveParticipant() {
    if (!id) {
      await post("/participant", Participant);
    }
    navigation("/JoinEvent");
  }

  const [open, setOpen] = useState(false);


  function onChangeEvent(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setEvent({ ...Event, [e.target.name]: e.target.value });
  }

  function onChangeAttendance(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setAttendance({ ...Attendance, [e.target.name]: e.target.value });
  }


  // function onChangeAttendance(e: ChangeEvent<HTMLInputElement>) {
  //   e.preventDefault();
  //   setAttendance({ ...Attendance, [e.target.name]: e.target.value });
  // }

  // async function joinAttendance() {
  //   // if (!id) {
  //   //   await post("/join-event", { EventAccessCode: Event.EventAccessCode, ParticipantId: Participant.ParticipantId, EventId: Event.EventId });
  //   // }
  //   // navigation("/JoinEvent");

  //   // if (!id) {
  //   //   try {
  //   //     // Send a POST request to join the event and record attendance
  //   //     await post("/join-event", {
  //   //       EventAccessCode: Event.EventAccessCode,
  //   //       ParticipantId: Participant.ParticipantId,
  //   //       EventId: Event.EventId,
  //   //       AttendanceStartTime: new Date().toISOString() // Assuming AttendanceStartTime should be in a specific format like ISO string
  //   //     });

  //   //     // After successful joining and attendance record, navigate to a specific page
  //   //     navigation("/JoinEvent"); // You might want to navigate to a different route or handle navigation differently
  //   //   } catch (error) {
  //   //     console.error('Error joining event:', error);
  //   //     // Handle error scenarios (e.g., display an error message to the user)
  //   //   }
  //   // }
  //   //navigation("/JoinEvent");



  async function joinAttendance() {
    

      console.log(Participant.ParticipantId)
      console.log(Event.EventId)
      
      // Make the POST request to the backend endpoint
      //const response = await post("/attendance", requestData);
      const response = await post("/attendance", { EventId: Event.EventId, ParticipantId: Participant.ParticipantId, AttendanceStartTime: new Date().toISOString() })

        navigation("/JoinEvent");
      
  
  }

  const [qrCodeData, setQRCodeData] = useState('');

  function generateQRCodeData(eventId: number, accessCode: string) {
    return JSON.stringify({ eventId, accessCode });
  }

  function handleQRCodeScan(scannedData: string) {
    try {
      const { eventId } = JSON.parse(scannedData);
  
      // Fetch the access code associated with the scanned eventId from your database
      // Use this access code as needed in your application
  
      // For instance, make an API call to retrieve the access code
      axios.get(`/access-code/${eventId}`).then((response) => {
        const accessCode = response.data.accessCode;
  
        // Use the obtained access code in your application logic
        // For example:
        console.log(`Access code for Event ID ${eventId}: ${accessCode}`);
      });
    } catch (error) {
      console.error('Error parsing scanned data:', error);
      // Handle error scenarios
    }
  }



  function onQRCodeScanned(scannedData: string) {
    handleQRCodeScan(scannedData);
  }





  return (
    <div>
      <div>

      <h1>Enter your information</h1>
        <Box display="flex" justifyContent="center">
          <TextField
            label="Enter name"
            size="small"
            value={Participant.ParticipantName}
            onChange={onChangeParticipant}
            name="ParticipantName"
            variant="standard"
            color="warning"
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            style={{ marginRight: '8px', marginTop: '25px' }}
          />
          <TextField
            label="Enter email"
            size="small"
            value={Participant.ParticipantEmail}
            onChange={onChangeParticipant}
            name="ParticipantEmail"
            variant="standard"
            color="warning"
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            style={{ marginRight: '8px', marginTop: '25px' }}
          />
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            color="warning"
            style={{ marginTop: '25px', marginBottom: '25px' }}
            onClick={saveParticipant}
          >
            Save
          </Button>
        </Box>
      </div>

      <div>
      <h1>Join the event</h1>
        <Box display="flex" justifyContent="center">
          <TextField
            label="Enter event Id"
            size="small"
            value={Event.EventId}
            onChange={
              onChangeEvent
              //            onChangeAttendance(event);
            }
            name="EventId"
            variant="standard"
            color="warning"
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            style={{ marginRight: '8px', marginTop: '25px' }}
          />
          <TextField
            label="Event name"
            size="small"
            value={Event.EventName}
            onChange={onChangeEvent}
            name="EventName"
            variant="standard"
            color="warning"
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            style={{ marginRight: '8px', marginTop: '25px' }}
          />

          <TextField
            label="Enter participant Id"
            size="small"
            value={Participant.ParticipantId}
            onChange={onChangeParticipant}
            name="ParticipantId"
            variant="standard"
            color="warning"
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            style={{ marginRight: '8px', marginTop: '25px' }}
          />

        </Box>

      </div>

      <div>
        <TextField
          label="Enter AccessCode"
          size="small"
          value={Event.EventAccessCode}
          onChange={onChangeAccessCode}
          variant="standard"
          color="warning"
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
          }}
          style={{ marginRight: '8px', marginTop: '25px' }}
          
        />
        
      </div>

      <div>
      <QRCode value={generateQRCodeData(Event.EventId, Event.EventAccessCode)}
        //onChange={onQRCodeScanned} 
        />
      </div>
        
      

      <div>
      <Button
          startIcon={<SaveIcon />}
          variant="contained"
          color="warning"
          style={{ marginTop: '25px', marginBottom: '25px' }}
          onClick={joinAttendance}
        >
          Join event
        </Button>
      </div>

    </div>




  );


}