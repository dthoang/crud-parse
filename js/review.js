$(document).ready(function() {
	//Initialize Parse App
	Parse.initialize('gMrBRWKQAjM0wqD7EiNJPRXl8mRk1Wepv93JoMl3', 'zdtInzpnas4ueqwOrpnJbW6NU7MqY0ta3jdzYAXK');

	// Create a new sub-class of the Parse.Object, with name "Review"
	var Review = Parse.Object.extend('Review');

	$('#starRate').raty({
			numberMax: 5
	});


	// Saves reviewer's data to Parse
	$('form').submit(function() {;
		var review = new Review()

		var title = $('#review-title').val();
		review.set('title', title);
		var opinion = $('#opinion').val();
		review.set('opinion', opinion);
		var starRate = $('#starRate').raty('score');
		starRate = Number(starRate);
		review.set('Rating', starRate);

		//For up and down votes
		review.set("upVote", 0);
		review.set("votes", 0);
			
		review.save(null, {
			success:getData
		});
		return false
	});



	// Write a function to get data
	var getData = function() {
		var query = new Parse.Query(Review)
		query.notEqualTo('opinion', '')
		query.find({
			success:function(results) {
				buildList(results)
			} 
		})
	}

	// A function to build your list
	var buildList = function(data) {
		$('ol').empty()
		var totalRating = 0;
		var totalReview = 0;

		data.forEach(function(d){
			addItem(d);
			// totalRating += item.get('starRate');
			// totalReview += 1;
		});
		// $('#avgRate').raty({
		// 	score: totalRating/totalReview,
		// 	readOnly: true
		// });
	}


	// This function takes in an item, adds it to the screen
	var addItem = function(item) {
		var opinion = item.get('opinion');
		var title = item.get('title');
		var div = ('<div id="ReviewDiv"></div>');
		var rate = item.get('Rating');
		
		var li = $('<li><h3>' + title + '</h3>' + opinion + '</li>');
		$('ol').append(li);
		$('ol').append(div);
		$('div:last').raty({
		 	readOnly: true,
		 	score: rate
		});
	}

	// Call your getData function when the page loads
	getData()
});


		/*
		// Create a button with a <span> element (using bootstrap class to show the X)
		var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
		
		// Click function on the button to destroy the item, then re-call getData
		button.click(function() {
			item.destroy({
				success:getData
			})
		})

		li.append(button); */