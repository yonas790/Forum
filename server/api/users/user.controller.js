const {register, getAllUsers, userById, getUserByEmail, profile} = require('./user.service')
const bcrypt = require('bcryptjs')
const pool = require('../../config/database')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
    createUser: (req, res) => {
        const {userName, firstName, lastName, email, password} = req.body
    
        if (!userName || !firstName || !lastName || !email || !password) 
            return res.status(400).json({msg: 'Not all fields have been provided'})
        
        if (password.length < 8)
            return res.status(400).json({msg: 'Password must be at least 8 characters'})
    
        pool.query('SELECT * FROM registration WHERE user_email = ?', [email], (err, result) => {
            if (err) {
                return res.status(500).json({ msg: 'Database connection error' })
            }
            if (result.length > 0) {
                return res.status(409).json({ msg: 'An account with this email already exists' })
            } else {
                const salt = bcrypt.genSaltSync()
                req.body.password = bcrypt.hashSync(password, salt)
    
                register(req.body, (err, result) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({ msg: 'Database connection error' })
                    }
    
                    pool.query('SELECT * FROM registration WHERE user_email = ?', [email], (err, result) => {
                        if (err) {
                            return res.status(500).json({ msg: 'Database connection error' })
                        }
    
                        req.body.userId = result[0].user_id
                        console.log(req.body)
    
                        profile(req.body, (err, result) => {
                            if (err) {
                                console.log(err)
                                return res.status(500).json({ msg: 'Database connection error' })
                            }
    
                            return res.status(200).json({
                                msg: "User added successfully",
                                data: result
                            })
                        })
                    })
                })
            }
        })
    },
    
    getUsers: (req, res) => {
        getAllUsers((err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ msg: "Database connection error" })
            }
            return res.status(200).json({ data: results })
        })
    },

    getUsersById: (req, res) => {
        userById(req.id, (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).json({msg : "database connection error"})
            }
            if (!result) {
                return res.status(404).json({msg: "Record not found"})
            }
            return res.status(200).json({ data: result })
        })
    },

    login: (req, res) => {
        const {email, password} = req.body
        if (!email || !password) 
            return res.status(400).json({msg: "Not all field have been provided"})
        getUserByEmail(email, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ msg: "Database connection error" });
            }
        console.log(results)
            if (!results || !results[0].user_password) {
                return res.status(404).json({ msg: "No account with this email has been registered, or password is missing" });
            }
        
            const isMatch = bcrypt.compareSync(password, results[0].user_password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid Credentials" });
            }

            const token = jwt.sign({ id: results[0].user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return res.json({
                token,
                user: {
                    id: results[0].user_id,
                    display_name: results[0].user_name
                }
            });
        });
        
    }
}

