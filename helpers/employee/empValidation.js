const {check} = require('express-validator');


exports.empLoginValidation = [
    check('department','Please Select Department').not().isEmpty(),
    check('email','Enter valid Email/Employee ID').not().isEmpty(),
    check('password','Password must be 10 Digits!').isLength({
        min:10,
        max:10
    }),

];
exports.empRegisterValidation =[
    check('empID','Enter the Employee Id').not().isEmpty(),
    check('name','Enter the valid name').not().isEmpty(),
    // check('DOB','Date must be in ISO 8601 format (YYYY-MM-DD)').isISO8601().toDate().custom(value => {
    //     const inputDate = new Date(value);
    //     const currentYear = new Date().getFullYear();
    //     const inputYear = inputDate.getFullYear();

    //     if (inputYear > currentYear - 18) {
    //         throw new Error('Date must be at least 18 years old based on the year');
    //     }
    //         return true;
    // }),
    // check('DOJ','Invalid Date of joining').isISO8601().toDate(),
    // check('gender','Select Gender').not().isEmpty(),
    check('department','Select  Department').not().isEmpty(),
    check('teamLeader','Select  Team leader').not().isEmpty(),
    // check('email','Enter a valid email address!').isEmail(),
    check('mobile','Mobile No. should be contains only 10 digits').isLength({
        min:10,
        max:10
    }),
    // check('license','Enter license').not().isEmpty(),
    // check('state','Select  State').not().isEmpty(),
    // check('district','Enter City').not().isEmpty(),

];
exports.addTeamLeaderValidation =[
    check('empID','Enter the valid Team Leader ID').not().isEmpty(),
    check('name','Enter the valid name').not().isEmpty(),
    // check('DOB','Date must be in ISO 8601 format (YYYY-MM-DD)').isISO8601().toDate().custom(value => {
    //     const inputDate = new Date(value);
    //     const currentYear = new Date().getFullYear();
    //     const inputYear = inputDate.getFullYear();

    //     if (inputYear > currentYear - 18) {
    //         throw new Error('Date must be at least 18 years old based on the year');
    //     }
    //         return true;
    // }),
    // check('DOJ','Invalid Date of joining').isISO8601().toDate(),
    // check('gender','Select Gender').not().isEmpty(),
    // check('email','Enter a valid email address!').isEmail(),
    check('mobile','Mobile No. should be contains only 10 digits').isLength({
        min:10,
        max:10
    }),
    // check('license','Enter license').not().isEmpty(),
    check('stateID', 'Select States').not().isEmpty()
];
// exports.assignEmployeeValidation =[
//     check("clientID","Enter the ClientID").not().isEmpty(),
//     check("","Enter the ClientID").not().isEmpty(),

// ]