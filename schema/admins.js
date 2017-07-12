'use strict';
var mongoose = require('mongoose');
// Just add bluebird to your package.json, and then the following line should work
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');

var AdminSchema = new Schema({
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true, select: false},
    first_name: {type: String},
    last_name: {type: String},
    is_admin: {type: Boolean, default: false},
    is_logged_in: {type: Boolean, default: false},
    last_login: {type: Date, default: null},
    is_active: {type: Boolean, default: true}
},{
    timestamps: true
});

AdminSchema.pre('save', function(next){
    var admin = this;
    if(!admin.isModified('password')) return next();
    
    bcrypt.hash(admin.password, null, null, function(err, hash){
        if(err){return next(err);}
        
        admin.password = hash;
        next();
    });
});

AdminSchema.methods.comparePassword = function(password){
    var admin = this;
    
    return bcrypt.compareSync(password, admin.password);
};

module.exports = mongoose.model('Admin', AdminSchema);


