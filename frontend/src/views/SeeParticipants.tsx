import { ChangeEvent, useEffect, useState } from "react";
import { get, remove } from "../api/Calls";
import { AttendanceFilterDto } from "../models/AttendanceFilterDto";
import { PaginationResponse } from "../models/PaginationResponse";
import { Attendance } from "../models/Attendance";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { Box, TextField, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination } from "@mui/material";
import TablePaginationActions from "../components/TablePaginationAction";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import Papa from "papaparse";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function SeeParticipants() {

    const [Attendance, setAttendance] = useState<PaginationResponse<Attendance>>({ count: 0, rows: [] });
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0)
    const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilterDto>({
        EventId: 0,
        ParticipantId: 0,
        AttendanceStartTime: new Date(),
        take: 5,
        skip: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        getAttendance(attendanceFilter).then(d => { setAttendance(d); })
    }, [])

    async function getAttendance(attendanceFilter: AttendanceFilterDto) {
        return (await get("/attendance", attendanceFilter)) as PaginationResponse<Attendance>;
    }

    const handleChangePage = async (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
        let newFilter = _.cloneDeep(attendanceFilter);
        newFilter.skip = newPage;
        await filter(newFilter);
        setAttendanceFilter(newFilter);
    };

    const handleChangeRowsPerPage = async (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        let take = parseInt(event.target.value, 10)
        setRowsPerPage(take);
        setPage(0);

        let newFilter = _.cloneDeep(attendanceFilter);
        newFilter.take = take;
        newFilter.skip = 0;
        await filter(newFilter);
        setAttendanceFilter(newFilter);
    };

    function onChangeFilter(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setAttendanceFilter({ ...attendanceFilter, [e.target.name]: e.target.value });
    }

    async function filterEmployee() {
        setPage(0)
        let empFilter = _.cloneDeep(attendanceFilter);
        empFilter.skip = 0
        filter(empFilter)
    }

    async function clearFilters() {
        let newFilter = { EventId: 0, ParticipantId: 0, AttendanceStartTime: new Date(), skip: 0, take: 5 };
        setPage(0)
        setRowsPerPage(5);
        setAttendanceFilter(newFilter);
        filter(newFilter)
    }

    async function filter(filter: AttendanceFilterDto) {
        let filterAttendance = await getAttendance(filter);
        setAttendance(filterAttendance);
    }

    const handleExportCSV = () => {
        const csvData = generateCSVData(Attendance.rows);
        const csvFileName = "participants.csv";
        exportCSV(csvData, csvFileName);
    };

    const handleExportExcel = () => {
        const excelData = generateExcelData(Attendance.rows);
        const excelFileName = "participants.xlsx";
        //exportExcel(excelData, excelFileName);
    };

    const generateCSVData = (participants: Attendance[]) => {
        const header: string[] = ["Event Id", "Participant Id", "Attendance Time"];
        const rows: (string | number | null)[][] = participants.map((participant) => [
            participant.EventId.toString(),
            participant.ParticipantId.toString(),
            participant.AttendanceStartTime ? participant.AttendanceStartTime.toLocaleString() : 'N/A',
        ]);

        return [header, ...rows];
    };

    const generateExcelData = (participants: Attendance[]) => {
        const header: string[] = ["Event Id", "Participant Id", "Attendance Time"];
        const rows: (string | number | null)[][] = participants.map((participant) => [
            participant.EventId,
            participant.ParticipantId,
            participant.AttendanceStartTime ? participant.AttendanceStartTime.toLocaleString() : 'N/A',
        ]);

        return [header, ...rows];
    };

    const exportCSV = (data: (string | number | null)[][], fileName: string) => {
        const csvData = Papa.unparse(data);
        const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
        saveAs(csvBlob, fileName);
    };

    // const exportExcel = (data: (string | number | null)[][], fileName: string) => {
    //     const ws = XLSX.utils.aoa_to_sheet(data);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    //     // Specify mimeType directly in the options
    //     const options: XLSX.WritingOptions & { mimeType: string } = { bookType: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

    //     // Use a type assertion for the entire options object
    //     const excelBlob = XLSX.write(wb, options as any);
    //     saveAs(new Blob([excelBlob], { type: options.mimeType }), fileName);
    // };

    
    
    

    return (
        <div>

            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                style={{ marginBottom: '30px' }}
            >

                <h1>Filters</h1>
                <div>

                    <TextField
                        label="Event Id"
                        value={attendanceFilter.EventId}
                        onChange={onChangeFilter}
                        name="EventId"
                        variant="standard"
                        color="warning"
                    />

                    <TextField
                        label="Participant Id"
                        value={attendanceFilter.ParticipantId}
                        onChange={onChangeFilter}
                        name="ParticipantId"
                        variant="standard"
                        color="warning"
                    />

                    <TextField
                        label="Attendance Time"
                        value={attendanceFilter.AttendanceStartTime}
                        onChange={onChangeFilter}
                        name="AttendanceStartTime"
                        variant="standard"
                        color="warning"
                    />

                </div>

                <div>
                    <Button style={{ marginRight: '8px' }} startIcon={<FilterAltIcon />} variant="contained" color="warning" onClick={filterEmployee}>
                        Filter
                    </Button>

                    <Button startIcon={<ClearIcon />} variant="contained" color="warning" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </div>

                <div>
                    <Button style={{ marginRight: '8px', marginTop: '15px' }}variant="contained" color="success" onClick={handleExportCSV}>
                        Export CSV
                    </Button>
                    {/* <Button style={{ marginTop: '15px' }} variant="contained" color="success" onClick={handleExportExcel}>
                        Export Excel
                    </Button> */}
                </div>

            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Event Id</TableCell>
                            <TableCell>Participant Id</TableCell>
                            <TableCell>Attendance Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Attendance.rows.map((row) => (
                            <TableRow key={row.EventId}>
                                <TableCell align="left">
                                    {row.EventId}
                                </TableCell>
                                <TableCell align="left">
                                    {row.ParticipantId}
                                </TableCell>
                                <TableCell align="left">
                                    {row.AttendanceStartTime ? row.AttendanceStartTime.toLocaleString() : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={Attendance.count}
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

