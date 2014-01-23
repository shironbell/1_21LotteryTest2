function Game(winner, winnerScore, loser, loserScore){
    this.winner = winner;
    this.winnerScore = winnerScore;
    this.loser = loser;
    this.loserScore = loserScore;
}
    
// Template function for a single game.
var gametpl = function(game) {
    var item = '<li>' +
               '  <div class="game">' +
               '    <span class="winner">' + game.winner + '</span> vs <span class="loser">' + game.loser + '</span>' +
               '    <br>' +
               '    Score: ' + game.winnerScore + ' to ' + game.loserScore +
               '  </div>';
 
    // Only show delete button if the user has write permission on the game.
    var acl = new Kinvey.Acl(game); 
    var user = Kinvey.getActiveUser();
    if (user !== null && acl.getCreator() == user._id && editmode) {
        item += '  <button data-role="button" class="ui-btn ui-btn-danger destroy" data-theme="f" data-id="' + game._id + '">Delete</button>';
    }
    return item + '</li>';
};
  
//Templating function for a single player
var playertpl = function(player) {
    return '<option value="' + player.username + '">' + player.username +'</option>';
};
 
//Logout
$('.logout').on('click', function() {
    var user = Kinvey.getActiveUser();
    if (null !== user){
        Kinvey.User.logout({
            success: function() {
                gamesForm.trigger('submit');
            },
            error: function(e) {
                gamesForm.trigger('submit');
            }
        });
    }
});

/************ login ************/
var loginForm = $('#login_form');
var loginError =  $('#login_error');
loginForm.on('submit', function(e) {
    e.preventDefault();
    loginError.text('');
    
    //flood control
    if(loginForm.hasClass('loading')) {
        return false;
    }
    loginForm.addClass('loading');
    
    var usernameField = loginForm.find('[name="username"]');
    var username = $.trim(usernameField.val());
    //capitalize first char so sorting by name works better :)
    username = username.charAt(0).toUpperCase() + username.slice(1);
    var passwordField = loginForm.find('[name="password"]');
    var password = $.trim(passwordField.val());
            
    Kinvey.User.login(username, password, {
        success: function() {
            loginForm.removeClass('loading');
            usernameField.val(''); //clear fields
            passwordField.val('');
            $.mobile.changePage('#games'); //change to games page
        },
        error: function(error){
            loginForm.removeClass('loading');
            loginError.text('Please enter a valid username and password');
        }
    });
    return false;
});

/************ Register ************/
var registerForm = $('#register_form');
var registerError = $('#register_error');
registerForm.on('submit', function(e) {
  e.preventDefault();
  registerError.text('');
  
  //flood control
  if(registerForm.hasClass('loading')) {
      return false;
  }
  registerForm.addClass('loading');
  
  var usernameField = registerForm.find('[name="username"]');
  var username = $.trim(usernameField.val());
  //capitalize first char so sorting by name works better :)
  username = username.charAt(0).toUpperCase() + username.slice(1);
  var passwordField = registerForm.find('[name="password"]');
  var password = $.trim(passwordField.val());
  
  Kinvey.User.signup({
      username: username,
      password: password,
      isActive: "true"
      }, {
      success: function(user) {
          registerForm.removeClass('loading');
          usernameField.val('');
          passwordField.val('');
          $.mobile.changePage('#games'); //change to games page
      },
      error: function(error) {
          registerForm.removeClass('loading');
          registerError.text(error.description);   
      }
  });
  return false;
});


/************ Add Game ************/

//Populate the select menus with all players
var winnerMenu = $('#winner_menu');
var loserMenu = $('#loser_menu');
$('#add_game').on('pageshow', function() {
  
  var user = Kinvey.getActiveUser();
  if (user === null || !user.isActive){
      addGameError.text('You need to be logged in to submit games.');
      return false;
  }
  addGameError.text('');
  
  //we want only explicit users
  var query = new Kinvey.Query();
  query.equalTo('isActive', 'true'); 
  
  var promise = Kinvey.User.find(query);
  promise.then(function(user_list) {
    var users = user_list.map(playertpl).join('');
    winnerMenu.html(users);
    loserMenu.html(users);
    
    //refresh jQM components
    winnerMenu.selectmenu("refresh");
    loserMenu.selectmenu("refresh");
  });
});
 
//Add a Game
var addGameForm = $('#add_game_form');
var addGameError = $('#add_game_error');
var winnerScoreField = $('#winner_score');
var loserScoreField = $('#loser_score');
addGameForm.on('submit', function(e) {
  e.preventDefault();
  
  var user = Kinvey.getActiveUser();
  if (user === null || !user.isActive){
      addGameError.text('You need to be logged in to submit games.');
      return false;
  }
  
  // Flood protection.
  if(addGameForm.hasClass('loading')) {
    return false;
  }
  addGameForm.addClass('loading');  
 
  // Get form values.
  var winner = $.trim(winnerMenu.val());
  var loser = $.trim(loserMenu.val());
  var winnerScore = $.trim(winnerScoreField.val());
  var loserScore = $.trim(loserScoreField.val());
 
  // Save.
  var game = new Game(winner, winnerScore, loser, loserScore);
  Kinvey.DataStore.save('games', game, {
    success: function(response) {
      // Reset form values.
      winnerScoreField.val('');
      loserScoreField.val('');
 
      addGameForm.removeClass('loading');
      gamesForm.trigger('submit'); //display games upon logging in
      $.mobile.changePage('#games'); //change to games page
    },
    error: function(error) {
      addGameForm.removeClass('loading');
      if (error.debug.debug){
        addGameError.text(error.debug.debug);
      }
      else addGameError.text(error.description);
    }
  });
  return false;
});

/************ Games ************/

//Display games
var gamesForm = $('#games_form');
var gamesError = $('#games_error');
gamesForm.on('submit', function(e) {
    e.preventDefault();
 
    var user = Kinvey.getActiveUser();
    if (user === null || !user.isActive ) {
        gamesError.text('You need to be logged in to view games');
        gamesList.html('');
        return false;
    }
    gamesError.text('');
 
    // Flood protection.
    if(gamesForm.hasClass('loading')) {
        return false;
    }
    gamesForm.addClass('loading');
 
    // Build query.
    var query = new Kinvey.Query();
    var sort = $('#sort').val();
    query.ascending(sort); //sort on either winner or loser
 
    // Pass the query the Games collection, fetch all games and add them to the list.
    Kinvey.DataStore.find('games', query, {
        success: function(game_list) {
            // Display.
            var games = game_list.map(gametpl).join('');
            gamesList.html(games || '<li>No games played :(</li>');
            gamesList.listview("refresh");
            gamesList.find('[data-role="button"]').button();
        
            gamesForm.removeClass('loading');
            if (editmode) editmode = false;
        },
        error: function(error) {
            gamesForm.removeClass('loading');
            if (editmode) editmode = false;
        }
    });
    return false;
});
 
//refresh list of games
$('#games').on('pageshow', function(){
    gamesForm.trigger('submit');
})
 
// Remove a game
var gamesList = $('#games_list');
gamesList.on('click', '.destroy', function(e) {
    e.preventDefault();
 
    // Flood protection.
    if(gamesList.hasClass('loading')) {
        return false;
    }
    gamesList.addClass('loading');
    
    Kinvey.DataStore.destroy('games', $(this).attr('data-id'), {
        success: function() {
            gamesForm.trigger('submit');
            gamesList.removeClass('loading');
        },
        error: function(e) {
            gamesForm.trigger('submit');
            gamesList.removeClass('loading');
        }
    });
  });
 
  var editmode = false; 
  $('#edit_button').on('click', function() {
      editmode = true;
      gamesForm.trigger('submit');
  });