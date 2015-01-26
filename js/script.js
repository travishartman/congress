//script for congressional effectivness

//variables

var circlesPerRow = 15;

var margin = { top: 40, right: 50, bottom: 20, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;


var svg = d3.select('.bubbleDiv').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  	.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); 


// var congress;	
var nestedCongress;


d3.csv("data/93to110congress_namesplit.csv", function (congress){
	nestedCongress = d3.nest()
					.key (function(d) {return d.congress;}) //d.congress is the session of congress 
					.map(congress)
					// console.log(nestedCongress)



	myData = nestedCongress[107];

testing = [];
for (var i in nestedCongress) { testing.push(+i);};

minScale = d3.min(testing);
maxScale = d3.max(testing);



d3.select('#slider')
		.call(d3.slider()
		.axis(true)
		.min(minScale)
		.max(maxScale)
		.step(1)
		);

	var radiusScale = d3.scale.log()
		.base([5])
		.clamp(true)
		.domain([.2, d3.max(myData, function(d){return d.les})])
		.range([1, 20]);

	var cy = d3.scale.linear()
		.domain([0, myData.length / circlesPerRow])
		.range([0, height])

	var circles = svg.selectAll("circle")
		.data(myData)
		.enter()
		.append("circle")
		.attr('r', function (d) {
			return d.les*0;
		})
		.attr('fill', function (d) {
			if (d.dem == 1) return "blue"
				else return "red"
		} )
		.attr('fill-opacity', .2 )

		circles.transition()
			.duration(4000)
			.attr ("cx", function (d,i) {
			return ((i % circlesPerRow)  * 50) + 125;
			})
			.attr ("cy", function (d, i) { 
				// console.log(i/circlesPerRow)
				return cy (circlesPerRow )

			})
			.attr('r', function (d) {
				return d.les*10;
			})
			.attr('fill', function (d) {
				if (d.dem == 1) return "blue"
					else return "red"
			} )
			.attr('fill-opacity', .2 )



		
		circles.on("click", function(d) {
			circles.transition()
			.duration(2000)

			//reapeat.  ripe for function?
			.attr ("cx", function (d,i) {
				return ((i % circlesPerRow)  * 40) + 15;
			})
			.attr ("cy", function (d, i) { 
				return cy (Math.floor(i / circlesPerRow ))

			})
			// .attr('r', function (d, i) {
			// 	return radiusScale (d.les)
			// })
			.attr('fill-opacity', .5 )
		})

		// previous radius size
		// .attr('r', function (d) {
		// 	return d.les*5;
		// })

		// .attr('fill', function (d) {
		// 	if (d.dem == 1) return "blue"
		// 		else return "red"
		// } )
		// .attr ("stroke", "black")
	


	circles.on("mouseover", function(d){

		function bubbleName() {
			return "<p class = 'congressPerson'>" + d.first_name + " " + d.last_name 
		};

		function bubbleParty(){
			if (d.dem == 1) {return "(D), " + d.st_name ;} 
				else {return "(R), " + d.st_name ;}
		};

		function bubbleScore(){	
			return "<p class = 'bubbleScore'> LES score: " + d.les*100 
		};
		function bubblePassed(){
			return "<pclass = 'bubblePassed'>Bills passed through house: " + d.all_pass 
		}
		function bubbleLaw() {
			return "<p class = 'bubbleLaw'>Laws passed: " + d.all_law
		}
		var congressTitle = "<h3> Congressperson: </h3>"

		var message =  "<p class = 'bubbleMessageOverall'>" + congressTitle +  bubbleName() + " " + bubbleParty() + "<br>" + bubblePassed() + "<br>" +  bubbleLaw() +  "<br>" + bubbleScore() +"</p>"

		$(".bubbleWords").html(message) // mouseover needs to be inside the callback of the mouseover function- otherwise it will not have run by the time message gets called.  reed suggested writing a function to contain the placing of the text into the div, and then placing that funciton inside of the callback.  
	});  //end mouseover



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




