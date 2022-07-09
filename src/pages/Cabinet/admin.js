import './admin.css';
import {useEffect, useState} from "react";
import {notification} from "antd";
import * as React from "react";
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid';
import $ from "jquery";

const changeStatus = async (ev) => {
    let select = $(ev.target);
    let parent = select.parents(".MuiDataGrid-row");
    let scheduleId = parent.attr("data-id");

    let sendData = {
        scheduleid: scheduleId,
        newstatus: ev.target.value
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Api-Token': global.token,
            'Content-Type': 'application/json',
            'cache-control': 'no-cache',
            'pragma': 'no-cache'
        },
        body: JSON.stringify(sendData)
    };
    await fetch("/api/schedule/change_status", requestOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                notification["error"]({
                    message: 'Ошибка',
                    description: data.error,
                });
            } else {
                notification["success"]({
                    message: 'Изменено',
                    description: "Статус изменён!",
                });
            }
        });
}

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', type: 'number'},
    {
        field: 'name',
        headerName: 'Имя',
        sortable: false
    },
    {
        field: 'type', headerName: 'Тип приёма', width: 160
    },
    {field: 'status', headerName: 'Статус', width: 240,
        renderCell: (params) => (
            <select onChange={changeStatus} defaultValue={params.value}>
                <option value="2">Приём проведён</option>
                <option value="3">Приём отменён</option>
                <option value="1">Ожидание приёма</option>
            </select>
        )},
    {field: 'date', headerName: 'Дата'},
    {field: 'time', headerName: 'Время'},
    {field: 'doctor', headerName: 'Специалист', width: 240, sortable: false},
    {field: 'address', headerName: 'Адрес', width: 160, flex: 1},
];
let rows = [];

export default function AdminTable() {
    const [isLoaded, setLoaded] = useState(false);
    const [searchName, setSearchName] = useState("");

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {'Api-Token': global.token, 'cache-control': 'no-cache', 'pragma': 'no-cache'}
        };
        fetch("/api/schedule/get_list?name=" + searchName, requestOptions)
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
                    for (let i = 0; i < schedule.length; i++) {
                        let date = new Date(schedule[i].time);
                        rows.push({
                            id: schedule[i].id,
                            name: schedule[i].name,
                            type: schedule[i].at_home ? 'Вызов врача на дом' : 'Запись на прием',
                            status: schedule[i].status,
                            date: date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(),
                            time: (date.getHours() + 3) + ":" + date.getMinutes() + ((date.getMinutes() < 10) ? "0" : ""),
                            doctor: schedule[i].doctor ? schedule[i].doctor : "-",
                            address: schedule[i].address ? schedule[i].address : "-"
                        });
                    }
                }
                setLoaded(true);
            });
    }, [searchName]);

    return (
        <div className={"AdminTable"}>
            {isLoaded && <div style={{height: "90vh", width: '100%', minWidth: 700}}>
                <div className="searchBox">
                    <input type="text" placeholder={"Поиск по имени"} onChange={(e) => {
                        setSearchName(e.target.value);
                    }
                    }/>
                </div>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={40}
                    rowsPerPageOptions={[40]}
                />
            </div>}
        </div>
    );
}