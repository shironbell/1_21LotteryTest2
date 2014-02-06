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
	
(function retrieve() {
           var promise = Kinvey.DataStore.find('books', null, {
    success: function(response) {
        ...
    }
});
    
        }());
    



        
});
