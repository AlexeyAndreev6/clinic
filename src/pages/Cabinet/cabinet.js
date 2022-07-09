import * as React from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import {notification} from "antd";
import AdminTable from "./admin";
import $ from "jquery";
import './cabinet.css';

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(id, type, status, date, time, doctor, address) {
    return {id, type, status, date, time, doctor, address};
}

let rows = [];

export default function CustomizedTables() {
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        if(global.user && global.user.admin) {
            return;
        }
        const requestOptions = {
            method: 'GET',
            headers: {'Api-Token': global.token, 'cache-control': 'no-cache', 'pragma': 'no-cache'}
        };
        fetch("/api/schedule/get_info", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    if (data.error === "Невалидный токен!") {
                        global.token = null;
                        localStorage.removeItem('token');
                        setLoaded(true);
                    }
                    notification["error"]({
                        message: 'Ошибка',
                        description: data.error,
                    });
                } else {
                    rows = [];
                    const schedule = data.schedule;
                    for(let i=0; i<schedule.length; i++) {
                        let date = new Date(schedule[i].time);
                        let status = "";
                        switch (schedule[i].status) {
                            case 2:
                                status = "Приём проведён";
                                break;
                            case 3:
                                status = "Приём отменён";
                                break;
                            default:
                                status = "Ожидание приёма";
                                break;
                        }
                        rows.push(createData(
                            schedule[i].id,
                            schedule[i].at_home ? 'Вызов врача на дом' : 'Запись на прием',
                            status,
                            date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear(),
                            (date.getHours()+3)+":"+date.getMinutes()+((date.getMinutes()<10) ? "0" : ""),
                            schedule[i].doctor ? schedule[i].doctor : "-",
                            schedule[i].address ? schedule[i].address : "-",
                        ));
                    }
                }
                setLoaded(true);
            });
    });

    if(global.user && global.user.admin) {
        return <AdminTable/>;
    }

    const cancelSchedule = async (ev) => {
        let button = $(ev.target);
        let parent = button.parents(".MuiTableRow-root");
        let scheduleId = parent.attr("data-schedule-id");

        let sendData = {
            scheduleid: scheduleId
        };

        button.attr("disabled", "disabled");
        const requestOptions = {
            method: 'POST',
            headers: {'Api-Token': global.token, 'Content-Type': 'application/json', 'cache-control': 'no-cache', 'pragma': 'no-cache'},
            body: JSON.stringify(sendData)
        };
        await fetch("/api/schedule/cancel", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    notification["error"]({
                        message: 'Ошибка',
                        description: data.error,
                    });
                    button.removeAttr("disabled");
                } else {
                    parent.children().eq(1).text("Приём отменён");
                    button.parent().html("-");
                    notification["success"]({
                        message: 'Изменено',
                        description: "Приём отменён!",
                    });
                }
            });
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Тип приёма</StyledTableCell>
                        <StyledTableCell align="right">Статус</StyledTableCell>
                        <StyledTableCell align="right">Дата</StyledTableCell>
                        <StyledTableCell align="right">Время</StyledTableCell>
                        <StyledTableCell align="right">Специалист</StyledTableCell>
                        <StyledTableCell align="right">Адрес</StyledTableCell>
                        <StyledTableCell align="right">Действие</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoaded && rows.map((row) => (
                        <StyledTableRow key={row.id} data-schedule-id={row.id}>
                            <StyledTableCell component="th" scope="row">
                                {row.type}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.status}</StyledTableCell>
                            <StyledTableCell align="right">{row.date}</StyledTableCell>
                            <StyledTableCell align="right">{row.time}</StyledTableCell>
                            <StyledTableCell align="right">{row.doctor}</StyledTableCell>
                            <StyledTableCell align="right">{row.address}</StyledTableCell>
                            <StyledTableCell align="right">{row.status==="Ожидание приёма" ? <button onClick={cancelSchedule}>Отменить</button> : "-"}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}