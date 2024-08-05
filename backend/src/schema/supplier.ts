import Joi from "joi";

const jsonArrayStringValidator = (value: any, helpers: any) => {
  try {
    const parsedValue = JSON.parse(value);
    if (
      Array.isArray(parsedValue) &&
      parsedValue.length > 0 &&
      parsedValue.every(
        (item) => typeof item === "string" && item.trim() !== ""
      )
    ) {
      return parsedValue;
    } else {
      return helpers.error("any.invalid");
    }
  } catch (err) {
    return helpers.error("any.invalid");
  }
};

export const companyBodySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must contain only digits",
      "any.required": "Phone number is required",
    }),
  address: Joi.string().required().messages({
    "any.required": "Address is required",
  }),
  location: Joi.string().required().messages({
    "any.required": "Location is required",
  }),
  categoryId: Joi.string().required().messages({
    "any.required": "Please select a category",
  }),
  openingTime: Joi.string().required().messages({
    "any.required": "Opening time is required",
  }),
  closingTime: Joi.string().required().messages({
    "any.required": "Closing time is required",
  }),
  companyDescription: Joi.string().optional(),
  serviceIds: Joi.string()
    .custom(jsonArrayStringValidator)
    .required()
    .messages({
      "any.invalid": "Please select atleast one service",
      "any.required": "Service IDs are required.",
    }),
  price: Joi.string().custom(jsonArrayStringValidator).required().messages({
    "any.invalid": "Please provide a price for each selected service.",
    "any.required": "Prices are required.",
  }),
}).options({
  stripUnknown: true,
});

export const companyUpdateSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  phoneNumber: Joi.string().required().messages({
    "any.required": "Phone number is required",
  }),
  address: Joi.string().required().messages({
    "any.required": "Address is required",
  }),
  location: Joi.string().required().messages({
    "any.required": "Location is required",
  }),

  serviceIds: Joi.array().items(Joi.string().required()).required().messages({
    "array.includesRequiredUnknowns": "Services cant be empty.",
  }),

  price: Joi.array().items(Joi.string().required()).required().messages({
    "array.includesRequiredUnknowns":
      "Please provide the price for each selected service.",
  }),
  openingTime: Joi.string().required().messages({
    "any.required": "Opening time is required",
  }),
  closingTime: Joi.string().required().messages({
    "any.required": "Closing time is required",
  }),
  photo: Joi.any().optional().messages({
    "any.optional": "Photo is optional",
  }),

  isActive: Joi.boolean().optional().messages({
    "any.optional": "Status is optional",
  }),
  description: Joi.array().items(Joi.string().optional()).optional().messages({
    "array.items": "Description is optional",
  }),
}).options({
  stripUnknown: true,
});

export const companyIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "any.required": "Id is required",
    "number.base": "It must be a number",
  }),
}).options({ stripUnknown: true });
