import React, {useEffect, useState} from "react";
import MuiPhoneNumber from "material-ui-phone-number";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./Reviews.css";
import {notification} from "antd";
import {CircularProgress, Container, Grid} from "@material-ui/core";

const Reviews = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [reviewsLoaded, setReviewsLoaded] = useState(true);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {'Api-Token': global.token, 'cache-control': 'no-cache', 'pragma': 'no-cache'}
        };
        fetch("/api/reviews/get_info", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    notification["error"]({
                        message: 'Ошибка',
                        description: data.error,
                    });
                } else {
                    for(let i=0; i<data.reviews.length; i++) {
                        let date = new Date(data.reviews[i].date);
                        data.reviews[i].date = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
                    }
                    setReviews(data.reviews);
                }
                setReviewsLoaded(true);
            });
    }, []);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        let sendData = {};
        formData.forEach((val, key) => {
            sendData[key] = val;
        });
        await fetch("/api/reviews/send_review", {
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
                            description: "Отзыв принят! Спасибо!",
                        });
                        window.location.reload();
                    }
                });
            }).finally(() => {
                setIsLoading(false);
            });
    }

    if (!reviewsLoaded) {
        return (
            <Container maxWidth="md" style={{paddingTop: "20px"}}>
                <Grid container spacing={3} alignItems="center" justifyContent="center">
                    <Grid item>
                        <CircularProgress color="inherit"/>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <div className="main-div">
            <div className="reviewsBox">
                {reviews.map((review) => (
                    <div className="reviewBox">
                        <div className="reviewBody">
                            <div className="reviewTop">
                                <div className="reviewAuthor">
                                    {review.name}
                                </div>
                                <div className="reviewDate">
                                    {review.date}
                                </div>
                            </div>
                            <div className="reviewText">
                                {review.text}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Box
                component="form"
                sx={{
                    "& .MuiTextField-root": {m: 1, width: "25ch"},
                }}
                noValidate
                autoComplete="off"
                onSubmit={onSubmit}
            >
                <h2>Напишите отзыв о нас</h2>
                <div>
                    <TextField required id="outlined-required" label="ФИО" name={"name"}
                               defaultValue={(global.user ? global.user.firstName + " " + global.user.lastName : "")}/>
                </div>
                <div>
                    <MuiPhoneNumber label="Номер телефона" defaultCountry={"ru"} name={"phone"}/>
                    <div>
                        <TextField required id="outlined-required" label="Email" name={"email"}/>
                    </div>
                    <div>
                        <TextField required id="outlined-required" label="Ваше обращение" name={"text"}/>
                    </div>
                    <div className="submit">
                        <button type="submit" className="btn-sub" disabled={isLoading}>
                            Оставить отзыв
                        </button>
                    </div>
                </div>
            </Box>
        </div>
    );
};

export default Reviews;
