import React, {useEffect, useState} from "react";
import "./modal.css";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {isWeekend, setHours, setMinutes} from "date-fns";
import ru from 'date-fns/locale/ru';
import CloseIcon from '@mui/icons-material/Close';
import MuiPhoneNumber from "material-ui-phone-number";
import 'react-toastify/dist/ReactToastify.css';
import {notification} from "antd";

registerLocale('ru', ru);

const Modal = ({active, setActive}) => {
    const data = {
        spec: [
            {name: "Терапевтическое", doctor: ["Зотова Злата Максимовна"]},
            {name: "Травматология", doctor: ["Костромина Виктория Сергеевна"]},
            {name: "Хирургическое", doctor: ["Чернышев Андрей Петрович", "Гараев Никита Александрович"]},
            {name: "Отоларинголог", doctor: ["Власов Роман Викторович"]},
            {name: "Гастроэнтеролог", doctor: ["Зыкина Наталья Владимировна"]}
        ]
    }
    const [selectedspec, setSelectedspec] = useState("");
    const [selecteddoctor, setSelecteddoctor] = useState("");
    const availabledoctor = data.spec.find((c) => c.name === selectedspec);
    const [startDate, setStartDate] = React.useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [excludedTimes, setExcludedTimes] = useState([]);

    const disableWeekends = current => {
        return !isWeekend(current)
    }

    const filterTime = time => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        if (currentDate.getTime() < selectedDate.getTime())
            return true;
    }

    useEffect(()=>{
        if(selectedspec===""||selecteddoctor==="") {
            return;
        }
        const requestOptions = {
            method: 'GET',
            headers: {'cache-control': 'no-cache', 'pragma': 'no-cache'}
        };
        fetch("/api/schedule/get_busy?type="+selectedspec+"&doctor="+selecteddoctor, requestOptions)
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
    }, [selectedspec, selecteddoctor]);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        let sendData = {};
        formData.forEach((val, key) => {
            sendData[key] = val;
        });
        sendData["datetime"] = startDate.toISOString().slice(0, 19).replace('T', ' ');
        await fetch("/api/schedule/create_new", {
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
                        setActive(false);
                    }
                });
            }).finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div
            className={active ? "modal active" : "modal"}
            onClick={() => setActive(false)}
        >
            <div
                className={active ? "modal__content active" : "modal__content"}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="wrapper">
                    <div className='CloseIcon'><CloseIcon className='Close'
                                                          onClick={() => setActive(false)}></CloseIcon></div>
                    <h2>Записаться на прием</h2>
                    <form className="form" onSubmit={onSubmit}>
                        <div className="form-left">
                            <input type="hidden" name={"user_id"} value={(global.user ? global.user.id : "")}/>
                            <div className="name">
                                <label>Имя</label>
                                <input type="text" placeholder="Ваше имя" name={"name"}
                                       defaultValue={(global.user ? global.user.firstName + " " + global.user.lastName : "")}></input>
                            </div>
                            <p></p>
                            <div className="branch">
                                <label>
                                    {" "}
                                    Направление <span> по которому вы хотите записаться</span>{" "}
                                </label>
                                <div className="select">
                                    <div>
                                        <select
                                            name={"type"}
                                            value={selectedspec}
                                            onChange={(e) => setSelectedspec(e.target.value)}
                                        >
                                            <option>Выбрать...</option>
                                            {data.spec.map((value, key) => {
                                                return (
                                                    <option value={value.name} key={key}>
                                                        {value.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <p></p>
                            <div className="direction">
                                <label>
                                    Специалист, <span>к которому вы хотите записаться</span>
                                </label>
                                <div className="select">
                                    <select
                                        name={"doctor"}
                                        value={selecteddoctor}
                                        onChange={(e) => setSelecteddoctor(e.target.value)}
                                    >
                                        <option>Выбрать...</option>
                                        {availabledoctor?.doctor.map((e, key) => {
                                            return (
                                                <option value={e.name} key={key}>
                                                    {e}
                                                </option>
                                            );
                                        })}
                                    </select>

                                </div>
                            </div>
                        </div>
                        <div className="form-right">
                            <div>
                                <label>Номер телефона</label>
                                <MuiPhoneNumber defaultCountry={"ru"} name={"phone"} required/>
                            </div>
                            <div className="pickTime">
                                <label>Выберите время</label>
                                <DatePicker
                                    name={"datetime"}
                                    selected={startDate}
                                    onChange={(date: Date) => setStartDate(date)}
                                    dateFormat="MMMM d, yyyy HH:mm"
                                    showTimeSelect
                                    locale="ru"
                                    timeFormat="p"
                                    timeIntervals={30}
                                    minDate={new Date()}
                                    filterDate={disableWeekends}
                                    filterTime={filterTime}
                                    excludeTimes={excludedTimes}
                                    minTime={setHours(setMinutes(new Date(), 0), 8)}
                                    maxTime={setHours(setMinutes(new Date(), 0), 18)}
                                />
                            </div>
                            <div className="btn-submit">
                                <button type="submit" className="btn-sub" disabled={isLoading}>
                                    Записаться на прием
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Modal;
