import Joi from "joi";

// Define the schema for companyData
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

  price: Joi.alternatives()
    .try(Joi.array().items(Joi.string()).required(), Joi.string().required())
    .messages({
      "alternatives.match":
        "Please provide the price for each selected service.",
      "array.base": "Price must be an array of strings.",
      "string.base": "Price must be a string.",
    }),

  openingTime: Joi.string().required().messages({
    "any.required": "Opening time is required",
  }),
  closingTime: Joi.string().required().messages({
    "any.required": "Closing time is required",
  }),
  companyDescription: Joi.string().optional().messages({
    "any.required": "Description is required",
  }),

  serviceIds: Joi.alternatives().try(Joi.required()).messages({
    "any.required": "ServiceId is required",
  }),
}).options({
  stripUnknown: true,
});

export const companyupdateSchema = Joi.object({
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
    "array.includesRequiredUnknowns": "Each service ID is required.",
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
    "any.optional": "status is required",
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
