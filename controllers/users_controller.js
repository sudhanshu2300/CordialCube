const User = require('../models/user');
const Friendship = require('../models/friendship')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports.profile = function(req, res) {
    User.findById(req.params.id, function(error, user) {

        if (error) {
            console.log('error in finding the user profile!');
            return;
        }

        let are_friends = false;

        Friendship.findOne({
            $or: [{ from_user: req.user._id, to_user: req.params.id },
                { from_user: req.params.id, to_user: req.user._id }
            ]
        }, function(error, friendship) {
            if (error) {
                console.log('There was an error in finding the friendship', error);
                return;
            }
            if (friendship) {
                are_friends = true;
            }


            return res.render('user_profile', {
                user_name: 'Shashwat Chaturvedi',
                title: 'User Profile',
                profile_user: user,
                are_friends: are_friends

            })
        })
    })
}
module.exports.update = async function(req, res) {
    // if (req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    //         req.flash('success', '😍 Profile Updated')
    //         return res.redirect('back');
    //     })
    // } else {
    //     res.flash('error', 'Unauthorized')
    //     return res.status(401).send('Unauthorized');

    // }
    if (req.user.id == req.params.id) {


        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err) {
                if (err) {
                    console.log('*********Multer Error: ', err);

                }
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {
                    if (user.avatar) {
                        if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                    }

                    // this is saving the path of the uploaded file into the avatar field int the user
                    user.avatar = User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back');

            })

        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        res.flash('error', 'Unauthorized')
        return res.status(401).send('Unauthorized');
    }

}



// render the sign up page

module.exports.signUp = function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/users/profile')
        }
        return res.render('user_sign_up', {
            title: "CordialCube | Sign Up"
        })
    }
    // render the sign in page

module.exports.signIn = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/users/profile')
    }
    return res.render('user_sign_in', {
        title: "CordialCube | Sign In"
    })
}

// get the sign up dates

module.exports.create = function(req, res) {
    // if confirm password and password are same or not
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Password does not Match!..');
        return res.redirect('/users/sign-up');
    }

    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            req.flash('error', 'Error in finding the user from the database')
            return res.redirect('back');
        }

        if (!user) {
            User.create(req.body, function(err, user) {
                if (err) {
                    req.flash('error', 'An error occurred while creating the account!');

                    return res.redirect('back');
                }
                req.flash('success', 'New account created Successfully');

                return res.redirect('/users/sign-in')
            })
        } else {
            req.flash('error', 'User already exists!');
            return res.redirect('back');
        }
    });


}

// sign in and create a session
module.exports.createSession = function(req, res) {

    req.flash('success', 'Logged In Successfully')
    return res.redirect('/');


}

module.exports.destroySession = function(req, res) {
    req.logout();
    req.flash('success', 'You have Logged Out Successfully')

    return res.redirect('/users/sign-in');

}