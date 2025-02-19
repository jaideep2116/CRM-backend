const {check} = require('express-validator')


module.remarkValidation = [
    check('clientID', 'Something is Wrong').not().isEmpty(),
    check('remark', 'Write Remark').not(),isEmpty()
]