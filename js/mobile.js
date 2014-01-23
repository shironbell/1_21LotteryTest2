$(document).ready(function(){

    
// Setup.
  // ------
// Initialize Kinvey.
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
    
 //       (function() {
  // Do a ping to Kinvey whenever the button is clicked.
 //  var button = document.getElementById('ping');
 //  button.addEventListener('click', function() {
 //    var promise = Kinvey.DataStore.save('books', {author  : '1',title : 's'});
 //    promise.then(function(response) {
 //      alert('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
 //    }, function(error) {
 //      alert('Kinvey Ping Failed. Response: ' + error.description);
 //    });
 //  });
 //}());
    
    
    (function() {
// Do a ping to Kinvey whenever the button is clicked.
 
  var button = document.getElementById('ping');
  button.addEventListener('click', function() {
    var promise = Kinvey.DataStore.save('books', {author  : '1',title : 's'});
    promise.then(function(response) {
      alert('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
    }, function(error) {
      alert('Kinvey Ping Failed. Response: ' + error.description);
    });
  });
}());

   
  

promise.then(function() {
    var add = $('#add');
  add.on('submit', function(e) {
    var button = add.find('button').attr('disabled', 'disabled');// Update UI.

    // Retrieve the form data.
    var data = { };
    add.serializeArray().forEach(function(input) {
      data[input.name] = input.value;
    });

    // Add the book.
    status.trigger('loading');
    Kinvey.DataStore.save('books', data).then(function() {
      list.trigger('update');
    }, function(error) {
      status.trigger('error', error); 
    }).then(function() {
      // Restore UI.
      add.trigger('reset');
      button.removeAttr('disabled');
    });

    e.preventDefault();// Stop submit.
  });
  });
    
    
    
    function setupLabel() {
		if ($('.label_check input').length) {
			$('.label_check').each(function(){
				$(this).removeClass('c_on');
			});
			$('.label_check input:checked').each(function(){
				$(this).parent('label').addClass('c_on');
			});
		};
		if ($('.label_radio input').length) {
			$('.label_radio').each(function(){
				$(this).removeClass('r_on');
			});
			$('.label_radio input:checked').each(function(){
				$(this).parent('label').addClass('r_on');
			});
		};
	};
    
    
    

	$(".toggle_container").hide();

	$("p.trigger").click(function(e){
		e.preventDefault();
		$(this).toggleClass("active").next().slideToggle("fast", function() {});
	});

	$('select').customStyle();
	$('select.changeGame').change(function() {
		if (this.value)
			window.location.href = this.value;
	});

	// Works with p.trigger above...
	$('.jumboselect ul li').click(function() {
		var select = $(this).closest('.jumboselect');
		select.find('.trigger').html(this.innerHTML);
		select.find('.toggle_container').hide('fast');
		if (this.dataset) {
			select.find('input').val(this.dataset['id']);
		}
		else {
			select.find('input').val($(this).attr('data-id'));
		}
	});

	$('body').addClass('has-js');
	$('.label_check, .label_radio').click(function(){
		setupLabel();
	});
	setupLabel();

	/**
	 * Are we on the number picker page
	 */
	if ($('section.numberpicker').length > 0) {
		// Variable declaration
		var games = new Array(), number_list = new Array(), current_selection = new Array();
		var last_number_of_games;

		// Create the number panels required
		for (var i in panels) {
			$('.number_pickers').append(create_panel(i));
			setup_numbers(i, panels[i][0]);
			number_list[i] = sequence(panels[i][0]);
		}

		// Optional, shake to quickpick
		if (window.DeviceMotionEvent) {
			var sensitivity = 15, c1 = [0,0,0], c2 = [0,0,0];

			window.addEventListener('devicemotion', function(e) {
				motion_lock = 1;
				c1[0] = e.accelerationIncludingGravity.x;
				c1[0] = e.accelerationIncludingGravity.y;
				c1[0] = e.accelerationIncludingGravity.z;

				var change = Math.abs(c1[0] - c2[0] + c1[1] - c2[1] + c1[2] - c2[2]);
				if (change > sensitivity) {
					$("button.quickpick").click();
				}
				c2 = c1.concat();

			}, false);
		}

		/**
		 * Builds a number panel with the class np_$index
		 *
		 * @param integer index
		 * @return string given panel
		 */
		function create_panel(index) {
			var panel = '<article class="np_container np_' + index + '"><h2>Pick ' + panels[index][1] + ' ' + panels[index][2] + '</h2><ul class="np_selectnumbers">';
			for (var i = 1; i <= 49; i++) {
				panel += '<li class="number_' + i + '"><a href="#">' + i + '</a></li>';
			}
			return panel + '</ul><div class="clear"></div></article>';
		}

		/**
		 * Generate a sequence of numbers from 1 to $max
		 *
		 * @param integer max
		 * @return array (1..$max)
		 */
		function sequence(max) {
			var range = new Array();
			for (var i = 1; i <= max; i++) {
				range[i-1]=i;
			}
			return range;
		}

		/**
		 * Perform a fisher yates shuffle on the passed $list
		 *
		 * @param array list of numbers/sequence
		 * @return array shuffled
		 */
		function fisher_yates_shuffle(list) {
			var i, j, t, r = list.concat(); // Clone...
			for (i = 1; i < r.length; i++) {
				j = Math.floor(Math.random()*(1+i));
				if (j != i) {
					t = r[i];
					r[i] = r[j];
					r[j] = t;
				}
			}
			return r;
		}

		/**
		 * Shuffles the given list and returns a splice of qty size
		 *
		 * @param array list
		 * @param integer qty
		 * @return array
		 */
		function quick_pick(list, qty) {
			return fisher_yates_shuffle(list).splice(0, qty);
		}

		/**
		 * Sets the numbers to an unselected state
		 *
		 * @param integer index which panel
		 * @param integer max numbers after max will be set to .no_number
		 */
		function setup_numbers(index, max) {
			$('.number_pickers .np_' + index + ' a').each(function() {
				if (parseInt(this.innerHTML, 10) <= max) {
					$(this).removeClass('no_number');
				}
				else if (!$(this).hasClass('no_number')) {
					$(this).addClass('no_number');
				}
				$(this).removeClass('number_selected');
			});
		}

		/**
		 * Clears the selected numbers
		 *
		 * @param integer index which panel
		 */
		function clear_selections(index) {
			$('.number_pickers .np_' + index + ' .number_selected').removeClass('number_selected');
		}

		/**
		 * Selects the given numbers
		 *
		 * @param integer index which panel
		 * @param array list what numbers to pick
		 */
		function select_numbers(index, list) {
			clear_selections(index);
			for (var i in list) {
				$('.number_pickers .np_' + index + ' li.number_' + list[i] + ' a').addClass('number_selected');
			}
		}

		function show_game_number_overlay(game_number) {
			$('#number_picker_overlay').show();
			$('#number_picker_overlay').width($('.number_pickers').width());
			$('#number_picker_overlay').height($('.number_pickers').height());
			$('#overlay_game_number').html(game_number);
			setTimeout('$("#number_picker_overlay").hide();', 600)
		}

		/**
		 * Checks number of picked numbers
		 *
		 * Will throw an alert dialog if any panel is not completely picked
		 *
		 * @return boolean all picked
		 */
		  
        function check_current_games() {
			var errs = new Array();
			for (var i in panels) {
				if (typeof current_selection[i] == 'undefined') {
					errs[errs.length] = panels[i][1] + ' ' + panels[i][2];
				}
				else if (current_selection[i].length != panels[i][1]) {
						errs[errs.length] = panels[i][1] + ' ' + panels[i][2];
				}
			}

			if (errs.length > 0) {
				alert('Please pick ' + errs.join(' & '));
				return false;
			}
			return true;
		}

		/**
		 * Boxed game selection
		 */
		$('#boxed,#standard').click(function(e) {
			var standard = this.id == 'standard';
			new_number_of_games = last_number_of_games ? last_number_of_games : (standard ? 1 : 1);
			last_number_of_games = $('#new_count').val();
			$('#new_count').find('option').remove();
			var num_games_to_add = 1;
			if (standard) {
				num_games_to_add = 30;
			}
			for(var i=1; i<=num_games_to_add; i++) {
				$('#new_count').append(
					$('<option></option>').val(i).html(i + ' games')
				);
			}
			var count = $('#new_count').val(new_number_of_games);
			// hack to fix the "customSelect"
			count.next('span').find('span').text(count.find(':selected').text());
			count.find('option' . standard ? '' : ':not(:selected)').css('display', standard ? '' : 'none');
		});

      
		

 
        
		/**
		 * Per game quickpick
		 */
		$("button.quickpick").click(function(e) {
			e.preventDefault();
			for (var i in panels) {
				var qp = quick_pick(number_list[i], panels[i][1]);
				select_numbers(i, qp);
				current_selection[i] = qp;
			}
		});

		/**
		 * Per game reset
		 */
		$("button.reset").click(function(e) {
			e.preventDefault();
			for (var i in panels) {
				clear_selections(i);
                document.getElementById('myText').innerHTML = "Make Your Picks Above"
			}
			current_selection = new Array();
             $("#barcode").JsBarcode("",{width:0,height:0}); 
              document.getElementById('myText').value = "";
            document.getElementById('barcode').value = "";
            document.getElementById('fname').value = "";
            document.getElementById('lname').value = "";        	
           

		});

		/**
		 * Pick a number (toggle)
		 */
		$('.np_selectnumbers a').click(function(e) {
			e.preventDefault();
			var $this = $(this);
			if ($this.hasClass('no_number')) return;

			var parent = $this.closest('.np_container');
			var index = parseInt(parent.attr('class').split(' ')[1].split('_')[1], 10);

			if (!current_selection[index])
				current_selection[index] = new Array();

			if ($(this).hasClass('number_selected')) {
				// Deselecting
				$(this).removeClass('number_selected');
				current_selection[index].splice(current_selection[index].indexOf(parseInt(this.innerHTML, 10)),1);
			}
			else {
				// Selecting provided there aren't already $Picks picked
				if (current_selection[index].length >= panels[index][1]) {
					alert("Maximum number selected");
				}
				else {
					$(this).addClass('number_selected');
					current_selection[index][current_selection[index].length] = parseInt(this.innerHTML, 10);
				}
			}
		});

		/**
		 * Pick your numbers button
		 */
		$('.game_options button.pick').click(function(e) {
			e.preventDefault();

			var picker = $('section.game_picker');
			picker.find('.games .total').html($('#new_count').val());
			$('section.game_options').hide();
			picker.show();
		});

		/**
		 * Per panel next button
		 */
		$('button.next').click(function(e) {
			e.preventDefault();
			// find the current game and check it
			var current_game = parseInt($('.games .current').html(), 10);
            
        //    document.getElementById('myText').innerHTML = current_selection;
            
        //    $("#barcode").JsBarcode("30,22,35,32,17,2",{width:5,height:50});
        //    
       
     

           var data = current_selection;

            var insert_data_in_form =  function(data) {
            var form = $("#add input[type='text']");
            var form_arr = new Array();

            form.each(function(i,elem) {
            console.log(data.length,data[i]);
            $(this).val(data[i]);
                });
            };

            insert_data_in_form(data);

            
            if (!check_current_games()) return;

			// get the total number of games
			var total_game_parts = $('.games .total').html().split(' ');
			var total_games = 1;

            //var total_games = parseInt(total_game_parts[0], 10);

			// show a loading overlay, if this is not the last game
			if (current_game != total_games) {
				show_game_number_overlay(current_game+1);
			}

			// Save the current game
			games[current_game - 1] = current_selection;

			// Last game? lets submit
			if (current_game == total_games) {
				var form = $('form.game_picker_form');
				$('#old_count').val($('#new_count').val());
				for (var n in games) {
					for (var i in panels) {
						for (var p in games[n][i]) {
							form.append('<input type="hidden" name="game' + n + '_set' + i + '_' + p + '" value="' + games[n][i][p] + '">');
						}
					}
				}
				form.submit();
				return;
			}

			// Clear the panel
			$('button.reset').click();
             document.getElementById('myText').value = "";
            document.getElementById('barcode').value = "";
            document.getElementById('fname').value = "";
            document.getElementById('lname').value = "";        	

            
            
            // Load the existing game if available
			if (games[current_game]) {
				current_selection = games[current_game];
				for (var i in panels) {
					select_numbers(i, current_selection[i]);
				}
			}

			// Update the page number
			$('.games .current').html(current_game + 1);
		});

		/**
		 * Per game previous button
		 */
		$('button.prev').click(function(e) {
			e.preventDefault();
			var current_game = parseInt($('.games .current').html(), 10);
			if (current_game == 1) {
				$('section.game_options').show();
				$('section.game_picker').hide();
				return;
			}

			// show a loading overlay
			show_game_number_overlay(current_game-1);

			// Save the current game
			games[current_game - 1] = current_selection;
			$('button.reset').click();

			// Load the previous game
			current_selection = games[current_game - 2];
			for (var i in panels) {
				select_numbers(i, current_selection[i]);
			}
			$('.games .current').html(current_game - 1);
		});

		/**
		 * Quick pick all
		 */
		$('button.quick_pick_all').click(function(e) {
			e.preventDefault();
			var form = $('form.game_picker_form');
			var game_count = $('#new_count').val();

			var game_count_parts = $('#new_count').val().split(' ');
			var game_count = parseInt(game_count_parts[0], 10);

			$('#old_count').val(game_count);

			for (var n = 0; n < game_count; n++) {
				for (var i in panels) {
					var qp = quick_pick(number_list[i], panels[i][1]);
					for (var p in qp) {
						form.append('<input type="hidden" name="game' + n + '_set' + i + '_' + p + '" value="' + qp[p] + '">');
					}
				}
			}
			form.submit();
			return;
		});

		/**
		 * Add to basket - for jackpot lotteries
		 */
		$('button.add_to_basket').click(function(e) {
			var form = $('form.game_picker_form');
			form.submit();
		});

		/**
		 * Basket delete and delete all buttons
		 */
		$('button.delete, li.delete_all_games button').click(function(e) {
			e.preventDefault();
			if (this.dataset) {
				location.href = this.dataset['url'];
			}
			else {
				location.href = $(this).attr('data-url');
			}
		});
	}
    
});
 