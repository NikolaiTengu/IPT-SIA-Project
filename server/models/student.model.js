const mongoose = require('mongoose');


const Student = mongoose.Schema(
    {
        idnumber: { type: String, required: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        middlename: { type: String},
        course: { type: String, required: true },
        year: { type: String, required: true },
        
    },

    {
        collection: 'student-data',
    }
);

module.exports = mongoose.model('Student', Student);    