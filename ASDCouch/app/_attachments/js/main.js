//Boyd Tiffin
//1312 - ASDI

// This checks to see if the page has loaded, then executes the code within
$(function(){


// Pageinit function runs the code inside when that page is called. This is due to jQM and how pages are coded within jQM.

// HOME page and specific functions to run on load
	$('#home').on('pageinit', function(){
		//code needed for home page goes here
	});	

// ADDITEM page and specific functions runnign on load	
	$('#additem').on('pageinit', function(){
		//any other code needed for addItem page goes here
		var myForm = $('#addService'),
			addServiceFormErrorsLink = $('#addServiceFormErrorsLink');
		    myForm.validate({
			    invalidHandler: function(myForm, validator){
				    addServiceFormErrorsLink.click();
		// THis is pulling the added jQM label of required and does not revalidate each time the form is submitted
				    var html = '';
				    for(var key in validator.submitted){
					    var label = $('label[for^="'+ key + '"]').not('[generated]');
					    var legend = label.closest('fieldset').find('.ui-controlgroup-label');
					    var fieldName = legend.length ? legend.text() : label.text();
					    html += '<li>' + fieldName +'</li>';
				    };
				    $("#addServiceFormErrors ul").html(html);
			    },
			    submitHandler: function(){
				    var data = myForm.serializeArray();
				    var key = $('#hiddenKey').attr('data-key');
				    if(!key){
					    storeItem()
				    }else{
					    var key = $('#hiddenKey').attr('data-key');
					    storeItem(key)
				    }
			    }
		    });
	});

// OPTIONS page functions that need to run specific to that page
	$('#options').on('pageinit', function(){
		$("#butClearAll").on("click", function(){
			//Prompt user that this is unrecoverable and get confirmation
			var x = confirm("Clear All Data? This is not reversible");
			if(x){
				// User selected ok, so run the function
				deleteAll();
			}else{
				//User selected CANCEL, prompt and move on
				alert("Data has not been cleared! That was close...");
			}
			
		});
	});	
	
// VIEW ALL RECORDS PAGE
	$('#viewAll').on('pageinit', function(){
		for(var i=0, j=localStorage.length; i<j; i++){
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			// String to Obj
			var obj = JSON.parse(value);
/* 			getImage(createSubList, obj.status[1]); */
			for(var d in obj){
				$('<li>' + obj[d][0]+" " +obj[d][1] + '</li>')
					.appendTo("#allRecordsParent");
			}
			editDeleteLinks(key)
			$('<br /><br />')
				.appendTo("#allRecordsParent");

		}
	// AJAX Requests Start Here
		// JSON FILE
		$("#loadJSON").on("click", function(){
			$.getJSON( "js/json.json", function(data) {
			}).done(function(data){
				// Object now exists called data, this is my JSON Object
				for(var key in data){
					var obj = data[key];
					for(var m in obj){
						$('<li>' + m +" " +obj[m] + '</li>')
							.appendTo("#allRecordsParent");
					}
					$('<br />')
					.appendTo("#allRecordsParent");
				}
			});
		});
		
		//XML FILE
		$("#loadXML").on("click", function(){
			$.get("js/xml.xml", function(data){
				array = $(data).find("Record");
				for(x=0, y=array.length; x<y; x++){
					var loopV = array[x];
					var values = $(loopV).text();
					$('<li>' + values + '</li><br />')
						.appendTo("#allRecordsParent");
				}
			})
		});
	});	
// Function to create the edit and delete links for each record
	var editDeleteLinks = function(key){
		$('<a href="#additem">Edit Item</a>')
			.appendTo("#allRecordsParent")
			.attr('data-key', key )
			.on("click", function(){
				editItem(key);
			});
		//add spaces between edit and delete
		$('<span class="spacer"></span>')
			.html("&nbsp;&nbsp;&nbsp;")
			.appendTo("#allRecordsParent");
		$('<a href="#" >Delete Item</a>')
			.appendTo("#allRecordsParent")
			.attr('data-key', key )
			.on("click", function(){
				deleteItem(key);
			});
	}
	
	
// Below are functions that can be called from any page, everything here needs to be stored as variables so that it is not run everytime a page loads

	var storeItem = function(key){
		if(!key){
			var id = Math.floor(Math.random()*100000001);
		}else{
			id = key;
		}
		// Get all form data in an Object
		var idea = {};
			idea.scTitle = ["Title:", $('#scTitle').val()];
			idea.scDate = ["Service Date:", $('#scDate').val()];
			idea.scCompany = ["Servicer Name:", $('#scCompany').val()];
			idea.scPhone = ["Servicer Phone:", $('#scPhone').val()];
			idea.scWarranty = ["Servicer Warranty?:", $('#scWarranty').val()];
			idea.scWarDate = ["Warranty Expires:", $('#scWarDate').val()];
			idea.scDesc = ["Description:", $('#scDesc').val()];
			// Add Radio Check to get value
		localStorage.setItem(id, JSON.stringify(idea));
		alert("Service Record Logged!");
		window.location="#home";
	};
	
	var editItem = function(key){
		console.log(JSON.parse(localStorage.getItem(key)));
		var itemValue = JSON.parse(localStorage.getItem(key));
		$('#scTitle').val(itemValue.scTitle[1]);
		$('#scDate').val(itemValue.scDate[1]);
		$('#scCompany').val(itemValue.scCompany[1]);
		$('#scPhone').val(itemValue.scPhone[1]);
		$('#scWarranty').val(itemValue.scWarranty[1]);
		$('#scWarDate').val(itemValue.scWarDate[1]);
		$('#scDesc').val(itemValue.scDesc[1]);
		// Change button from Add Record to Edit Record
		$('#subService').val('Edit Record');
		$('#hiddenKey')
			.attr('data-key', key);
	};
	
	var deleteAll = function(){
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}else{
			localStorage.clear();
			alert("All data has been cleared!");
			window.location.reload();
			return false;
		}
	};
	
	var deleteItem = function(key){
		var ask = confirm("Are you sure you want to delete this idea?");
		if(ask){
			localStorage.removeItem(key);
			window.location.reload();
		}else{
			alert("Idea was not deleted, now get to work!")
		}
	};
});