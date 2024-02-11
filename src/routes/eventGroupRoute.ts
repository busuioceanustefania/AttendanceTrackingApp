import express from 'express';
import eventGroupFilterDto from '../dataAccess/models/EventGroupFilterDto';
import { createEventGroup, deleteEventGroups, getAccessCodeByEventId, getEvent, getEventGroup, getEventGroupById, getFilteredEventGroups, updateEventGroup } from '../dataAccess/EventGroupDA';



let eventGroupRoute = express.Router();
  
eventGroupRoute.route('/eventGroup').post( async (req, res) => {
  return res.json(await createEventGroup(req.body));
})

eventGroupRoute.route('/eventGroup').get( async (req, res) => {  
  var queryParams = new eventGroupFilterDto(req.query) 
  return res.json(await getFilteredEventGroups(queryParams));
})

eventGroupRoute.route('/events').get(async (req,res) => {
  return res.json(await getEvent());
})

eventGroupRoute.route('/eventGroup/:id').get( async (req, res) => {
  let id = parseInt(req.params.id) 
  return res.json(await getEventGroupById(id));
})

eventGroupRoute.route('/eventGroup/:id').delete( async (req, res) => {
  let id = parseInt(req.params.id) 
  return res.json(await deleteEventGroups(id));
})

eventGroupRoute.route('/eventGroup/:id').put( async (req, res) => {
  let id = parseInt(req.params.id) 
  return res.json(await updateEventGroup(req.body, id));
})

eventGroupRoute.route('/access-code/:id').get( async (req, res) => {
  let id = parseInt(req.params.id)
  return res.json(await getAccessCodeByEventId(id));
});

export default eventGroupRoute;