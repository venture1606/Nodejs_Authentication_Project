module.exports= {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'please log to view resources');
        res.redirect('/users/login');
    }
}