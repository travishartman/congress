//script for congressional effectivness

//variables
var margin = { top: 40, right: 10, bottom: 80, left: 0 },
    width = 960 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;

var svg = d3.select('.bubbleDiv').append('svg')
	.attr('class', 'bubbleSvg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); 

//initial value for slider
var CURRENTYEAR;
var INITIAL_YEAR = 1973;
var nestedCongress;
var allCongressYears;
var CONGRESS = [];



var SEATS_TRAVIS = { 
	'93': [ 45, 49, 51, 53, 57, 59, 61, 70 ],
	'94': [ 47, 49, 51, 53, 57, 59, 61, 67 ],
	'95': [ 47, 49, 51, 53, 57, 59, 61, 66 ],
	'96': [ 47, 49, 51, 53, 57, 59, 61, 64 ],
	'97': [ 47, 49, 51, 53, 57, 59, 61, 69 ],
	'98': [ 47, 49, 51, 53, 57, 59, 61, 67 ],
	'99': [ 47, 49, 51, 53, 57, 59, 61, 67 ],
	'100': [ 47, 49, 51, 53, 57, 59, 61, 69 ],
	'101': [ 48, 50, 52, 54, 58, 60, 62, 65 ],
	'102': [ 47, 49, 51, 53, 57, 59, 61, 69 ],
	'103': [ 47, 49, 51, 53, 57, 59, 61, 68 ],
	'104': [ 47, 49, 51, 53, 57, 59, 61, 68 ],
	'105': [ 48, 50, 52, 54, 58, 60, 62, 65 ],
	'106': [ 47, 49, 51, 53, 57, 59, 61, 65 ],
	'107': [ 47, 49, 51, 53, 57, 59, 61, 70 ],
	'108': [ 47, 49, 51, 53, 57, 59, 61, 67 ],
	'109': [ 47, 49, 51, 53, 57, 59, 61, 67 ],
	'110': [ 48, 50, 52, 54, 58, 60, 62, 68 ],
	'111': [ 48, 50, 52, 54, 58, 60, 62, 66 ],
	'112': [ 48, 50, 52, 54, 58, 60, 62, 65 ] 
}

RADIUS_PER_ROW = [
	230,
	260,
	290,
	320,
	350,
	380,
	410,
	440
];

var MAX_SESSIONS = 20;
var MAX_ROWS = 8;
var circlesPerRow = 12;

ARC_CENTER = [width / 2, height - margin.bottom]



// data parse a la Spool
// sets a row and seat number for each represenative per session for entire dataset.
//sets up the matrix for the function addSeatRowandNum to do what it's name says.

var sessions = []
 // console.log(sessions)
for (var i = 0; i < MAX_SESSIONS; i++) {
	sessions[i] = SEATS_TRAVIS[i+93].slice()
	// console.log(sessions[i])
	sessions[i].currentRow = 0;	
}


function addSeatRowAndNum(d) {

	var mySessionSeats = sessions[parseInt(d.congress, 10) - 93];

	var totalRows =  mySessionSeats.length - 1;

	// if (mySessionSeats.currentRow >= mySessionSeats.length) {
	// 	console.error('Too many congressman for # seats')
	// 	return null;
	// }

	if (mySessionSeats.currentRow > totalRows) {
		mySessionSeats.currentRow = 0;
	}

	while (! mySessionSeats[mySessionSeats.currentRow]) {
		mySessionSeats.currentRow++;
	}

	// if (mySessionSeats.currentRow > totalRows) {
	// 	console.log("There are no seats left")
	// }

	d.seatNum = mySessionSeats[mySessionSeats.currentRow]--;
	d.seatRow = mySessionSeats.currentRow++;
	// d.year   = parseDate(d.year.toString());

	// if ( ! mySessionSeats[mySessionSeats.currentRow] ) {
	// 	mySessionSeats.currentRow++;

	return d;
}

function sessions2 (MAX_SESSIONS, SEATS_TRAVIS) {
	var sessionsRedux = []

	for (var i = 0; i < MAX_SESSIONS; i++) {
		sessions[i] = SEATS_TRAVIS[i+93].slice()
		// console.log(MAX_SESSIONS)
		sessions[i].currentRow = 0;	
	};

	return sessionsRedux
};

function addSeatRowAndNum2(d) {

	var mySessionSeats = sessions[parseInt(d.congress, 10) - 93];
	var totalRows =  mySessionSeats.length - 1;

	if (mySessionSeats.currentRow > totalRows) {
		mySessionSeats.currentRow = 0;
	}

	while (! mySessionSeats[mySessionSeats.currentRow]) {
		mySessionSeats.currentRow++;
	}

	d.seatNum = mySessionSeats[mySessionSeats.currentRow]--;
	d.seatRow = mySessionSeats.currentRow++;

	return d;
}


//begin data acquisition and  overall callback



d3.csv("data/congress_sample.csv", function (congress) {
	
	congress.sort(function(x, y) {
		return d3.descending(+x.dem, +y.dem);
	})

	setNav(congress);

	function setNav (d) {
	    $(".btn.view-sort").on("click", function() {
	        currSort = $(this).attr("val");
		    $(".btn.view-sort").removeClass("active");
		    $(this).addClass("active");
		    if (currSort == "les") {
		    	buttonUpdate[currSort](congress);
		    } else if (currSort == "tenure") {
		    	buttonUpdate[currSort](congress);
			} else if (currSort == "party") {
		    	buttonUpdate[currSort](congress);
			}

		});

		congress = congress.map(addSeatRowAndNum2);

	};

	allCongressYears = d3.nest()
		.key (function(d) {
			return d.year;
		}) 
		.map(congress)

	var myArr = [];

	parseCongress(congress);

	function parseCongress(d) {
	   	for (var x in d) { 
	   		var congressArray = d[x];
		     myArr.push({"text" : congressArray.thomas_name + " " + congressArray.year, "value" : "thomas-num-" + congressArray.thomas_num});

		 	};
		}




function test(d) {
console.log(this.value())
	            // 	var thomasNumber = "thomas-num-" + congressArray.thomas_num;
            	// // .filter here
            	// console.log(thomasNumber)
}



    // create ComboBox from input HTML element
    $("#congressSearch").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: myArr,
        filter: "contains",
        suggest: true,
        // index: 3
            change: function (d) {
            	var thomasNumber = this.value();

            	console.log(congress)
            	//apply thomas number to existing class and change to green when selected.  
            	d3.select("." + thomasNumber)
            		.attr("fill", "green")


            	// console.log(this.value())
            	// console.log(congress)

            	// if (this.value == d3.select congress.thomas_num) {
            	// 	visualizeYear(+congress.year)
            	// 	console.log("test")

            		// clickFunction(d, )
            	// }


            	// if (this.text() == d.thomas_name + " " + d.year) {

            	// }
           // alert("value " + this.value() + "   " + "text " + this.text()); 
           // console.log(typeof(this.value()))                     
        }
    });


	// ######################### slider code ##########################

	//grab numbers from year nest for yearly tick values

	congressMagicNumberArray = [];

	for (var i in allCongressYears) { 
		congressMagicNumberArray.push(+i);
	};

	minScale = d3.min(congressMagicNumberArray);
	maxScale = d3.max(congressMagicNumberArray);

	var slider = 
		d3.slider()
		.axis(d3.svg.axis()
			.orient("right")
			.ticks(20)
			.tickFormat(d3.format())
			.tickValues(congressMagicNumberArray)
		)
		.min(minScale)
		.max(maxScale)
		.step(2)
		.on('slide', _.throttle(function (evt, value) {
			visualizeYear(value)/* update */ 

			CURRENTYEAR = value;

		}, 1000))
		.orientation("vertical")

	d3.select('#slider')
		.call(slider);

	visualizeYear(INITIAL_YEAR);



});  // close data callback

buttonUpdate = {

	les: function (congress) {

		congress.sort(function(x, y) {
   			return d3.descending(+x.les, +y.les);
		})

		sessions2(MAX_SESSIONS, SEATS_TRAVIS);
		congress = congress.map(addSeatRowAndNum2);

		allCongressYears = d3.nest()
		.key (function(d) {
			return d.year;
		}) 
		.map(congress)
		
		d3.slider()
			.on('slide', function(evt, value) {
			visualizeYear(value)/* update */ 
			// console.log(value)
		})

		if (CURRENTYEAR == undefined) {
			visualizeYear(INITIAL_YEAR)
		} else {
		visualizeYear(CURRENTYEAR);}

 
	},

	party: function (congress) {

		congress.sort(function(x, y) {
   			return d3.descending(+x.dem, +y.dem);
		})

		sessions2(MAX_SESSIONS, SEATS_TRAVIS);

		congress = congress.map(addSeatRowAndNum2);
		// console.log(congress)

		allCongressYears = d3.nest()
		.key (function(d) {
			return d.year;
		}) 
		.map(congress)

		if (CURRENTYEAR == undefined) {
			visualizeYear(INITIAL_YEAR)
		} else {
		visualizeYear(CURRENTYEAR);}

	},
	tenure: function (congress) {
		congress.sort(function(x, y) {
   			return d3.descending(+x.seniority, +y.seniority);
		})
		sessions2(MAX_SESSIONS, SEATS_TRAVIS);

		congress = congress.map(addSeatRowAndNum2);

		allCongressYears = d3.nest()
		.key (function(d) {
			return d.year;
		}) 
		.map(congress)

		if (CURRENTYEAR == undefined) {
			visualizeYear(INITIAL_YEAR)
		} else {
		visualizeYear(CURRENTYEAR);}
	},

}

function visualizeYear(year){


	yearOfCongress = allCongressYears[year];

	// begin circle draw

	var radiusScale = d3.scale.log()
		.base([5])
		.clamp(true)
		.domain([.2, d3.max(yearOfCongress, function(d) {
			return d.les
		})])
		.range([2, 21]);

	var cy = d3.scale.linear()
		.domain([0, yearOfCongress.length / circlesPerRow])
		.range([0, height])


	var circlesUpdate = svg.selectAll("circle")
		.data(yearOfCongress, function (d) {
			return d.thomas_name
		})  

	//append the data determined circle shapes to the svg
	var circlesEnter = circlesUpdate
		.enter()
		.append("circle")			

	//how the circles enter the world (where they transition FROM)
	circlesEnter
		.attr('r', function (d) {
			return d.les*0;

		})
		// .attr('cx', 1000)

	//how they exist in the world (whhat they transition INTO)
	circlesUpdate
		.attr('fill', function (d) {
			if (d.dem == 1) return "blue"
			else if (d.dem == 0) return "red"
			else return "black"
		})
		.transition()
		.duration(1500)
		.delay(function(d, i) { return i * 5; })

		// .attr('fill', function (d) {
		// 	if (d.dem == 1) return "blue"
		// 	else if (d.dem == 0) return "red"
		// 	else return "black"
		// })
		.attr('fill-opacity', .3 )
		.attr('cx', function(d, i) { 
			return ARC_CENTER[0] - 
			d3.radial.xPosOnArc(d.seatRow, d.seatNum, RADIUS_PER_ROW[d.seatRow], d.congress)
		})
		.attr('cy', function(d, i) { 
			return ARC_CENTER[1] - 
			d3.radial.yPosOnArc(d.seatRow, d.seatNum, RADIUS_PER_ROW[d.seatRow], d.congress )

		})
		.attr('r', function (d) {
				return radiusScale(d.les)
		})
		// .attr("class","circle")
		.attr("class", function (d) {return "circle " + "thomas-num-" + d.thomas_num})
		.attr('id', 'circle');


	//how circles leave the world
	circlesUpdate
		.exit()
		.transition()
		// .attr ("cx", 100)
		.attr('r', 0)
		.attr('fill-opacity', .01)
		.remove()
		.duration(500)

	// isolate single circle, bring to middle, and fade all others




//change click function to use thomas-num class, and
// .filter to find the d object 
// classed 



	// circlesUpdate
	svg.selectAll("circle")
		.data(yearOfCongress, function (d) {
			return d.thomas_name
		}) 
		.on("click", function (d) {
			var thomasNumber = d.thomas_num;
			// var thisForClicks = this;
			// clickFunction(d,thisForClicks);
			// console.log(this)

			d3.event.stopPropagation();
			d3.select(".thomas-num-" + thomasNumber)
			.classed("isolate", true)
			.classed("circle", false)
			.transition()
			.duration(1000)
				.attr('fill-opacity', .5 )
				.attr ("cy",  function (d) {
					return (height / 2)  - (d.les * 10)} )
				.attr ("cx", width / 2)
				.attr('r', function (d) {
					return d.les*10
				});

			// d3.select(".thomas-num-" + test)
			// .classed("circle", false);


			d3.selectAll(".circle")
			.classed("notActive", true)
				.transition()
				.duration(1000)
				
				.attr('fill-opacity', .05);


			d3.select('#singleInfoDiv')
				.style('left', 500 + "px")
				.style('top', 500 + "px") 
				.select('#singleValue')
				.html("<p class = 'bubbleMessageOverall'>" +  d.thomas_name + " " + bubbleParty() + "<br>" + d.year + "<br>" + bubblePassed() + "<br>" +  bubbleLaw() +  "<br>" + bubbleTenure() +  "<br>" + bubbleScore() +"</p>")

			d3.select('#singleInfoDiv').classed("hidden", false);
			

			// #################### Single Info Readout ##################

			function bubbleName() {
				return "<h4 class = 'congressPerson'>" + d.first_name + " " + d.last_name 
			};

			function bubbleParty() {
					 if (d.dem == 1) {return "(D), " + d.st_name ;} 
				else if (d.dem == 0) {return "(R), " + d.st_name ;}
				else if (d.dem == 3) {return "(DPG), " + d.st_name ;}
				else if (d.dem == 4) {return "(RPG), " + d.st_name ;}
				else if (d.dem == 5) {return "(PDP), " + d.st_name ;}
				else if (d.dem == 6) {return "(NPP), " + d.st_name ;}
				else if (d.dem == 7) {return "(ICM), " + d.st_name ;}
			};

			function bubbleTenure() {
				return "<p class = 'bubblePassed'>Terms served: " + d.seniority 
			}

			function bubblePassed() {
				return "<p class = 'bubblePassed'>Bills passed through house: " + d.all_pass 
			}

			function bubbleLaw() {
				return "<p class = 'bubbleLaw'>Laws passed: " + d.all_law
			}

			function bubbleScore() {	
				return "<p class = 'bubbleScore'> LES score: " + Math.round(d.les*100)
			};

			var message =  "<p class = 'bubbleMessageOverall'>" +  bubbleName() + " " + bubbleParty() + "<br>" + bubblePassed() + "<br>" +  bubbleLaw() +  "<br>" + bubbleScore() +"</p>"

			$(".bubbleWords").html(message)
	
	}) 

	//return to full array view
	d3.select("svg")
		.data(yearOfCongress)
		.on("click", function(d) {
			circlesUpdate
			.transition()
			.duration(1000)
			.attr('fill-opacity', .3 )
			.attr('cx', function(d, i) { 
				return ARC_CENTER[0] - 
				d3.radial.xPosOnArc(d.seatRow, d.seatNum, RADIUS_PER_ROW[d.seatRow], d.congress)
			})
			.attr('cy', function(d, i) { 
				return ARC_CENTER[1] - 
				d3.radial.yPosOnArc(d.seatRow, d.seatNum, RADIUS_PER_ROW[d.seatRow], d.congress )

			})
			.attr('r', function (d) {
					return radiusScale(d.les)
			})
			.attr("class", function (d) {return "circle " + "thomas-num-" + d.thomas_num})

		d3.select('#singleInfoDiv').classed("hidden", true);
	})


	// svgspacer margins = margins , + 30 = the sort buttons
	circlesEnter.on("mouseover", function(d) {
		var svgSpacer = margin.top + margin.bottom + 30
		var toolTipDistance = svgSpacer * -0.1
		var xPosition = parseFloat(d3.select(this).attr("cx")) ;
		var yPosition = svgSpacer + parseFloat(d3.select(this).attr("cy")) + toolTipDistance  ;

		// console.log("ypos : " + yPosition + " xpos : " + xPosition)

		d3.select('#tooltip')
			.style('left', xPosition + "px")
			.style('top', yPosition + "px") 
			.select('#value')
			.text(d.thomas_name + " " + bubbleParty())

		d3.select('#tooltip').classed("hidden", false);
		
		function bubbleName() {
			return "<h4 class = 'congressPerson'>" + d.first_name + " " + d.last_name 
		};

		function bubbleParty() {
			if 		(d.dem == 1) {return "(D), "   + d.st_name ;} 
			else if (d.dem == 0) {return "(R), "   + d.st_name ;}
			else if (d.dem == 3) {return "(DPG), " + d.st_name ;}
			else if (d.dem == 4) {return "(RPG), " + d.st_name ;}
			else if (d.dem == 5) {return "(PDP), " + d.st_name ;}
			else if (d.dem == 6) {return "(NPP), " + d.st_name ;}
			else if (d.dem == 7) {return "(ICM), " + d.st_name ;}


		};

		function bubblePassed() {
			return "<p class = 'bubblePassed'>Bills passed through house: " + d.all_pass 
		}

		function bubbleLaw() {
			return "<p class = 'bubbleLaw'>Laws passed: " + d.all_law
		}

		function bubbleScore() {	
			return "<p class = 'bubbleScore'> LES score: " + Math.round(d.les*100)
		};

		var message =  "<p class = 'bubbleMessageOverall'>" +  bubbleName() + " " + bubbleParty() + "<br>" + bubblePassed() + "<br>" +  bubbleLaw() +  "<br>" + bubbleScore() +"</p>"

		$(".bubbleWords").html(message) // mouseover needs to be inside the callback of the mouseover function- otherwise it will not have run by the time message gets called.  reed suggested writing a function to contain the placing of the text into the div, and then placing that funciton inside of the callback.  


	});  //end mouseover

	circlesEnter.on("mouseout", function(){
		d3.select('#tooltip').classed("hidden", true);
	})


} //end visualizeYear

    // create ComboBox from select HTML element

    var fabric = $("#congressSearch").data("kendoComboBox");
	// var select = $("#size").data("kendoComboBox");



	$("#get").click(function() {
	    // alert('Thank you! Your Choice is:\n\nFabric ID: ' + fabric.value() + ' and Size: ' + select.value());
    });


