const {check} = require('express-validator');

exports.clientRegisterValidation = [
    // check('name','Enter the valid name').not().isEmpty(),
    // check('mobile','Mobile No. should be contains only 10 digits').isLength({
    //     min:10,
    //     max:13
    // }),
    // check('stateID','Select  State').not().isEmpty(),
]