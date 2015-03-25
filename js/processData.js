
//read in csv
//process data
//output csv

var sessions = []

for (var i = 0; i < MAX_SESSIONS; i++) {
	sessions[i] = SEATS_PER_ROW.slice();
	sessions[i].currentRow = 0;
}


// this function runs on import of data below
function addSeatRowAndNum(d) {

	var mySessionSeats = sessions[parseInt(d.congress, 10) - 93];

	if (mySessionSeats.currentRow >= mySessionSeats.length) {
		console.error('Too many congressman for # seats')
		// removing This congressman from the mix;
		return null;
	}

	d.seatRow = mySessionSeats.currentRow;
	d.seatNum = mySessionSeats[mySessionSeats.currentRow]--;

	if ( ! mySessionSeats[mySessionSeats.currentRow] ) {
		mySessionSeats.currentRow++;
	}

	return d;
}

