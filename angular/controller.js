var app = angular.module('myApp', []); // define module for angular
imageWidth = 655;


/**
 * angular controller called 'myCtrl'. Variables and functions that the html can read are placed in $scope.
 */
app.controller('myCtrl', function($scope, $timeout) {

	$scope.topText = "My life is Switzerland";
	$scope.bottomText = "Almost perfect";
	$scope.fontSizeTop = 60;
	$scope.fontSizeBottom = 60;
	$scope.shadowSizeTop = 3;
	$scope.shadowSizeBottom = 3;
	$scope.letterSpacingTop = 0;
	$scope.letterSpacingBottom = 0;
	$scope.upperOrLower = true;
	
	/***
	 * Called when changing the input counters (fontSize, shadowSize, letterSpacing).
	 * It ensures that the height of the meme text are changed in line with the change of the font size
	 */ 
	$scope.syncDashed = function(topBottom) {
		if ($("#dashedCheckbox").is(':checked')) {
			// if checked show dashed border and enable
			$(".resizable").css("border", "1px dashed #bbb").resizable("enable");
		} else {
			// if unchecked make border transparent and disable (also remove a class which makes it visible)			
			$(".resizable").css("border", "1px solid transparent").resizable("disable").removeClass('ui-state-disabled');
		}
		
		if (topBottom == "top"){
			$("#resizableTop").height($scope.fontSizeTop * 1.234567);
		}else if (topBottom == "bottom"){
			$("#resizableBottom").height($scope.fontSizeBottom * 1.234567);
		}
	};
	
	/**
	 * Initialise the top meme text as jQuery 'resizable' and 'draggable'.
	 * On resize - set the font size to 81% of the height of the box.
	 * Set a limit for dragging within the #img element, and make the cursor a hand 
	 */
	$("#resizableTop").resizable({		
		containment : "#img", // don't allow resizing outside of the img		
		handles : 'n, e, s, w, se, sw, ne, nw', // make it resizable by dragging up, right, down, left, and all corners
		resize: function(e,ui) {
			// workaround for a bug when dragging left of the image. This will check if dragging left and if the draggable box is at the edge  of the image, then set the original width (avoid the bug)
			if ( ui.element.data("ui-resizable").axis == "w" ){
				if ( ui.position.left == 0 && ui.originalPosition.left >= ui.position.left ){
					ui.element.css({
						   'left' : 0,
						   'width' : ui.originalSize.width + (ui.originalPosition.left - ui.position.left)
						});
				}
			}
			else{				
				// dragging any other direction should resize the font to 81% of the height (actually this should be done only for n, s, se, sw, ne, nw)
				$scope.fontSizeTop = Math.round(ui.size.height * 0.81);
				$scope.$digest();
			}
		   }
	}).draggable({		
		containment : "#img", // prevent dragging outside of the image
		cursor : "move"	// turn the cursor to a little hand when dragging
	});
	
	/**
	 * Initialise the bottom meme text as jQuery 'resizable' and 'draggable'.
	 * On resize - set the font size to 81% of the height of the box.
	 * Set a limit for dragging within the #img element, and make the cursor a hand 
	 */
	$("#resizableBottom").resizable({		
		containment : "#img", // don't allow resizing outside of the img		
		handles : 'n, e, s, w, se, sw, ne, nw', // make it resizable by dragging up, right, down, left, and all corners
		resize: function(e,ui) {
			// workaround for a bug when dragging left of the image. This will check if dragging left and if the draggable box is at the edge  of the image, then set the original width (avoid the bug)
			if ( ui.element.data("ui-resizable").axis == "w" ){
				if ( ui.position.left == 0 && ui.originalPosition.left >= ui.position.left ){
					ui.element.css({
						   'left' : 0,
						   'width' : ui.originalSize.width + (ui.originalPosition.left - ui.position.left)
						});
				}
			}
			else{
				// dragging any other direction should resize the font to 81% of the height (actually this should be done only for n, s, se, sw, ne, nw)
				$scope.fontSizeBottom = Math.round(ui.size.height * 0.81);
				$scope.$digest();
			}
		   }
	}).draggable({		
		containment : "#img", // prevent dragging outside of the image		
		cursor : "move" // turn the cursor to a little hand when dragging
	});

});


/**
 * jQuery handlers for events
 */
$( document ).ready(function() {
	/**
	 * jQuery to handle onchange, since angular is crap at this
	 */ 
	$("#upload").change(function() {
		var url = this.value;
		var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

		if ( this.files && this.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg") ) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#img').attr('src', e.target.result);
				var image = new Image();
				image.src = e.target.result;
				image.onload = function(e) {
					imageWidth = image.width;
					$('.resizable').css('width', imageWidth - 2 + 'px');
					$('#vodaznak').css('left', imageWidth - 15 + 'px');
				}
			}
			reader.readAsDataURL(this.files[0]);
		} else {
			$('#img').attr('src', '/images/damjan.png');
		}
	});
	
	/**
	 * jQuery to show/hide the dashed lines (actually enable/disable the resizable elements) based on the checkbox
	 */ 
	$("#dashedCheckbox").change(
			function() {
				if (this.checked) {
					// if checked show dashed border and enable
					$(".resizable").css("border", "1px dashed #bbb").resizable("enable");
				} else {
					// if unchecked make border transparent and disable (also remove a class which makes it visible)
					$(".resizable").css("border", "1px solid transparent").resizable("disable").removeClass('ui-state-disabled');
				}
			});
	
	/**
	 * jQuery to handle click of the 'Upload URL button'
	 */
	$("#readUploadUrl").click(function() {
		url = $("#uploadUrl").val();
		$('#img').attr('src', url);
		var image = new Image();
		image.src = url;
		image.onload = function(e) {
			imageWidth = image.width;
			$('.resizable').css('width', imageWidth + 'px'); // set the widht of the meme text = width of image
			$('#vodaznak').css('left', imageWidth - 15 + 'px'); // set the widht of the watermark = 15px less than width of image
		}
	});

	// glorious date at the bottom
	current_year = new Date().getFullYear()
	if (current_year > 2017){
		$("#year").text("2017 - " + current_year);
	}
	else{
		$("#year").text(current_year);
	}
	
// Save would be something like this (using html2canvas.js) --- (work in progress)
//	$("#save").click(function(){
//	html2canvas(document.getElementById('wrapper'), {
//	    onrendered: function(canvas) {
//	    	document.body.appendChild(canvas);
//	    },
//	    width: 800,
//	    height: 700
//	});
//});
	
// Add Box would be something like this --- (work in progress)
//	$("#addBoxBtn").click(function appendText() {
//		var txt1 = "<div class='ui-widget-content resizable' ng-class='{\'upper_case\': upperOrLower}' style='font-size: {{1 + fontSize/10}}em; text-shadow: black -1px 0 {{shadowSize}}px, black 0 1px {{shadowSize}}px, black 1px 0 {{shadowSize}}px, black 0 -1px {{shadowSize}}px; letter-spacing: {{letterSpacing / 10}}em;'>" +
//		"<div class='innerDiv'>{{bottomText}}</div>" +
//		"</div>";
//		$('.resizable').resizable().draggable();
//	//	var txt2 = $("<p></p>").text("Text."); // Create with jQuery
//	//	var txt3 = document.createElement("p"); // Create with DOM
//	//	txt3.innerHTML = "Text.";
//		$("#addedBoxes").append(txt1); // Append the new elements
//	});

});