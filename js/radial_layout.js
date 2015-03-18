(function () {

	function getCircumference(radius) {
		return radius * 2 * Math.PI;
	}

	function getTotalArcLength(radius) {
		// Each row is a semicircle
		return getCircumference(radius) / 2;
	}

	function getNumberOfSeats(row)
	{
		return SEATS_PER_ROW[row];
	}

	function getOneSeatWidth(row, radius)
	{
		return getTotalArcLength(radius) / getNumberOfSeats(row) ;
	}

	function getArcDistance(row, col, radius) 
	{
		return col * getOneSeatWidth(row, radius);
	}

	function getTheta(row, col, radius)
	{
		return 2 * Math.PI * getArcDistance(row, col, radius) / 
					getCircumference(radius)
	}

	d3.radial = {
		xPosOnArc: function(row, col, radius)
		{ 
			var theta = getTheta(row, col, radius);

			return Math.cos(theta) * radius;
		},
		yPosOnArc: function(row, col, radius)
		{
			var theta = getTheta(row, col, radius);

			return Math.sin(theta) * radius;
		}
	}
})()