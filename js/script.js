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
var INITIAL_VALUE = 1977;


SEATS_PER_ROW = [
	51,
	55,
	56,
	57,
	57,
	58,
	58,
	60
];

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

var circlesPerRow = 12;

ARC_CENTER = [width / 2, height - margin.bottom]



// data parse a la Spool
// sets a row and seat number for each represenative per session for entire dataset.
//sets up the matrix for the function addSeatRowandNum to do what it's name says.


var sessions = []

for (var i = 0; i < MAX_SESSIONS; i++) {
	sessions[i] = SEATS_PER_ROW.slice();
	sessions[i].currentRow = 0;
		

}

// for (var i = 0; i < 20; i++) {
// 	sessions[i] = SEATS_PER_ROW.slice();
// 	sessions[i].currentRow = 0;
// 	console.log(i)
// }

// this function runs directly after import of data below
function addSeatRowAndNum(d) {

//set MySessionSeats equal to sessions(built in above function) sessions[d.congress from data which is the session number of congress x(set to zero, thus the -93)]
	var parseDate = d3.time.format("%Y").parse;

	var mySessionSeats = sessions[parseInt(d.congress, 10) - 93];

	if (mySessionSeats.currentRow >= mySessionSeats.length) {
		console.error('Too many congressman for # seats')
		// removing This congressman from the mix;
		return null;
	}

	d.seatRow = mySessionSeats.currentRow;
	d.seatNum = mySessionSeats[mySessionSeats.currentRow]--;
	// d.year   = parseDate(d.year.toString());
	// console.log(typeof (d.year))

	// console.log(mySessionSeats.currentRow, mySessionSeats[mySessionSeats.currentRow])

	if ( ! mySessionSeats[mySessionSeats.currentRow] ) {
		mySessionSeats.currentRow++;
	}

	return d;
}


// var congress;	
var nestedCongress;
var yearOfCongress;

//begin data acquisition and  overall callback

d3.csv("data/congress_sample.csv", addSeatRowAndNum,
function (congress)
{
	nestedCongress = d3.nest()
		.key (function(d) 
		{
			return d.congress;
		}) //d.congress is the session of congress 
		.map(congress)

	yearOfCongress = d3.nest()
		.key (function(d) 
		{
			return d.year;
			// var total = parseFloat('100,000.00'.replace(/,/g, ''))
		}) //d.year is the year of congress 

		.map(congress)



	congressMagicNumberArray= [];

	for (var i in yearOfCongress) 
	{ 
		congressMagicNumberArray.push(+i);
	};
	// console.log(congressMagicNumberArray
		// )
	minScale = d3.min(congressMagicNumberArray);
	maxScale = d3.max(congressMagicNumberArray);


// d3.slider().value(50).orientation("vertical")

	var slider = d3.slider()
		.axis(d3.svg.axis()
			.orient("right")
			.ticks(20)
			// .tickFormat(d3.time.format("%Y"))
			)
		.min(minScale)
		.max(maxScale)
		.step(2)
		.on('slide', function(evt, value) 
		{
			// console.log(value)
			drive(value)/* update */ 
		})
		.orientation("vertical")


		d3.select('#slider')
		.call(slider);

	drive(INITIAL_VALUE);

	function drive(value){


		myData = yearOfCongress[value];

		var pixelsBetweenCircles = 30;
		var pixelsFromLeft = (width)/5;


		// begin circle draw

		var radiusScale = d3.scale.log()
			.base([5])
			.clamp(true)
			.domain([.2, d3.max(myData, function(d)
			{
				return d.les
			})])
			.range([1, 20]);

		var xScaleOfI = function (d,i) 
		{

			return ((i % circlesPerRow)  * pixelsBetweenCircles) + pixelsFromLeft;
		}

		var yScaleOfI = function (d,i) 
		{
			return ((i % circlesPerRow)  * pixelsBetweenCircles) + pixelsFromLeft;
		}




		var cy = d3.scale.linear()
			.domain([0, myData.length / circlesPerRow])
			.range([0, height])

		var circlesUpdate = svg.selectAll("circle")
			.data(myData, function(d)
			{
				return d.thomas_name
			})  
			//how to manage what is old and new data via the key);

//append the data determined circle shapes to the svg
		var circlesEnter = circlesUpdate
			.enter()
			.append("circle")			

//how the circels enter the world (where they transition FROM)
		circlesEnter
			.attr('r', function (d) 
			{
				return d.les*0;
			})





//how they exist in the world (whhat they transition INTO)
		circlesUpdate
			.transition()
			.duration(2000)
			.attr('fill', function (d) 
			{
				if (d.dem == 1) return "blue"
				else return "red"
			})
			.attr('fill-opacity', .3 )
			//xScaleofi is horizontal distribution
			// // .attr ("cx", xScaleOfI)
			// .attr ("cx", width/2)
			// // .attr ("cy", height/2)
			// .attr ("cy", yScaleOfI)
			.attr('cx', function(d, i)
				{ 
					return ARC_CENTER[0] - d3.radial.xPosOnArc(d.seatRow, d.seatNum, RADIUS_PER_ROW[d.seatRow])
				})
			.attr('cy', function(d, i)
				{ 
					return ARC_CENTER[1] - d3.radial.yPosOnArc(d.seatRow, d.seatNum, RADIUS_PER_ROW[d.seatRow])
				})

			// .attr ("cy", function (d, i) 
			// { 
			// 	return cy (circlesPerRow)/1.75
			// })
			.attr('r', function (d) 
			{
				return radiusScale(d.les);

			})
			.attr('z-index', function (d)
			{
				return (d.les*7)*-1
			})
			

//how they leave the world
		circlesUpdate
			.exit()
			.transition()
			.attr ("cx", 100)
			.attr('r', 0)
			.remove()
			.attr('fill-opacity', .0001)
			.duration(1000)
	// end draw circle

		// transition into circle grid
		circlesUpdate.on("click", function(d) 
		{
			circlesUpdate
				.transition()
				.duration(2000)
				.attr ("cy", yScaleOfI)
				.attr ("cx", function (d, i) 
				{ 
					return cy (Math.floor(i / circlesPerRow ))
				})
				// .attr ("stroke", "black")
				.attr('fill-opacity', .4 )
				.attr('r', function (d) 
				{
					return radiusScale(d.les)*1.2;
				})

		})


		circlesEnter.on("mouseover", function(d)
		{
			function bubbleName() 
			{
				return "<h4 class = 'congressPerson'>" + d.first_name + " " + d.last_name 
			};

			function bubbleParty()
			{
				if (d.dem == 1) {return "(D), " + d.st_name + "</h4>" ;} 
				else {return "(R), " + d.st_name + "</h4>" ;}
			};

			function bubblePassed()
			{
				return "<p class = 'bubblePassed'>Bills passed through house: " + d.all_pass 
			}

			function bubbleLaw() 
			{
				return "<p class = 'bubbleLaw'>Laws passed: " + d.all_law
			}

			function bubbleScore()
			{	
				return "<p class = 'bubbleScore'> LES score: " + Math.round(d.les*100)
			};
			// var congressTitle = "<h3> Congressperson: </h3>"

			var message =  "<p class = 'bubbleMessageOverall'>" +  bubbleName() + " " + bubbleParty() + "<br>" + bubblePassed() + "<br>" +  bubbleLaw() +  "<br>" + bubbleScore() +"</p>"

			$(".bubbleWords").html(message) // mouseover needs to be inside the callback of the mouseover function- otherwise it will not have run by the time message gets called.  reed suggested writing a function to contain the placing of the text into the div, and then placing that funciton inside of the callback.  

		});  //end mouseover

	// end circle grid tanstioin

	}; //end drive

});  // close data callback







	




   // model:
     // for (var candidateId in data.candidates){
     //  var candidate = data.candidates[candidateId];
     //     votecount += results.candidates[candidateId].yes_votes;
     //     statewide.push(candidate.yes_votes);}

   // var message = " name: " + myData[i].thomas_name + " more text if needed";
   // message += " texty part here" + variable + " more text if needed"
     // bubbleWords.html(message);

  //  clear: function(d){
  //   var bubbleWords = $('.bubbleWords');
  //   var clearmessage = " ";
  //   infoBox.html(clearmessage);
  // },



// on enter append the thing.
// thne, 
// on update, do allt heihngs that would happen when it changes.

// d3 has denter and set of dom nodes.
// when data comes in .datawith 
// on enter means when it's not yet made into a dom node. 
