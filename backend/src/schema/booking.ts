import Joi from "joi";

export const bookingBodySchema = Joi.object({
  contactName: Joi.string().required(),
  contactAddress: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  specialInstructions: Joi.string().allow(""),
  bookedDate: Joi.date().iso().required(),
  companyId: Joi.string().required(),
  companyServiceId: Joi.string().required(),
});

export const bookingIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id must be a number",
    "any.required": "Id is required",
  }),
}).options({ stripUnknown: true });
