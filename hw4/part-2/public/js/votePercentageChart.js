/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)

    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
	        text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
	    });

	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){

	        //for reference:https://github.com/Caged/d3-tip
	        //Use this tool tip element to handle any hover over the chart
	        let tip = d3.tip().attr('class', 'd3-tip')
	            .direction('s')
	            .offset(function() {
	                return [0,0];
	            })
	            .html((d)=> {
	                /* populate data in the following format
	                 * tooltip_data = {
	                 * "result":[
	                 * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
	                 * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
	                 * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
	                 * ]
	                 * }
	                 * pass this as an argument to the tooltip_render function then,
	                 * return the HTML content returned from that method.
	                 * */
	                return;
	            });

            let totalIndVoice = d3.sum(electionResult, function(d) {return d.I_Votes});
            let totalRepVoice = d3.sum(electionResult, function(d) {return d.R_Votes});
            let totalDemVoice = d3.sum(electionResult, function(d) {return d.D_Votes});
            let totalVoice = totalIndVoice + totalRepVoice + totalDemVoice;
            let max = Math.max(totalIndVoice, totalRepVoice, totalDemVoice);
            //console.log(electionResult);
            
            let data = [totalIndVoice, totalDemVoice, totalRepVoice].map(function(obj, i){
                let name;
                switch(i){
                    case 0:
                        name = electionResult[0].I_Nominee_prop;
                        break;
                    case 1:
                        name = electionResult[0].D_Nominee_prop;
                        break;
                    case 3:
                        name = electionResult[0].R_Nominee_prop;
                        break;
                }
                
                return {
                    voices: obj,
                    percent: obj/totalVoice * 100,
                    canditate: name
                }
            });
            
            let x = d3.scaleLinear().domain([0, 100]).range([0, this.svgWidth]);
            let xs = [0, x(data[0].percent),  x(data[0].percent) + x(data[1].percent)];
            
            
            this.svg.selectAll("rect").data(data)
                    .enter()
                    .append("rect")
                    .attr("height", 20)
                    .attr("y", 65);
        
            this.svg.selectAll("rect")
                .transition()
                .duration(500)
                .attr("x", function(d, i) {return xs[i]})
                .attr("width", function(d) {return x(d.percent)})
                .attr("fill", function(d, i){
                        switch(i){
                            case 0:
                                return "#45AD6A";
                            case 1:
                                return "rgb(158, 202, 225)";
                            case 2:
                                return "rgb(251, 106, 74)";
                        }
                });
   			  // ******* TODO: PART III *******

		    //Create the stacked bar chart.
		    //Use the global color scale to color code the rectangles.
		    //HINT: Use .votesPercentage class to style your bars.

		    //Display the total percentage of votes won by each party
		    //on top of the corresponding groups of bars.
		    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
		    // chooseClass to get a color based on the party wherever necessary

		    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
		    //HINT: Use .middlePoint class to style this bar.

		    //Just above this, display the text mentioning details about this mark on top of this bar
		    //HINT: Use .votesPercentageNote class to style this text element

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.

		    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

	};


}