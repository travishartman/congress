(function () {

	function getCircumference(radius,i) {
		return radius * 2 * Math.PI;
	}

	function getTotalArcLength(radius,i) {
		// Each row is a semicircle
		return getCircumference(radius) / 2;
	}

	function getNumberOfSeats(row,i)
	{
		// return SEATS_PER_ROW[row]
		return SEATS_TRAVIS[i][row]
		// return SEATS_TRAVIS[i][row];
		// console.log(SEATS_TRAVIS[])
	}

	function getOneSeatWidth(row, radius,i)
	{
		return getTotalArcLength(radius) / getNumberOfSeats(row,i) ;
	}

	function getArcDistance(row, col, radius,i) 
	{
		return col * getOneSeatWidth(row, radius,i);
	}

	function getTheta(row, col, radius,i)
	{
		return 2 * Math.PI * getArcDistance(row, col, radius,i) / 
					getCircumference(radius)
	}

	d3.radial = {
		xPosOnArc: function(row, col, radius, i)
		{ 
			var theta = getTheta(row, col, radius,i);

			return Math.cos(theta) * radius;
		},
		yPosOnArc: function(row, col, radius, i)
		{
			var theta = getTheta(row, col, radius,i);

			return Math.sin(theta) * radius;
		}
	}
})()