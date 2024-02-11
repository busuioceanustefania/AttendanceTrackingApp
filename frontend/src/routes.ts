import Contact from "./views/Contact";
import EventGroup from "./views/EventGroup";
import EventGroupEdit from "./views/EventGroupEdit";
import Home from "./views/Home";
import JoinEvent from "./views/JoinEvent";
import NotFound from "./views/NotFound";
import SeeParticipants from "./views/SeeParticipants";
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

export const routes = Object.freeze([
    {
        path: "/",
        component: Home,
        name: "Home",
        icon: HomeIcon
    },
    {
        path: "/Contact",
        component: Contact,
        name: "Contact", 
        icon: ContactsIcon
    },
    {
        path: "/EventGroup",
        component: EventGroup,
        name: "Event Group",
        icon: EventIcon
    },
    {
        path: "/JoinEvent",
        component: JoinEvent,
        name: "Join Event",
        icon: EventAvailableIcon
    },
    {
        path: "/SeeParticipants",
        component: SeeParticipants,
        name: "See Participants",
        icon: PeopleAltIcon
    },
    {
        path: "*",
        component: NotFound,
        name: null,
        icon: BrowserNotSupportedIcon
    },
    {
        path: "/NewEventGroup/",
        component: EventGroupEdit,
        name: null,
        icon: EventRepeatIcon
    },
    {
        path: "/EditEventGroup/:id",
        component: EventGroupEdit,
        name: null,
        icon: EditCalendarIcon
    },
    {
        path: "/EditEventGroup",
        component: EventGroupEdit,
        name: null,
        icon: EditCalendarIcon

    }

    
]);