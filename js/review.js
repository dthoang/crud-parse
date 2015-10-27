//Initialize Parse App
var appID = 'gMrBRWKQAjM0wqD7EiNJPRXl8mRk1Wepv93JoMl3';
var jID = 'zdtInzpnas4ueqwOrpnJbW6NU7MqY0ta3jdzYAXK';
Parse.initialize(appID, jID);

// Create a new sub-class of the Parse.Object, with name "Review"
var Review = Parse.Object.extend('Review');


// Click event when form is submitted
$('form').submit(function() {

	// Create a new instance of your Music class 
	var review = new Review();

	// For each input element, set a property of your new instance equal to the input's value
	
	$(this).find('input').each(function(){
		review.set($(this).attr('id'), $(this).val());
		$(this).val('');
	})

	// After setting each property, save your new instance back to your database
	review.save(null, {
		success:getData
	})
	return false
})



// Write a function to get data
var getData = function() {
	

	// Set up a new query for our Review class
	var query = new Parse.Query(Review)

	// Set a parameter for your query -- where the website property isn't missing
	query.notEqualTo('opinion', '')

	/* Execute the query using ".find".  When successful:
	    - Pass the returned data into your buildList function
	*/
	query.find({
		success:function(results) {
			buildList(results)
		} 
	})
}

// A function to build your list
var buildList = function(data) {
	// Empty out your ordered list
	$('ol').empty()

	// Loop through your data, and pass each element to the addItem function
	data.forEach(function(d){
		addItem(d);
	})
}


// This function takes in an item, adds it to the screen
var addItem = function(item) {
	// Get parameters (website, band, song) from the data item passed to the function
	var opinion = item.get('opinion')
	var reviewTitle = item.get('review-title')
	
	/*
	// Append li that includes text from the data item
	var li = $('<li>Check out ' + band + ', their best song is ' + song + '</li>')
	
	// Create a button with a <span> element (using bootstrap class to show the X)
	var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
	
	// Click function on the button to destroy the item, then re-call getData
	button.click(function() {
		item.destroy({
			success:getData
		})
	})

	// Append the button to the li, then the li to the ol
	li.append(button);
	$('ol').append(li) */
	
}

// Call your getData function when the page loads
getData()

