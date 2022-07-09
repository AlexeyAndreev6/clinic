import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    makeStyles,
} from "@material-ui/core";
import {Link, useNavigate} from "react-router-dom";
import "./App.css";
import Routes from "./routes/Routes";
import Modal from "./modal/modal";
import {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {notification} from "antd";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    rightToolbar: {
        flexGrow: 1,
    },
    title: {
        paddingRight: '16px',
        borderRightStyle: 'solid',
        marginRight: theme.spacing(2),
    },
}));

function App() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [modalActive, setModalActive] = useState(false);
    const [needLogin, setNeedLogin] = useState(true);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!global.token) {
            const tokenString = localStorage.getItem('token');
            const userToken = JSON.parse(tokenString || '{}');
            global.token = userToken?.token;
        }

        if (global.token && !global.user) {
            const requestOptions = {
                method: 'GET',
                headers: {'Api-Token': global.token, 'cache-control': 'no-cache', 'pragma': 'no-cache'}
            };
            fetch("/api/login/get_user", requestOptions)
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        if (data.error === "Невалидный токен!") {
                            global.token = null;
                            localStorage.removeItem('token');
                            setNeedLogin(true);
                        }
                        notification["error"]({
                            message: 'Ошибка',
                            description: data.error,
                        });
                    } else {
                        global.user = {
                            id: data.id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            admin: data.admin,
                            email: data.email
                        }
                        setNeedLogin(false);
                    }
                    setLoaded(true);
                    global.loaded = true;
                });
        } else {
            setLoaded(true);
            global.loaded = true;
        }
    });

    const onLogOut = () => {
        localStorage.setItem('token', "{}");
        navigate("/login");
        window.location.reload();
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Поликлиника
                    </Typography>
                    <div className={classes.rightToolbar}>
                        <Button color="inherit" component={Link} to="/">
                            Главная
                        </Button>
                        <Button color="inherit" component={Link} to="/doctors">
                            Список врачей
                        </Button>
                        <Button onClick={() => setModalActive(true)} color="inherit">
                            Запись на прием
                        </Button>
                        <Button color="inherit" component={Link} to="/services">
                            Калькулятор платных услуг
                        </Button>
                        <Button color="inherit" component={Link} to="/docToHome">
                            Вызвать врача на дом
                        </Button>
                        <Button color="inherit" component={Link} to="/reviews">
                            Отзывы
                        </Button>
                    </div>
                    {loaded &&
                        (!needLogin ? (
                        <>
                            <Button color="inherit" component={Link} to="/profile">
                                {global.user.firstName} {global.user.lastName}
                            </Button>
                            <Button color="inherit" component={Link} to="/cab">
                                Личный кабинет
                            </Button>
                            <Button color="inherit" onClick={onLogOut}>
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Логин
                            </Button>
                            <Button color="inherit" component={Link} to="/registration">
                                Регистрация
                            </Button>
                        </>
                    ))}
                </Toolbar>
                <Modal active={modalActive} setActive={setModalActive}/>
            </AppBar>

            <Routes/>


        </div>

    );
}

export default App;
