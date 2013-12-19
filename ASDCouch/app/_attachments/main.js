//Boyd Tiffin
//1312 - ASDI

// This checks to see if the page has loaded, then executes the code within
// HOME page and specific functions to run on load
$(document).on('pageinit', '#viewAll', function(){
	$.couch.db("development").view("asdproject/bathroom", {
		success: function(data){
			$('<li data-role="list-divider">Bathroom</li>')
					.appendTo('#allRecordsParent');
				$.each(data.rows, function(index, sr){
					var id = sr.id;
					var srTitle = sr.value.Title;
					$('#allRecordsParent')
						.append(
							$('<li>')
								.append(
									$('<a>')
										.attr({
											href: "records.html?id=" + id,
										})
										.text(srTitle)
								)
						);
				});
			$('#allRecordsParent').listview('refresh');
		}
	});
	$.couch.db("development").view("asdproject/mechanical", {
		success: function(data){
			$('<li data-role="list-divider">Mechanical</li>')
					.appendTo('#allRecordsParent');
				$.each(data.rows, function(index, sr){
					var id = sr.id;
					var srTitle = sr.value.Title;
					$('#allRecordsParent')
						.append(
							$('<li>')
								.append(
									$('<a>')
										.attr({
											href: "records.html?id=" + id,
										})
										.text(srTitle)
								)
						);
				});
			$('#allRecordsParent').listview('refresh');
		}
	});
});

var urlVars = function(urlData){
//	var urlData = $(this).data("url");
	var urlParts = urlData.split('?');
	var urlPairs = urlParts[1].split('&');
	var urlValues = {};
	for (var pair in urlPairs) {
		var keyValue = urlPairs[pair].split('=');
		var key = decodeURIComponent(keyValue[0]);
		var value = decodeURIComponent(keyValue[1]);
		urlValues[key] = value;
	}
	return urlValues;
};
// Individual record display page
$(document).on('pageinit', '#records', function(){
	var id = "";
	var test = urlVars($(this).data("url"));
	newId = test["id"];
	$.couch.db("development").openDoc(newId, {
		success: function(data){
			//display the item specific data
			var id = data._id;
			var rev = data._rev;
			var srTitle = data.Title;
			var srDate = data.srDate;
			var srDesc = data.srDesc;
			var srExpires = data.srExpires;
			var srName = data.srName;
			var srPhone = data.srPhone;
			var srWarranty = data.srWarranty;
			var deleteRecord = {
					_id:id , 
					_rev: rev
			};
			// Display the individual record data as desired
			// Breaking these out individually for future formatting
			$("#recordsParent")
				.append($('<li>')
					.text("Title: "+srTitle)
				)
			.append($('<li>')
					.text("Date of Service: "+srDate)
				)
			.append($('<li>')
					.text("Servicer Name: "+srName)
				)
			.append($('<li>')
					.text("Servicer Phone Number: "+srPhone)
				)
			.append($('<li>')
					.text("Full Description of Work: "+srDesc)
				);
		// Does this item have a warranty with it? Display appro answer.
			if(srWarranty === false){
				$("#recordsParent")
				.append($('<li>')
						.text("No Warranty!")
					)
			}else{
				$("#recordsParent")
				.append($('<li>')
						.text("Warranty expires on: "+srExpires)
			)};
		// Create delete Link
			$("#recordsParent")
			.append("<a href=\"#\" id=\"deleteRecord\" data-role=\"button\">Delete Record</a>");
			$("#deleteRecord").on("click", function(){
				//Prompt user that this is unrecoverable and get confirmation
				var x = confirm("Delete This Record? This is not reversible");
				if(x){
					// User selected ok, so run the function
					$.couch.db("development").removeDoc(deleteRecord, {
					     success: function(data) {
					         alert("Record has been removed");
					    },
					    error: function(status) {
					        alert("The record was not removed, try again later");
					    }
					});
				}else{
					//User selected CANCEL, prompt and move on
					alert("Record has not been cleared! That was close...");
				}
				
			});
		// Create Edit Link
			$("#recordsParent")
			.append("<a data-role=\"button\" href=\"edititem.html?id=" + id + "\">Edit Record</a>");
			// Refresh the view so it looks pretty
			$("#recordsParent").listview('refresh');
		}
	});
});
	
// Add New Record to CouchDB
$(document).on('pageinit', '#additem', function(){
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
			    // Set the object variable for CouchDB
			    var warr = $('#scWarranty').val();
			    if(warr === "false"){
			    	warr = false;
			    };
			    var record = {
			    		Title: $('#scTitle').val(),
			    		srName: $('#scCompany').val(),
			    		srDate: $('#scDate').val(),
			    		srWarranty: warr,
			    		srPhone: $('#scPhone').val(),
			    		srExpires: $('#scWarDate').val(),
			    		srDesc: $('#scDesc').val(),
			    		type: $('#type').val()
			    };
			    // Add item to DB
			    $.couch.db("development").saveDoc(record, {
			        success: function(data) {
			            alert("New Record Saved");
			        },
			        error: function(status) {
			            alert("Record not Saved");
			        }
			    });
		    }
	    });
});
// Edit Item Page
$(document).on('pageinit', '#edititem', function(){
	//If this is a edit record, check to see if the value is in the URL
	var test = urlVars($(this).data("url"));
	newId = test["id"];
	$.couch.db("development").openDoc(newId, {
		success: function(data){
			var parse = JSON.parse(data);
			//Get the item specific data from Couch
			var id = parse._id;
			var rev = parse._rev;
			var editTitle = parse.Title;
			var editDate = parse.srDate;
			var editDesc = parse.srDesc;
			var editExpires = parse.srExpires;
			var editName = parse.srName;
			var editPhone = parse.srPhone;
			var editWarranty = parse.srWarranty;
			var editType = parse.type;
			// Set the values of the fields on the page
			$("#scTitle").val(editTitle);
    		$('#scCompany').val(editName);
    		$('#scDate').val(editDate);
    		$('#scWarranty').val(editWarranty);
    		$('#scPhone').val(editPhone);
    		$('#scWarDate').val(editExpires);
    		$('#scDesc').val(editDesc);
    		$('#type').val(editType);
    		alert(editType);
		}
	});
	//any other code needed for addItem page goes here	
	var myForm = $('#editService'),
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
			    // Set the object variable for CouchDB
			    var warr = $('#scWarranty').val();
			    if(warr === "false"){
			    	warr = false;
			    };
			    var record = {
			    		_id: id,
			    		_rev: rev,
			    		Title: $('#scTitle').val(),
			    		srName: $('#scCompany').val(),
			    		srDate: $('#scDate').val(),
			    		srWarranty: warr,
			    		srPhone: $('#scPhone').val(),
			    		srExpires: $('#scWarDate').val(),
			    		srDesc: $('#scDesc').val(),
			    		type: $('#type').val()
			    };
			    // Add item to DB
			    $.couch.db("development").saveDoc(record, {
			        success: function(data) {
			            alert("New Record Saved");
			        },
			        error: function(status) {
			            alert("Record not Saved");
			        }
			    });
		    }
	    });
});
