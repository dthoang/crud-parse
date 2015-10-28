$(document).ready(function() {
	//Initialize Parse App
	Parse.initialize('gMrBRWKQAjM0wqD7EiNJPRXl8mRk1Wepv93JoMl3', 'zdtInzpnas4ueqwOrpnJbW6NU7MqY0ta3jdzYAXK');

	// Create a new sub-class of the Parse.Object, with name "Review"
	var Review = Parse.Object.extend('Review');

	var query = new Parse.Query(Review);

	$('#starRate').raty({
		numberMax: 5,
		score: 0
	});

	// Saves new reviewer's data to Parse
	$('form').submit(function() {;
		var review = new Review()

		//Sets up a title for user reviews
		var title = $('#review-title').val();
		review.set('title', title);

		//Sets up user's reviews
		var opinion = $('#opinion').val();
		review.set('opinion', opinion);

		//Sets up values for ratings
		var starRate = $('#starRate').raty('score');
		starRate = Number(starRate);
		review.set('Rating', starRate);

		//For up and down votes
		review.set("upVotes", 0);
		review.set("downVotes", 0);
		
		//Saves and resets the form to leave another review	
		review.save(null, {
            success: function() {
                getData();
            }
        });
        return false
	});

	// Write a function to get data
	var getData = function() {
		//query.notEqualTo('opinion', '')
		//var query = new Parse.Query(Review)
		query.exists('title');
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

		data.forEach(function(d){
			totalRating += d.get('Rating');
			addItem(d);
		});

		$('#avgRate').raty({
			readOnly: true,
			score: totalRating/(data.length)
		})	
	}


	// This function takes in an item, adds it to the screen
	var addItem = function(item) {
		var opinion = item.get('opinion');
		var title = item.get('title');
		var rate = item.get('Rating');
		var upVotes = item.get('upVotes');
		var downVotes = item.get('downVotes');

		var li = $('<li><h3>' + title + '</h3>' + opinion + '</li>');
		var rateInfo = $('</br><p id="rateInfo">Were this reviews helpful?</p>');
		var div = ('<div id="ReviewDiv"></div>');

		//vote up and down buttons and functions
		var downButton = $('<button id="thumbDown" class="button fa fa-thumbs-o-down"></button>');
		var upButton = $('<button id="thumbUp" class ="button fa fa-thumbs-o-up"></button>');

        upButton.click(function() {
            query.get(item.id, {
                success: function(review) {
                    review.increment('upVotes')
                    review.save(null, {
                        success: getData
                    });
                }
            })
        })
        console.log("did it pass yet?")

        downButton.click(function() {
            query.get(item.id, {
                success: function(review) {
                    review.increment('downVotes')
                    review.save(null, {
                        success: getData
                    });
                }
            })
        })

		upButton.appendTo(rateInfo);
		downButton.appendTo(rateInfo);
		var totalVotes = upVotes + downVotes;

		//Creates a button to "destroy" comments, removing them from Parse memory
		var destroyButton = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>');
		destroyButton.click(function() {
			item.destroy({
				success:getData
			})
		})
		destroyButton.appendTo(rateInfo);

		$('ol').append(li);
		$('ol').append(div);
		$('div:last').raty({
		 	readOnly: true,
		 	score: rate
		});
		$('ol').append('<p>');
		$('ol').append(upVotes + " people out of " + totalVotes + " liked this review!");
		$('ol').append(rateInfo);
	};

	// Call your getData function when the page loads
	getData();
});
