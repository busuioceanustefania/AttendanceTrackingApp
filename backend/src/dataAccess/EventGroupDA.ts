import db from "../dbConfig";
import Event, { EventCreationAttributes } from "../entities/Event";
import EventGroup, { EventGroupCreationAttributes } from "../entities/EventGroup";
import eventGroupFilterDto from "./models/EventGroupFilterDto";
import { Like } from "./operators";

async function getEventGroup() {
  return await EventGroup.findAll({ include: ["EventGroups"] })
}


async function getEvent() {
  return await Event.findAll();
}

async function getEventGroupById(id: number) {
  return await EventGroup.findByPk(id, { include: ["EventGroups"] })
}

async function createEventGroup(event: EventGroupCreationAttributes) {
  return await EventGroup.create(event, { include: [{ model: Event, as: "EventGroups" }] });

}


async function getEventByAccessCode(accessCode: number) {
  try {
    // Replace this query with the actual query for your database
    return await Event.findOne({ where: { EventAccessCode: accessCode } });

  } catch (error) {
    console.error('Error in getEventByAccessCode:', error);
    throw new Error('Error fetching event by access code');
  }
};

async function getAccessCodeByEventId(eventId: number) {

  try {
    return await Event.findOne({ where: { EventId: eventId } });
  } catch (error) {
    console.error('Error in getAccessCodeByEventId:', error);
    throw new Error('Error fetching access code by event ID');
  }
}


async function getFilteredEventGroups(eventGroupFilter: eventGroupFilterDto) {

  if (!eventGroupFilter.take)
    eventGroupFilter.take = 10;

  if (!eventGroupFilter.skip)
    eventGroupFilter.skip = 0;

  let whereClause: any = {};
  if (eventGroupFilter.eventGroupName)
    whereClause.GroupName = { [Like]: `%${eventGroupFilter.eventGroupName}%` };


  return await EventGroup.findAndCountAll(
    {
      distinct: true,
      where: whereClause,
      limit: eventGroupFilter.take,
      offset: eventGroupFilter.skip * eventGroupFilter.take,
    });

}

async function deleteEventGroups(id: number) {
  let deleteElem = await EventGroup.findByPk(id);

  if (!deleteElem) {
    console.log("This element does not exist, so it cannot be deleted");
    return;
  }
  return await deleteElem.destroy();
}

async function updateEventGroup(eventGroup: EventGroupCreationAttributes, id: number) {
  const findEventGroup = await getEventGroupById(eventGroup.GroupId);

  if (!findEventGroup) {
    console.log("This event group does not exist");
    return;
  }

  const t = await db.transaction()
  try {
    await findEventGroup.update(eventGroup);

    // deleted
    const existEvent = await Event.findAll({
      where: {
        GroupId: eventGroup.GroupId,
      },
    });

    if (existEvent.length > 0) {
      let eventIds = existEvent.map(a => a.dataValues.EventId);
      let eventIdsDeleted = eventIds.filter(id => !eventGroup.Events.find(add => add.EventId === id)?.EventId)
      if (eventIdsDeleted.length > 0)
        await Event.destroy({
          where: {
            EventId: eventIdsDeleted,
          },
        })
    }

    // inserted 
    const insertedA = eventGroup.Events.filter(a => a.EventId === 0)
    if (insertedA.length > 0)
      await Event.bulkCreate(insertedA)

    // updated
    const updatedA = eventGroup.Events.filter(a => a.EventId !== 0);
    if (updatedA.length > 0) {
      for (let item of updatedA) {
        const findA = await Event.findByPk(item.EventId);
        await findA?.update(item);
      }
    }

    await t.commit();

  } catch (e) {
    await t.rollback();
    throw e;
  }
}




export {
  getEventGroupById,
  getEventGroup,
  createEventGroup,
  getFilteredEventGroups,
  deleteEventGroups,
  updateEventGroup,
  getEventByAccessCode,
  getEvent,
  getAccessCodeByEventId
}
