const {check} = require('express-validator');

exports.homesValidation = [
    check('country','Enter the country name').not().isEmpty(),
    check('state','Select State').not().isEmpty(),
    check('name','Enter the valid name').not().isEmpty(),
    check('whatsApp','Enter the valid whatsApp number').isLength({
        min:10,
        max:13
    }),
    check('cityOrDistrictOrRegion','Enter the valid city name').not().isEmpty(),
]
exports.residentialValidation = [
    check('country','Enter the country name').not().isEmpty(),
    check('name','Enter the valid name').not().isEmpty(),
    check('phone','Enter the valid phone number').isLength({
        min:10,
        max:13
    }),
    check('state','Select valid State').not().isEmpty(),
    check('cityOrDistrictOrRegion','Enter the valid city name').not().isEmpty(),
    check('AGMApprovalStatus','Select AGM approval status').not().isEmpty(),
    check('designation','Select designation').not().isEmpty(),


]

exports.commercialValidation = [
    check('country','Enter the country name').not().isEmpty(),
    check('state','Select valid State').not().isEmpty(),
    check('companyName', 'Enter the valid company name.').not().isEmpty(),
    check('name','Enter the valid name').not().isEmpty(),
    check('phone','Enter the valid phone number').isLength({
        min:10,
        max:13
    }),
    check('cityOrDistrictOrRegion','Enter the valid the city, District or Region name').not().isEmpty(),
    check('typesOfProperty','Enter the valid Properties types').not().isEmpty(),
]

exports.pmkusumValidation = [
    check('name','Enter the valid name').not().isEmpty(),
    check('phone','Enter the valid phone number').isLength({
        min:10,
        max:13
    }),
    check('cityOrDistrictOrRegion','Enter the valid the city, District or Region name').not().isEmpty(),
    check('pmKusumOptions', 'Select any one PM Kusum Options').not().isEmpty(),
]

exports.distributorValidation = [
    check('name','Enter the valid name').not().isEmpty(),
    check('phone','Enter the valid phone number').isLength({
        min:10,
        max:13
    }),
    check('cityOrDistrictOrRegion','Enter the valid the city, District or Region name').not().isEmpty(),
    check('state','Select valid State').not().isEmpty(),
    check('yearsInBusiness', 'Enter the Business starting years').isLength({
        min:4,
        max:12
    }),
    check("dealershipInterest", "Select Dealership").not().isEmpty(),
    check("productOfInterest", "Select interested products list").not().isEmpty(),
    check("estimatedInvestment", "Enter the valid Estimated Investment.").not().isEmpty()
]

exports.contactValidation = [
    check('country','Enter the country name').not().isEmpty(),
    check('state','Select valid State').not().isEmpty(),
    check('name','Enter the valid name').not().isEmpty(),
    check('phone','Enter the valid phone number').isLength({
        min:10,
        max:13
    }),
    check('cityOrDistrictOrRegion','Enter the valid the city, District or Region name').not().isEmpty(),
    check("solarFor", "Select the Solar type of requirement.").not().isEmpty()

]