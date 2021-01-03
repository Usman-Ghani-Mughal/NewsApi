const Joi = require('@hapi/joi');



// Register Validation
const registerValidation = (data) =>{
    // set scheme for joi
    const validateuserschema = Joi.object().keys({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required(),
        userinterests: Joi.string().min(1).required()
        });    
        return validateuserschema.validate(data);
}

// Login Validation
const loginValidation = (data) =>{
    // set scheme for joi
    const validateuserschema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().min(5).required()
        });    
        return validateuserschema.validate(data);
}



//  APP Register Validation
const appRegisterValidation = (data) =>{
    // set scheme for joi
    const validateuserschema = Joi.object().keys({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required()
        });    
        return validateuserschema.validate(data);
}







// In the end we will move these two validation into other file




// App Login Validation
const appLoginValidation = (data) =>{
    // set scheme for joi
    const validateuserschema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required()
        });    
        return validateuserschema.validate(data);
}



// User Interest Validation
const userInterestValidation = (data) =>{
    if(data.length >= 3)
    {
        return true;
    }
    else
    {
        return false;
    }
}
 

 module.exports.registerValidation = registerValidation; 
 module.exports.loginValidation = loginValidation;
 module.exports.appLoginValidation = appLoginValidation;
 module.exports.appRegisterValidation = appRegisterValidation;
 module.exports.userInterestValidation = userInterestValidation; 