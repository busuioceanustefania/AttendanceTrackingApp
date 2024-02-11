import { ChangeEvent, useEffect, useState } from "react";
import { get, put, remove } from "../api/Calls";
import { EventGroup } from "../models/EventGroup";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePaginationActions from "../components/TablePaginationAction";
import { PaginationResponse } from "../models/PaginationResponse";
import { Box, Button, InputAdornment, TableHead, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { EventGroupFilterDto } from "../models/EventGroupFilterDto";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import _ from "lodash";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { AccountCircle } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';

export default function EventGroupList(){

    const [eventGroups, setEventGroup] = useState<PaginationResponse<EventGroup>>({count: 0, rows: []});
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0)
    const [eventGroupFilter, setEventGroupFilter] = useState<EventGroupFilterDto>({
        eventGroupName: "",
        take: 5,
        skip: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
      getEventGroup(eventGroupFilter).then(d => { setEventGroup(d); })
    }, [])
  
    async function getEventGroup(eventGroupFilter: EventGroupFilterDto) {
      return (await get("/eventGroup", eventGroupFilter)) as PaginationResponse<EventGroup>;
    }

    function newEventGroup() {
        navigate("/NewEventGroup");
    }

    // function handleChangePage() {

    // }

    const handleChangePage = async (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPage(newPage);
      let newFilter = _.cloneDeep(eventGroupFilter);
      newFilter.skip = newPage;
      await filter(newFilter);
      setEventGroupFilter(newFilter);
    };

    const handleChangeRowsPerPage = async (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      let take = parseInt(event.target.value, 10)
      setRowsPerPage(take);
      setPage(0);
  
      let newFilter = _.cloneDeep(eventGroupFilter);
      newFilter.take = take;
      newFilter.skip = 0;
      await filter(newFilter);
      setEventGroupFilter(newFilter);
    };


    // function handleChangeRowsPerPage() {

    // }

    async function filter(filter: EventGroupFilterDto) {
      let filterEventGroup = await getEventGroup(filter);
      setEventGroup(filterEventGroup);
    }

    function onChangeFilter(e: ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      setEventGroupFilter({ ...eventGroupFilter, [e.target.name]: e.target.value });
    }

    async function filterEventGroup() {
      setPage(0)
      let egFilter = _.cloneDeep(eventGroupFilter);
      egFilter.skip = 0
      filter(egFilter)
    }
  
    async function clearFilters() {
      let newFilter = { eventGroupName: "", skip: 0, take: 5 };
      setPage(0)
      setRowsPerPage(5);
      setEventGroupFilter(newFilter);
      filter(newFilter)
    }

  function editEventGroup(GroupId: number) {
    //throw new Error("Function not implemented.");
    navigate(`/EditEventGroup`);
  }

  async function deleteEventGroup(GroupId: number){
    await remove("/eventGroup", GroupId);
    let ret = await getEventGroup(eventGroupFilter);
    setEventGroup(ret);
  }

    return(
        <div>

        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          style={{ marginBottom: '30px', marginTop: '50px' }}
        >
  
          
          <div>
          

          <TextField
              id="input-with-icon-textfield"
              label="Search by group name"
              value={eventGroupFilter.eventGroupName}
              onChange={onChangeFilter}
              name="eventGroupName"
              InputProps={{
              startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
              ),
              
            }}
               variant="standard"
               color="warning"
             />
  
  
          </div>
  
          <div>
            <Button color="warning" style={{ marginRight: '8px' }} startIcon={<FilterAltIcon />} variant="contained" onClick={filterEventGroup}>
              Filter
            </Button>
  
            <Button color="warning" startIcon={<ClearIcon />} variant="contained" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
  
        </Box>
  
        <Button  color="warning" style={{ marginBottom: '20px' }} variant="contained" startIcon={<AddCircleIcon />}  onClick={newEventGroup}>Add Event group</Button>
  
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
              <TableCell>Group Id</TableCell>
                <TableCell>Group name</TableCell>
                {/* <TableCell>Edit</TableCell> */}
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventGroups.rows.map((row) => (
                <TableRow key={row.GroupId}>
                  <TableCell align="left">
                    {row.GroupId}
                  </TableCell>
                  <TableCell align="left">
                    {row.GroupName}
                  </TableCell>
                  {/* <TableCell>
                    <Button
                      variant="outlined" startIcon={<BorderColorIcon />} color="warning"
                      onClick={() => editEventGroup(row.GroupId)}
                    >Edit</Button>
                  </TableCell> */}
                  <TableCell>
                    <Button 
                      variant="outlined" startIcon={<DeleteIcon />} color="warning" 
                      onClick={() => deleteEventGroup(row.GroupId)}
                    >Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={eventGroups.count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    );    
}