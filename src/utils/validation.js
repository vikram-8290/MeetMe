const validator = require('validator');

const valdateSignUpData = (req) =>{
    const { firstName, lastName, email, password, age } = req.body;
    const errors = {};

    if (!firstName || !lastName || !email || !password || !age) {
        errors.message = 'All fields are required';
        return { isValid: false, errors };
    }

    if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
        errors.message = 'First name and last name must contain only letters';
        return { isValid: false, errors };
    }

    if (!validator.isEmail(email)) {
        errors.message = 'Invalid email format';
        return { isValid: false, errors };
    }

    if (!validator.isStrongPassword(password)) {
        errors.message = 'Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols';
        return { isValid: false, errors };
    }

    if (!validator.isInt(age.toString(), { min: 0 })) {
        errors.message = 'Age must be a positive integer';
        return { isValid: false, errors };
    }

    return { isValid: true };
}

module.exports = { valdateSignUpData };