import {Routes, Route, Navigate} from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Registration from "../../pages/Registration";
import Profile from "../../pages/Profile";
import NotFound from "../../pages/NotFound";
import Doctors from "../../pages/Doctors/doctors";
import PrivateRoute from "../components/PrivateRoute";
import GuestRoute from "../components/GuestRoute";
import {
    CircularProgress,
    makeStyles,
    Container,
    Grid,
} from "@material-ui/core";
import Services from "../../pages/services/services";
import DoctorAtHome from "../../pages/DoctorAtHome/DoctorAtHome";
import Reviews from "../../pages/Reviews/Reviews";
import Cabinet from "../../pages/Cabinet/cabinet";
import {useEffect, useState} from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
}));

function AppRoutes() {
    const classes = useStyles();
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        let timeout = setInterval(()=>{
            if(global.loaded) {
                setLoaded(true);
                clearInterval(timeout);
            }
        });
    }, []);

    return loaded ? (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile/>
                    </PrivateRoute>
                }
            />

            <Route
                path="/cab"
                element={
                    <PrivateRoute>
                        <Cabinet/>
                    </PrivateRoute>
                }
            />

            <Route
                path="/login"
                element={
                    <GuestRoute>
                        <Login/>
                    </GuestRoute>
                }
            />

            <Route path="/doctors" element={<Doctors/>}/>

            <Route path="/services" element={<Services/>}/>

            <Route path="/docToHome" element={<DoctorAtHome/>}/>

            <Route
                path="/registration"
                element={
                    <GuestRoute>
                        <Registration/>
                    </GuestRoute>
                }
            />

            <Route path="/reviews" element={<Reviews/>}/>

            <Route path="/not-found-404" element={<NotFound/>}/>
            <Route path="*" element={<Navigate to="/not-found-404"/>}/>
        </Routes>
    ) : (
        <Container maxWidth="md" className={classes.root}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item>
                    <CircularProgress color="inherit"/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default AppRoutes;
