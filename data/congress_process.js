// initial attempt to apply Node.js to processing congressional data- apply seating orders for radial array.



//import filesystem module
var fs = require('fs');
var d3 = require('d3')

// set variable "filename" to the  second argument in the process.argv after "node" [0] and .js file "islasho.js" [1]
var filename = process.argv[2];

var margin = { top: 40, right: 10, bottom: 80, left: 0 },
    width = 960 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;


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

ARC_CENTER = [width / 2, height - margin.bottom]



// data parse a la Spool
// sets a row and seat number for each represenative per session for entire dataset.
//sets up the matrix for the function addSeatRowandNum to do what it's name says.


var sessions = []

for (var i = 0; i < MAX_SESSIONS; i++) {
	sessions[i] = SEATS_PER_ROW.slice();
	sessions[i].currentRow = 0;
	// console.log(sessions)	

}



function addSeatRowAndNum(d) {
// console.log(d)
//set MySessionSeats equal to sessions(built in above function) sessions[d.congress from data which is the session number of congress x(set to zero, thus the -93)]
	var mySessionSeats = sessions[parseInt(d.congress, 10) - 93];
// console.log(mySessionSeats)
	if (mySessionSeats.currentRow >= mySessionSeats.length) {
		console.error('Too many congressman for # seats')
		// removing This congressman from the mix;
		//script dies here.  need to increase mySessionSeats.length
		//done and stopped errors but still not reacting to data in callback below.

		return null;
	}

	d.seatRow = mySessionSeats.currentRow;
	d.seatNum = mySessionSeats[mySessionSeats.currentRow]--;
	d.year = +d.year

	// console.log(mySessionSeats.currentRow, mySessionSeats[mySessionSeats.currentRow])

	if ( ! mySessionSeats[mySessionSeats.currentRow] ) {
		mySessionSeats.currentRow++;
	}

	return d;
}

//attempt to load the file *in* the parser and encapsulate in a variable
// var test = d3.csv.parse(fs.readFileSync(filename, 'utf8'), );
// addSeatRowAndNum(test);

// load file, then parse
fs.readFile(filename, 'utf8', 
	function (err, data) {
		//no callback on csv.parse
		// set the function to a var and when the funciton returns data, its captured in the variable. this is a synchronous function, but d3.csv is an ansynch function

		var congress = d3.csv.parse(data, addSeatRowAndNum)
			 // console.log(congress)

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
		console.log(congress)

			// how to get info out of addSeatRowAndNum?
			// console.log(congress);
			
	})//end fs.readfile callback






// data parse a la Spool
// sets a row and seat number for each represenative per session for entire dataset.
//sets up the matrix for the function addSeatRowandNum to do what it's name says.



// // csv-node
// fs.readFile(filename,'utf8', function (err, data){
// 	//breaks into rows and columns
//   csv.parse(data, function(err, data){
//   	//performs transoformations
//     csv.transform(data, function(data){
//     	//console logs with new line seperator and stringfy
//     	 process.stdout.write(data.toString());
//     	 	//maps "value" and then returns it to upper case
// 	      return data.map(function(value){return value.toUpperCase()});

// 	    }, function(err, data){
// 	    	//stringifys it.
// 		csv.stringify(data, function(err, data){

// 		});
//     });
//   });
// });





// fs.readFile(filename,'utf8', function (err, congress) {
//   if (err) throw err;


// 		// addSeatRowAndNum(congress);


// fs.writeFile("processed_congress.csv", congress, function(err) {
//     if(err) {
//         return console.log(err);
//     };

// })
// console.log(congress);




// }); // end readFile callback
