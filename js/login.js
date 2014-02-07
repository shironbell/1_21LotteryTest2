var promise = Kinvey.init({
    appKey    : "kid_eP6KJe30Ui",
    appSecret : "a0b5a036daa847c2924cd87614bfc213"
});
promise.then(function(activeUser) {
 
var loginForm = $('#login_form');
    
    var usernameField = loginForm.find('[name="username"]');
    var username = $.trim(usernameField.val());
    username = username.charAt(0).toUpperCase() + username.slice(1);
    var passwordField = loginForm.find('[name="password"]');
    var password = $.trim(passwordField.val());
            
    Kinvey.User.login(username, password, {
        success: function() {
            loginForm.removeClass('loading');
            usernameField.val(''); //clear fields
            passwordField.val('');
            $.mobile.changePage('index.html'); //change to games page
        },
        error: function(error){
            loginForm.removeClass('loading');
            loginError.text('Please enter a valid username and password');
        }
    });
    return false;
});    
   });

undefined



