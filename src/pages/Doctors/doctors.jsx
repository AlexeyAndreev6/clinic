import React from 'react';
import DocCard from './DocCard.js'


import {makeStyles} from "@material-ui/core";
import TextField from "@mui/material/TextField";
import "./doctor.css";


const useStyles = makeStyles((theme) => ({
    img: {
        height: 250,
        width: 250,
        marginLeft: `2%`,
    },
    text: {
        textAlign: "center",
    },
    divSearch: {
        marginTop: "2%"
    },
}));

function Doctors() {

    const [doc, setDoc] = React.useState([])
    React.useEffect(() => {
        fetch('https://62761d4dbc9e46be1a12ec26.mockapi.io/doc')
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                setDoc(json);
            })
    }, []);
    const [searchValue, setSearchValue] = React.useState('');
    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    }

    const classes = useStyles();
    return (
        <div className="container">
            <div className={classes.divSearch+" searchBox"}>
                <TextField
                    id="filled-search"
                    label="Поиск по фамилии"
                    type="search"
                    variant="filled"
                    color="secondary"
                    onChange={onChangeSearchInput}
                />
                <TextField
                    id="filled-search"
                    label="Поиск по специальности"
                    type="search"
                    variant="filled"
                    color="secondary"
                    onChange={onChangeSearchInput}
                />
            </div>
            <div className="doctors">
                {doc.filter(doc => doc.name.toLowerCase().includes(searchValue.toLowerCase())).map((obj) => (
                    <DocCard
                        name={obj.name}
                        text={obj.text}
                        imageUrl={obj.imageUrl}
                        staj={obj.staj}
                        obr={obj.obr}
                        obr2={obj.obr2}
                        obr3={obj.obr3}/>
                ))}
            </div>
            <div className="doctors">
                {doc.filter(doc => doc.text.toLowerCase().includes(searchValue.toLowerCase())).map((obj) => (
                    <DocCard
                        name={obj.name}
                        text={obj.text}
                        imageUrl={obj.imageUrl}
                        staj={obj.staj}
                        obr={obj.obr}
                        obr2={obj.obr2}
                        obr3={obj.obr3}/>
                ))}
            </div>
        </div>
    );
}

export default Doctors;
