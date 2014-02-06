$(document).ready(function(){
	
	 var promise = Kinvey.init({
    appKey    : 'kid_VeXlW6TPHi',
    appSecret : '896f88d7a9214df0bd174fb4600813c1',
    sync      : { enable: true, online: navigator.onLine }
  }).then(function(activeUser) {
    // Auto-generate the active user if not defined.
    if(null === activeUser) {
      return Kinvey.User.create();
    }
  }).then(null, function(error) {
    status.trigger('error', error);
  });
    
    
	
(function ping() {
        
            var a = current_selection;
            var b = lotto_state;
      var button = document.getElementById('ping');
    
    button.addEventListener('click', function() {
      check_current_games();
    
        if (check_current_games() !== false){
         var promise = Kinvey.DataStore.save('books', {author  : a ,title : b, });
        promise.then(function(response) {
              alert('Your Picks were saved ');
                                         }, 
        function(error) {
              alert('Something went wrong');
                        });
                    }
              });
        }());
    
    
    
        
});
