import React, {useEffect, useState} from "react";
import MuiPhoneNumber from "material-ui-phone-number";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import "./DoctorAtHome.css";
import DatePicker, {registerLocale} from "react-datepicker";
import ru from "date-fns/locale/ru";
import {notification} from "antd";
import {setHours, setMinutes} from "date-fns";

registerLocale('ru', ru);

const OrderPage = () => {
    const [startDate, setStartDate] = React.useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("Вызов педиатра");
    const [excludedTimes, setExcludedTimes] = useState([]);

    useEffect(()=>{
        const requestOptions = {
            method: 'GET',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'}
        };
        fetch("/api/schedule/get_busy?type="+selectedType+"&doctor=NULL", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    notification["error"]({
                        message: 'Ошибка',
                        description: data.error,
                    });
                } else {
                    let excluded = [];
                    const times = data.busy_times;
                    for(let i=0; i<times.length; i++) {
                        let date = new Date(times[i].time);
                        excluded.push(setHours(setMinutes(date, date.getMinutes()), date.getHours()+3));
                    }
                    setExcludedTimes(excluded);
                }
            });
    }, [selectedType]);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        let sendData = {};
        formData.forEach((val, key) => {
            sendData[key] = val;
        });
        sendData["datetime"] = startDate.toISOString().slice(0, 19).replace('T', ' ');
        await fetch("/api/doctor_at_home/create_new", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'}
            },
            body: JSON.stringify(sendData)
        }).catch(() => {
            notification["error"]({
                message: 'Ошибка',
                description: "Ошибка подключения",
            });
        })
            .then((res) => {
                res.json().then((data) => {
                    if (data.error) {
                        notification["error"]({
                            message: 'Ошибка',
                            description: data.error,
                        });
                    } else {
                        notification["success"]({
                            message: 'Отправлено!',
                            description: "Заявка принята!",
                        });
                    }
                });
            }).finally(() => {
                setIsLoading(false);
            });
    }

    const filterTime = time => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        if (currentDate.getTime() < selectedDate.getTime())
            return true;
    }

    return (
        <div className="main-div">
            <Box
                component="form"
                sx={{
                    "& .MuiTextField-root": {m: 1, width: "25ch"},
                }}
                noValidate
                autoComplete="off"
                onSubmit={onSubmit}
            >
                <h2>Вызов врача на дом</h2>
                <input type="hidden" name={"user_id"} value={(global.user ? global.user.id : "")}/>
                <div>
                    <TextField required id="outlined-required" name={"name"} label="Имя" value={(global.user ? global.user.firstName + " " + global.user.lastName : "")} />
                </div>
                <div>
                    <MuiPhoneNumber label="Номер телефона" defaultCountry={"ru"} name={"phone"}/>
                    <div className={"dateCustomPicker"}>
                        <label>Выберите время</label>
                        <DatePicker
                            name={"datetime"}
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date)}
                            dateFormat="MMMM d, yyyy hh:mm"
                            showTimeSelect
                            locale="ru"
                            timeFormat="p"
                            timeIntervals={10}
                            minDate={new Date()}
                            excludeTimes={excludedTimes}
                            filterTime={filterTime}
                        />
                    </div>
                    <div>
                        <TextField required id="outlined-required" label="Адрес" name={"address"}/>
                    </div>
                    <div className="select">
                        <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                Выбор услуги
                            </InputLabel>
                            <NativeSelect
                                defaultValue="Вызов педиатра"
                                inputProps={{
                                    name: "type",
                                    id: "uncontrolled-native",
                                }}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value={"Вызов педиатра"}>Вызов педиатра</option>
                                <option value={"Вызов терапевта"}>Вызов терапевта</option>
                                <option value={"Выезд медицинской сестры"}>Выезд медицинской сестры</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div className="submit">
                        <button type="submit" className="btn-sub" disabled={isLoading}>
                            Вызвать врача
                        </button>
                    </div>
                </div>
            </Box>
        </div>
    );
};

export default OrderPage;
