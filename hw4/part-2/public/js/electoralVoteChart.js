   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;
        
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){
        this.rX = "";
        this.dX = "";
       
        electionResult = electionResult.sort(function(a, b){
            if (a.State_Winner == "I") return -1;
            if (b.State_Winner == "I") return 1;
            if ((a.RD_Difference < 0)&&(b.RD_Difference < 0)) {
                return Math.abs(b.RD_Difference) - Math.abs(a.RD_Difference);
            }
             return a.RD_Difference - b.RD_Difference;
        });
       
       
       let x = d3.scaleLinear().domain([0, 10]).range([0, this.svgWidth]);
       
       
       let D_EV_Total = electionResult[0].D_EV_Total;
       let R_EV_Total = electionResult[0].R_EV_Total;
       let I_EV_Total = electionResult[0].I_EV_Total;
       
       let xWidthMin = d3.min(electionResult, function(d) {return +d.Total_EV});
       let xWidthMax = d3.max(electionResult, function(d) {return +d.Total_EV});
       let sumOfAll = d3.sum(electionResult, function(d) {return +d.Total_EV});
       let widthOfOne = (this.svgWidth - electionResult.length*2) / sumOfAll;
       let xS = [0];
       
       electionResult.forEach(function(d, i){
           if (i == 0) return;
           let cur = xS[i-1] + (+electionResult[i-1].Total_EV) * widthOfOne + 2;
           xS.push(cur);
       })
       
       let self = this;
       
       this.svg.selectAll("rect")
                .data(electionResult)
                .enter()
                .append("rect")
                .attr("height", 20)
                .attr("y", 65);
                //.call(self.shiftChart.move, [0, self.svgWidth]);
       
       this.svg.selectAll("rect")
                .transition()
                .duration(500)
                .attr("width", function(d) {return d.Total_EV * widthOfOne})
                .attr("data-state", function(d) {return d.State})
                .attr("x", function(d, i){
                        if ((!self.dX) && (d.State_Winner == "D")) self.dX = xS[i];
                        if ((!self.rX) && (d.State_Winner == "R")) self.rX = xS[i];
                        return xS[i];
                })
                .attr("fill", function(d){
                        if (d.State_Winner == "I") {
                            return "#45AD6A"
                        }
                        return colorScale(d.RD_Difference);
                });
       
       this.svg.selectAll("rect").exit().remove();
       
       let textData;
       
       if (I_EV_Total) {
           textData = [
               {
                   "value": I_EV_Total,
                   "x": 0
               },
               {
                   "value": D_EV_Total,
                   "x": self.dX
               },
               {
                   "value": R_EV_Total,
                   "x": self.rX
               }
           ]
       } else {
           console.log(this.svg.selectAll("text"));
           if (this.svg.selectAll("text").size() == 3) {
               this.svg.select("text").remove();
           }
           textData = [
               {
                   "value": D_EV_Total,
               },
               {
                   "value": R_EV_Total,
                   "x": self.rX
               }
           ]
       }
    
     this.svg.selectAll("text").data(textData)
                .enter()
                .append("text")
                .attr("y", 60);
       
       
       this.svg.selectAll("text")
                .transition()
                .duration(500)
                .attr("x", function(d) {console.log(textData); return d.x})
                .text(function(d) {return d.value});
       
       
       this.svg.selectAll("g").remove();
       
        this.svg.append("g")
                .call(self.shiftChart.brush)
                .call(self.shiftChart.brush.move, [0, 0].map(x));
       
          // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


    };

    
}
