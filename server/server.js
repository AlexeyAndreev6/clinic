const crypto = require('crypto')
const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')
const fs = require('fs')
const genThumbnail = require('simple-thumbnail')
const path = require("path");
const PORT = process.env.PORT || 8001;

/*
Statuses:
1 - ожидание приёма
2 - приём проведён
3 - приём отменён
 */

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

if (!fs.existsSync("./db_config.json")) {
    fs.copyFile('./server/db_config_sample.json', './db_config.json', (err) => {
        if (err) throw err;
    });
}

function getDbConfig() {
    const data = JSON.parse(fs.readFileSync('./db_config.json'));
    return (data.host === "") ? null : data;
}

function getPull() {
    return mysql.createPool(getDbConfig());
}

function getConnection() {
    return mysql.createConnection(getDbConfig());
}

function closeConnect(db) {
    db.end(function (err) {
        if (err) {
            console.log("Error: " + err.message)
        }
    });
}

function getUser(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(null);
        }
        token = token.trim();
        const db = getConnection();
        db.query('SELECT * FROM users WHERE token = ?', [token], (error, rows) => {
            closeConnect(db);
            if (error) {
                console.log(error);
                reject(null);
            } else {
                if (rows.length) {
                    const row = rows[0];
                    resolve({
                        id: row.id,
                        firstName: row.first_name,
                        lastName: row.last_name,
                        email: row.email,
                        admin: row.admin,
                    });
                } else {
                    reject(null);
                }
            }
        });
    });
}

app.get("/api", (req, res) => {
    res.send(
        "⢀⡴⠑⡄⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n" +
        "⠸⡇⠀⠿⡀⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠀⠀⠀⠑⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆⠀⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢀⢴⣶⣆\n" +
        "⠀⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⠸⣼⡿\n" +
        "⠀⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉⠀⠀⠀⠀⠀\n" +
        "⠀⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀\n" +
        "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉"
    );
});
app.post("/api/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    let db = getConnection();
    db.query('SELECT id, token FROM users WHERE email = ?', [email], (error, rows) => {
        if (error) {
            res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
            closeConnect(db);
        } else {
            if (rows.length) {
                res.send({
                    error: 'Такой email уже есть!',
                    error_code: 'auth_error'
                });
                closeConnect(db);
            } else {
                let token = crypto.randomBytes(64).toString('hex');
                db.query('INSERT INTO users (first_name, last_name, email, password, token) VALUES (?, ?, ?, MD5(?), ?)', [firstName, lastName, email, password, token], (error) => {
                    if (error) {
                        console.log(error);
                        res.send({
                            error: 'Ошибка регистрации!',
                            error_code: 'auth_error'
                        });
                    } else {
                        res.send({
                            token: token
                        });
                    }
                    closeConnect(db);
                });
            }
        }
    });
});
app.post("/api/login", (req, res) => {
    const login = req.body.email;
    const password = req.body.password;

    let db = getConnection();
    db.query('SELECT id, token FROM users WHERE email = ? AND password = MD5(?)', [login, password], (error, rows) => {
        if (error) {
            res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
            closeConnect(db);
        } else {
            if (rows.length) {
                const user_id = rows[0].user_id;
                let token = rows[0].token;
                if (!token) {
                    token = crypto.randomBytes(64).toString('hex');
                    db.query('UPDATE users SET token = ? WHERE id = ?', [token, user_id], (error) => {
                        if (error) {
                            console.log(error)
                        }
                        closeConnect(db);
                    });
                } else {
                    closeConnect(db);
                }
                res.send({
                    token: token,
                    user_id: user_id
                });
            } else {
                res.send({
                    error: 'Неверный логин или пароль!',
                    error_code: 'auth_error'
                });
                closeConnect(db);
            }
        }
    });
});
app.get("/api/login/get_user", (req, res) => {
    const token = req.headers["api-token"];
    getUser(token).then(function (user) {
        if (user) {
            let out = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                admin: user.admin,
                email: user.email
            };
            res.send(out);
        } else {
            res.send({
                error: 'Невалидный токен!',
                error_code: 'token_invalid'
            });
        }
    }).catch(() => res.status(401).send({
        error: 'Невалидный токен!',
        error_code: 'token_invalid'
    }));
});
app.post("/api/schedule/create_new", (req, res) => {
    let userId = req.body.user_id;
    const name = req.body.name;
    const type = req.body.type;
    const doctor = req.body.doctor;
    const phone = req.body.phone;
    const dateTime = req.body.datetime;

    if (!userId) {
        userId = 0;
    }

    const db = getConnection();
    const sql = "INSERT INTO  `schedule`(`user_id`,`name`,`type`,`doctor`,`phone`, `time`) VALUES(?,?,?,?,?,?)";
    db.query(sql, [userId, name, type, doctor, phone, dateTime], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
        } else {
            res.send({schedule_id: results.insertId});
        }
        closeConnect(db);
    });
});
app.post("/api/doctor_at_home/create_new", (req, res) => {
    let userId = req.body.user_id;
    const name = req.body.name;
    const type = req.body.type;
    const phone = req.body.phone;
    const address = req.body.address;
    const dateTime = req.body.datetime;

    if (!userId) {
        userId = 0;
    }

    const db = getConnection();
    const sql = "INSERT INTO  `schedule`(`user_id`,`name`,`type`,`phone`, `time`, `address`, `at_home`) VALUES(?,?,?,?,?,?,1)";
    db.query(sql, [userId, name, type, phone, dateTime, address], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
        } else {
            res.send({private_visit: results.insertId});
        }
        closeConnect(db);
    });
});
app.get("/api/schedule/get_busy", (req, res) => {
    const type = req.query.type;
    const doctor = req.query.doctor;

    const db = getConnection();
    let sql = 'SELECT time FROM schedule WHERE type = ? AND status = 1';
    if(doctor!=="NULL") {
        sql = 'SELECT time FROM schedule WHERE type = ? AND doctor = ? AND status = 1';
    }
    db.query(sql, [type, doctor], (error, rows) => {
        closeConnect(db);
        if (error) {
            res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
        } else {
            res.send({busy_times: rows});
        }
    });
});
app.get("/api/schedule/get_info", (req, res) => {
    const token = req.headers["api-token"];
    getUser(token).then(function (user) {
        if (user) {
            const db = getConnection();
            db.query('SELECT id, type, doctor, phone, time, address, at_home, status FROM schedule WHERE user_id = ? ORDER BY time', [user.id], (error, rows) => {
                closeConnect(db);
                if (error) {
                    res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
                } else {
                    res.send({schedule: rows});
                }
            });
        } else {
            res.send({
                error: 'Невалидный токен!',
                error_code: 'token_invalid'
            });
        }
    }).catch(() => res.status(401).send({
        error: 'Невалидный токен!',
        error_code: 'token_invalid'
    }));
});
app.get("/api/schedule/get_list", (req, res) => {
    const token = req.headers["api-token"];
    const name = req.query.name;
    getUser(token).then(function (user) {
        if(!user.admin) {
            res.send({
                error: 'Недостаточно прав!',
                error_code: 'permission_error'
            });
            return;
        }
        if (user) {
            const db = getConnection();
            let sql = 'SELECT s.id, CONCAT(u.last_name, \' \', u.first_name) AS name, type, doctor, phone, time, address, at_home, status FROM schedule s LEFT JOIN users u on s.user_id = u.id';
            if(name.length>0) {
                sql += ' WHERE u.last_name LIKE '+ db.escape('%' + name + '%');
            }
            sql += ' ORDER BY time';
            db.query(sql, (error, rows) => {
                closeConnect(db);
                if (error) {
                    res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
                } else {
                    res.send({schedule: rows});
                }
            });
        } else {
            res.send({
                error: 'Невалидный токен!',
                error_code: 'token_invalid'
            });
        }
    }).catch(() => res.status(401).send({
        error: 'Невалидный токен!',
        error_code: 'token_invalid'
    }));
});
app.post("/api/schedule/change_status", (req, res) => {
    const token = req.headers["api-token"];
    const scheduleId = req.body.scheduleid;
    const newstatus = req.body.newstatus;
    getUser(token).then(function (user) {
        if(!user.admin) {
            res.send({
                error: 'Недостаточно прав!',
                error_code: 'permission_error'
            });
            return;
        }
        const db = getConnection();
        const sql = "UPDATE schedule SET status = ? WHERE id = ?";
        db.query(sql, [newstatus, scheduleId], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
            } else {
                res.send({result: "OK"});
            }
            closeConnect(db);
        });
    }).catch(() => res.status(401).send({
        error: 'Невалидный токен!',
        error_code: 'token_invalid'
    }));
});
app.post("/api/schedule/cancel", (req, res) => {
    const token = req.headers["api-token"];
    const scheduleId = req.body.scheduleid;
    getUser(token).then(function (user) {
        const db = getConnection();
        const sql = "UPDATE schedule SET status = 3 WHERE id = ?";
        db.query(sql, [scheduleId], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
            } else {
                res.send({result: "OK"});
            }
            closeConnect(db);
        });
    }).catch(() => res.status(401).send({
        error: 'Невалидный токен!',
        error_code: 'token_invalid'
    }));
});

app.get("/api/reviews/get_info", (req, res) => {
    const db = getConnection();
    db.query('SELECT name, date, text FROM reviews ORDER BY date', (error, rows) => {
        closeConnect(db);
        if (error) {
            res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
        } else {
            res.send({reviews: rows});
        }
    });
});

app.post("/api/reviews/send_review", (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const text = req.body.text;

    let now = new Date();
    now = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

    const db = getConnection();
    const sql = "INSERT INTO  `reviews`(`name`,`phone`,`email`,`text`, `date`) VALUES(?,?,?,?,?)";
    db.query(sql, [name, phone, email, text, now], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).send({error: 'Ошибка подключения', error_code: 'connection_error'});
        } else {
            res.send({review_id: results.insertId});
        }
        closeConnect(db);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});