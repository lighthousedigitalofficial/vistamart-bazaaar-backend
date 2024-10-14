import Joi from "joi";

// Joi validation schema for ShippingMethod
const shippingMethodValidationSchema = Joi.object({
  shippingResponsibility: Joi.string()
    .valid("Inhouse shipping", "Seller wise shipping")
    .default("Inhouse shipping")
    .required()
    .messages({
      "any.required": "Please specify the shipping responsibility",
      "any.only":
        "Shipping responsibility must be one of [Inhouse shipping, Seller wise shipping]",
    }),

  shippingMethodForInhouseDelivery: Joi.string()
    .valid("categoryWise", "orderWise")
    .required()
    .messages({
      "any.required":
        "Please provide the shipping method for in-house delivery",
      "any.only":
        "Shipping method for in-house delivery must be one of [categoryWise, orderWise]",
    }),

  orderWise: Joi.string()
    .optional()
    .custom((value, helpers) => {
      return value;
    }),

  categoryWise: Joi.string()
    .optional()
    .custom((value, helpers) => {
      return value;
    }),
});

export default shippingMethodValidationSchema;
