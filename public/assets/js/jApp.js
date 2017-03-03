(function () {
	'use strict';
	
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	var date = new Date();
	var currentMonth = months[date.getMonth()]; 
	$('#appMonth').val(currentMonth);

	var getRandomCode = function() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		for( var i=0; i < 8; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}	
	$('#appCode').val(getRandomCode());
	
	
	var firebaseClient = function(onValue){
		// Initialize Firebase
		var config = {
			apiKey: "AIzaSyD8B4OG3rYD2rCa-e8AEPBIEDCwDQBuZfFo",
			authDomain: "new-aapps-fcbea.firebaseapp.com",
			databaseURL: "https://new-aapps-fcbea.firebaseio.com",
			storageBucket: "new-aapps-fcbea.appspot.com",
			messagingSenderId: "7859108908370"
		};
		
		const DEFAULT_PATH = '/';
		
		var mainFirebaseApp = firebase.initializeApp(config);
		console.log(mainFirebaseApp);
		
		var ref = mainFirebaseApp.database().ref(DEFAULT_PATH); 
		
		this.onValue = onValue || function(snapshot) {
			console.log(snapshot.val());
		};
		
		this.onError = function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		};
		
		//ref.on("value", this.onValue, this.onError);
		
		var writeUserData = function (category, month, title, imageUrl) {
		
			firebase.database().ref(DEFAULT_PATH + 'categories/' + category + '/months/' + month).set({
				title: title,
				category: category,
				month: month,
			});
		}
		this.push = function (object, ref, child) {
			// Get a key for a new Post.
			var newPostKey = firebase.database().ref(ref).child(child).push().key;

			// Write the new post's data simultaneously in the posts list and the user's post list.
			var updates = {};
			updates[ref + child + '/' + newPostKey] = object;
			return firebase.database().ref().update(updates);
		}			
		
	};

	var iFirebaseClient = new firebaseClient(function(snapshot){
		console.log(snapshot.val());
		if(snapshot.val() && snapshot.val().length){
			//alert(snapshot.val().length);
		}
	});
	
	
	$('#reviewForm').on('submit', function(e){
		e.preventDefault();
		var formData = {};
		$.each($('#reviewForm').serializeArray(), function(i, field) {
			formData[field.name] = field.value;
		});
		// Validate Category and Month
		if(formData['appCategory'] == undefined || formData['appCategory'] == ''){
			alert('You have to select a Category!');
			$('#appCategory').focus();
		}
		else if(formData['appTitle'] == undefined || formData['appTitle'] == ''){
			alert('You have to Enter Application Title!');
			$('#appTitle').focus();
		}
		else if(formData['appMonth'] == undefined || formData['appMonth'] == ''){
			alert('You have to select a Month!');
			$('#appMonth').focus();
		}
		else {
			iFirebaseClient.push(formData, '/Category/' + formData['appCategory'] + '/Month/' + formData['appMonth'] + '/', 'Apps').then(function(){
				alert('Record Added Successfully!');
				document.getElementById("reviewForm").reset();
				$('#appCode').val(getRandomCode());
				$('#appMonth').val(currentMonth);
			});
		}
	});
})();