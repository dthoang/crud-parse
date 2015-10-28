$(document).ready(function() {
	//Initialize Parse App
	Parse.initialize('gMrBRWKQAjM0wqD7EiNJPRXl8mRk1Wepv93JoMl3', 'zdtInzpnas4ueqwOrpnJbW6NU7MqY0ta3jdzYAXK');

	// Create a new sub-class of the Parse.Object, with name "Review"
	var Review = Parse.Object.extend('Review');

	var query = new Parse.Query(Review)

	$('#starRate').raty({
		numberMax: 5
	});

	// Saves new reviewer's data to Parse
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
		review.set("upVotes", 0);
		review.set("downVotes", 0);
			
		review.save(null, {
            success: function() {
                title.val("");
                opinion.val("");
                $("#starRate").raty({
                    score: 0
                });
                getData();
            }
        });
        return false
	});

	// Write a function to get data
	var getData = function() {
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
		var rateInfo = $('<p id="rateInfo"></p>');
		var div = ('<div id="ReviewDiv"></div>');
		
		//vote up and down buttons and functions
		var downVotes = $('<button id="thumbDown" class="button fa fa-thumbs-o-down"></button>');
		var upVotes = $('<button id="thumbUp" class ="button fa fa-thumbs-o-up"></button>');

        upVotes.click(function() {
            query.get(item.id, {
                success: function(review) {
                    review.increment('upVotes')
                    review.save(null, {
                        success: getData
                    });
                }
            })
        })

        downVotes.click(function() {
            query.get(item.id, {
                success: function(review) {
                    review.increment('downVotes')
                    review.save(null, {
                        success: getData
                    });
                }
            })
        })

		upVotes.appendTo(rateInfo);
		downVotes.appendTo(rateInfo);
		var totalVotes = upVotes + downVotes;

		//Creates a button to "destroy" comments, removing them from Parse memory
		var destroyButton = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>');
		destroyButton.click(function() {
			item.destroy({
				success:getData
			})
		})

		destroyButton.appendTo(li);

		$('ol').append(li);
		$('ol').append(div);
		$('div:last').raty({
		 	readOnly: true,
		 	score: rate
		});
		$('ol').append(upVotes + " people out of " + totalVotes + " liked this review!");
		$('ol').append(rateInfo);
	};

	// Call your getData function when the page loads
	getData();
});
