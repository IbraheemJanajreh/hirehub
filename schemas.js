const Joi = require('joi');

module.exports.offerSchema = Joi.object({
    offer: Joi.object({
        title: Joi.string().required(),
      //  image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});