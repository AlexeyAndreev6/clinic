import {useForm, Controller} from "react-hook-form";
import {
    TextField,
    Grid,
    makeStyles,
    Container,
    Button,
    Typography,
} from "@material-ui/core";
import {yupResolver} from "@hookform/resolvers/yup";
import validationSchema from "./validation";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {notification} from "antd";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    buttonSpacing: {
        marginLeft: theme.spacing(1),
    },
}));

function Login() {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (formData) => {
        setIsLoading(true);
        await fetch("/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
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
                        global.token = data.token;
                        localStorage.setItem('token', JSON.stringify({"token": data.token}));
                        navigate("/");
                        window.location.reload();
                    }
                });
            }).finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Container maxWidth="xs" className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Логин</Typography>
                </Grid>
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    error={Boolean(errors.email?.message)}
                                    fullWidth={true}
                                    type="email"
                                    label="Электронная почта"
                                    variant="filled"
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    error={Boolean(errors.password?.message)}
                                    type="password"
                                    fullWidth={true}
                                    label="Пароль"
                                    variant="filled"
                                    helperText={errors.password?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            Логин
                        </Button>
                        <Button
                            color="inherit"
                            type="submit"
                            className={classes.buttonSpacing}
                            component={Link}
                            to="/registration"
                        >
                            Создать аккаунт
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default Login;
