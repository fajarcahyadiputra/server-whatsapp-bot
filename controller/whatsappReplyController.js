const { WaReplies } = require('../models');
const Joi = require('joi');
const { createError } = require('../utils/error');
const { Op } = require('sequelize')

module.exports = {
    index: async (req, res, next) => {
        try {
            let findParams = {
                limit: req.query.limit,
                where: {
                    keyword: {
                        [Op.like]: `%${req.query.q}%`
                    }
                },
                order: [
                    ["keyword", "DESC"]
                ]
            }
            if (!req.query.q) {
                delete findParams.where
            }
            if (!req.query.limit) {
                delete findParams.limit
            }
            const allWaReplies = await WaReplies.findAll(findParams);
            return res.json({
                status: "success",
                data: allWaReplies
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
            let waReplie = await WaReplies.findById(id);
            if (!waReplie) {
                return next(createError(404, 'Whatsapp reply not found'));
            }
            res.json({
                status: "success",
                data: waReplie
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
            let waReplie = await WaReplies.findByPk(id);
            if (!waReplie) {
                return next(createError(404, 'Whatsapp reply not found'));
            }
            await waReplie.destroy();
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
                console.log(req.file);
                requestBody.linkMedia = `${process.env.BASE_URL_IMAGES}/whatsappReply/${req.file.filename}`
            }
            const schema = Joi.object({
                keyword: Joi.string().required(),
                replies: Joi.string().required(),
                type: Joi.string().required(),
                linkMedia: Joi.string().optional()
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
            const newWhatsappRepli = await WaReplies.create(requestBody);
            return res.status(201).json(newWhatsappRepli);
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            const requestBody = req.body;
            if (req.file) {
                console.log(req.file);
                requestBody.linkMedia = `${process.env.BASE_URL_IMAGES}${req.file.filename}`
            }
            const schema = Joi.object({
                keyword: Joi.string().optional(),
                replies: Joi.string().optional(),
                type: Joi.string().optional(),
                linkMedia: Joi.string().optional()
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
            let waReplie = await WaReplies.findByPk(id);
            if (!waReplie) {
                return next(createError(404, 'Whatsapp reply not found'));
            }
            // Object.keys(requestBody).forEach((key) => (WaReplies[key] = requestBody[key]))
            waReplie.set(requestBody);
            waReplie.save();
            return res.status(201).json(waReplie);
        } catch (error) {
            next(error);
        }
    }

}