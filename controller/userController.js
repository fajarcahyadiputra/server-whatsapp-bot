const { User } = require('../models');
const Joi = require('joi');
const { createError } = require('../utils/error');
const { Op } = require('sequelize')
let sequelize = require('sequelize');
const bcrypt = require('bcrypt');
// let t = new sequelize.Transaction();

module.exports = {
    index: async (req, res, next) => {
        try {
            let findParams = {

                limit: req.query.limit,
                where: {
                    [Op.or]: {
                        email: {
                            [Op.like]: `%${req.query.q}%`
                        },
                        name: {
                            [Op.like]: `%${req.query.q}%`
                        }
                    }
                },
                order: [
                    ["id", "DESC"]
                ]
            }
            if (!req.query.q) {
                delete findParams.where
            }
            if (!req.query.limit) {
                delete findParams.limit
            }
            const users = await User.findAll(findParams);
            return res.json({
                status: "success",
                data: users
            });
        } catch (error) {
            next(error)
        }
    },
    getDetail: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) {
                return next(createError(404, 'id is required'));
            }
            let user = await User.findByPk(id);
            if (!user) {
                return next(createError(404, 'User not found'));
            }
            res.json({
                status: "success",
                data: user
            });
        } catch (error) {
            next(error)
        }
    },
    destroy: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) {
                return next(createError(404, 'id is required'));
            }
            let user = await User.findByPk(id);
            if (!user) {
                return next(createError(404, 'User reply not found'));
            }
            await user.destroy();
            res.json({
                status: "success",
                message: "deleted"
            });
        } catch (error) {
            next(error)
        }
    },
    store: async (req, res, next) => {
        try {
            const requestBody = req.body;
            if (req.file) {
                requestBody.picture = `${process.env.BASE_URL_IMAGES}/users/${req.file.filename}`
            } else {
                requestBody.picture = null;
            }
            const schema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
                isActive: Joi.string().optional(),
                picture: Joi.any().optional()
            })
            const { error, value } = schema.validate(requestBody, { abortEarly: false });
            if (error) {
                let responseError = error.details?.map(err => {
                    return {
                        code: "field_required",
                        message: err.message.replace(/[[\]"']/g, ''),
                        detail: err.message.replace(/[[\]"']/g, '')
                    }
                })
                return next(createError(400, responseError))
            }
            let isEmailDuplicat = await User.findOne({
                where: {
                    email: requestBody.email
                }
            })
            if (isEmailDuplicat) {
                return next(createError(400, 'Email is duplicat'))
            }
            let salt = await bcrypt.genSalt(10);
            requestBody.password = await bcrypt.hash(requestBody.password, salt);
            const newUser = await User.create(requestBody);
            return res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            const requestBody = req.body;
            if (req.file) {
                requestBody.picture = `${process.env.BASE_URL_IMAGES}${req.file.filename}`
            }
            const schema = Joi.object({
                name: Joi.string().optional(),
                email: Joi.string().optional(),
                password: Joi.string().optional(),
                isActive: Joi.string().optional()
            })
            const { error, value } = schema.validate(requestBody, { abortEarly: false });
            if (error) {
                let responseError = error.details?.map(err => {
                    return {
                        code: "field_required",
                        message: err.message.replace(/[[\]"']/g, ''),
                        detail: err.message.replace(/[[\]"']/g, '')
                    }
                })
                return next(createError(400, responseError))
            }
            let user = await User.findByPk(id);
            if (!user) {
                return next(createError(404, 'User not found'));
            }
            // Object.keys(requestBody).forEach((key) => (users[key] = requestBody[key]))
            user.set(requestBody);
            await user.save();
            // console.log(requestBody);
            // await User.update(requestBody, {
            //     where: {
            //         id
            //     }
            // })
            // console.log(user);
            return res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

}