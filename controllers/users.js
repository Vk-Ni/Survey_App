const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render("login", {
                msg: "Please enter your email and password",
                msg_type: "error"
            });
        }

        db.query('select * from user_login where email=?', [email], async (error, result) => {
            console.log(result[0]);
            if (result.length <= 0) {
                return res.status(401).render("login", {
                    msg: "Email or password incorrect",
                    msg_type: "error"
                });
            } else {
                if (!(await bcrypt.compare(password, result[0].Password))) {
                    return res.status(401).render("login", {
                        msg: "Email or password incorrect",
                        msg_type: "error"
                    })

                } else {
                    const User_Id = result[0].User_Id;
                    const User_Admin = result[0].User_admin;
                    const token = jwt.sign({ User_Id: User_Id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    const cookieOptions = {
                        expires:
                            new Date(
                                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                        httpOnly: true,
                    };
                    res.cookie("vivek", token, cookieOptions);
                    if (User_Admin === 'YES') {
                        res.status(200).redirect("/home");
                    }
                    else {
                        res.status(200).redirect("/user");
                    }

                }
            }

        });

    } catch (error) {
        console.log(error);
    }

};
exports.register = (req, res) => {
    console.log(req.body);
    /*
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const confirm_password=req.body.confirm_password;
    res.send("Form Submitted");
    console.log(name);
    console.log(email);*/
    const { name, email, password, confirm_password } = req.body;
    db.query(
        'Select email from user_login where email=?',
        [email],
        async (error, result) => {
            if (error) {
                console.log(error);
            }
            if (result.length > 0) {
                return res.render("register", { msg: "Email id already taken", msg_type: "error" });
            } else if (password !== confirm_password) {
                return res.render("register", { msg: "Password do not match", msg_type: "error" });

            }
            let hashedPassword = await bcrypt.hash(password, 8);
            //console.log(hashedPassword);


            db.query('insert into user_login set ?', { User_Name: name, email: email, password: hashedPassword },
                (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        //console.log(result);
                        return res.render("register", { msg: "User Registration Success", msg_type: "good" });
                    }
                }
            );
        }
    );

};

exports.isLoggedIn = async (req, res, next) => {
    //req.name="Check Login.........";
    //console.log(req.cookies);
    if (req.cookies.vivek) {
        try {
            const decode = await promisify(jwt.verify)(
                req.cookies.vivek,
                process.env.JWT_SECRET
            );
            //console.log(decode);
            db.query("select * from user_login where User_Id=?",
                [decode.User_Id],
                (err, results) => {
                    //console.log(results);
                    if (!results) {
                        return next();
                    }
                    req.user = results[0];
                    return next();

                });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }


};

exports.home = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query("select * from survey_table", (err, rows) => {
            connection.release();
            if (!err) {
                console.log("Good");
                res.render("home", { rows });
            } else {
                console.log("Error in Listing Data " + err);
            }
        });
    });

};
let Survey_id = 0;
let Question_id = 1;
exports.newsurvey = (req, res) => {
    Survey_id++;
    console.log(req.body);
    const { title, cname, date, question_type, Question_value,options } = req.body;
    db.query('insert into Survey set ? ', { survey_id: Survey_id,survey_name: title, survey_creator_name: cname, survey_created_time: date },
        (error, result) => {
            if (error) {
                console.log(error);
            } else {

                return res.render("newsurvey", { msg: "Survey Published", msg_type: "good" });
            }
        }
    );

    let Option_id = 0;
    Question_value.forEach(function(element) {
        db.query('insert into Questions set ? ', { survey_id:Survey_id,question_id:Question_id,question_type: question_type, question: element },
        (error, result) => {
            if (error) {
                console.log(error);
            } else {
                return res.render("newsurvey", { msg: "Question Created", msg_type: "good" });
            }
        }
    );
    let inner=0;
    // options.forEach(function(element,InnerIndex) {
    //     if(InnerIndex >= inner){
    //         db.query('insert into Question_Options set ? ', { survey_id:Survey_id,question_id:Question_id, option_value: element },
    //         (error, result) => {
    //             if (error) {
    //                 console.log(error);
    //             } else {
    //                 return res.render("newsurvey", { msg: "Question Created", msg_type: "good" });
    //             }
    //         }
    //     );Option_id++;
    //     inner++;
    //     }  
    // })
    options.forEach(function(element) {
        db.query('insert into Question_Options set ? ', { survey_id:Survey_id,question_id:Question_id, option_value: element },
        (error, result) => {
            if (error) {
                console.log(error);
            } else {
                return res.render("newsurvey", { msg: "Question Created", msg_type: "good" });
            }
        }
    );Option_id++;
    inner++;
    })
    Question_id++;
    })
};


exports.logout = async (req, res) => {
    res.cookie("vivek", "logout", {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });
    res.status(200).redirect("/");
}