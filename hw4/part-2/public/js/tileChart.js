/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){

        let divTiles = d3.select("#tiles").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = divTiles.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2;
        let legendHeight = 150;
        //add the svg to the div
        let legend = d3.select("#legend").classed("content",true);

        //creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)")
        this.svg = divTiles.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",this.svgHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)")
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
        else if (party== "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2 class ="  + this.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
        text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
        text += "<ul>"
        tooltip_data.result.forEach((row)=>{
            //text += "<li>" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
            text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
        });
        text += "</ul>";

        return text;
    }

    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (electionResult, colorScale){
            //Calculates the maximum number of columns to be laid out on the svg
            this.maxColumns = d3.max(electionResult,function(d){
                                    return parseInt(d["Space"]);
                                });

            //Calculates the maximum number of rows to be laid out on the svg
            this.maxRows = d3.max(electionResult,function(d){
                                    return parseInt(d["Row"]);
                            });

            //Creates a legend element and assigns a scale that needs to be visualized
            this.legendSvg.append("g")
                .attr("class", "legendQuantile")
                .attr("transform", "translate(0,50)");

            /*let legendQuantile = d3.legendColor()
                .shapeWidth(100)
                .cells(10)
                .orient('horizontal')
                .scale(colorScale);*/
            
        
            let rectWidth = (this.svgWidth - this.maxColumns * 6) / this.maxColumns;
            let rectHeight = (this.svgHeight - this.maxRows * 8) / this.maxRows;

            /*this.legendSvg.select(".legendQuantile")
                .call(legendQuantile);*/

            let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];
            let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];
        
            let widthOfOne = this.svgWidth / range.length;
        
            d3.select("#legend svg").selectAll("rect").data(range)
                                .enter()
                                .append("rect")
                                .attr("width", widthOfOne)
                                .attr("height", widthOfOne/4)
                                .attr("x", function(d, i){return i*widthOfOne})
                                .attr("y", 5)
                                .attr("fill", function(d){return d});
            
            d3.select("#legend svg").selectAll("text").data(domain)
                                .enter()
                                .append("text")
                                .attr("x", function(d, i){return i*widthOfOne})
                                .attr("y", 20 + widthOfOne/4)
                                .text(function(d, i){
                                    if (i != 12) {
                                        return `${domain[i]} - ${domain[i+1]}`
                                    }
                                });
        
            let tip = d3.tip().attr('class', 'd3-tip')
                .direction('se')
                .offset(function() {
                    return [0,0];
                })
                .html((d)=>{
                    let allVoices = +d.D_Votes + +d.R_Votes + +d.I_Votes;                
                    
                    if (d.I_Nominee_prop != " ") {
                        return `<div>
                                    <h2 class = ${d.State_Winner}>${d.State}</h2>
                                    <p class = "green">${d.I_Nominee_prop}: ${d.I_Votes}(${d3.format(".0%")(d.I_Votes/allVoices)})</p>
                                    <p class = "blue">${d.D_Nominee_prop}: ${d.D_Votes}(${d3.format(".0%")(d.D_Votes/allVoices)})</p>
                                    <p class = "red">${d.R_Nominee_prop}: ${d.R_Votes}(${d3.format(".0%")(d.R_Votes/allVoices)})</p>
                                </div>`;
                    }
                    return `<div>
                                <h2 class = ${d.State_Winner}>${d.State}</h2>
                                <p class = "blue">${d.D_Nominee_prop}: ${d.D_Votes}(${d3.format(".0%")(d.D_Votes/allVoices)})</p>
                                <p class = "red">${d.R_Nominee_prop}: ${d.R_Votes}(${d3.format(".0%")(d.R_Votes/allVoices)})</p>
                            </div>`;
                });
            this.svg.selectAll("rect").remove();
            
            this.svg.call(tip);
        
            this.svg.selectAll("rect")
                    .data(electionResult)
                    .enter()
                    .append("rect")
                    .attr("width", rectWidth)
                    .attr("height", rectHeight)
                    .attr("x", function(d) {return parseInt(d["Space"]) * rectWidth + 2})
                    .attr("y", function(d) {return parseInt(d["Row"]) * rectHeight + 2})
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);
        
        
            this.svg.selectAll("rect")
                .append("rect")
                .attr("width", rectWidth)
                .attr("height", rectHeight);
        
            this.svg.selectAll("rect")
                .transition()
                .duration(500)
                .attr("fill", function(d) {
                        if (d.State_Winner == "I") {
                            return "#45AD6A"
                        }
                        return colorScale(d.RD_Difference);
                });
        
            this.svg.selectAll("text").remove();
        
            this.svg.selectAll("text")
                    .data(electionResult)
                    .enter()
                    .append("text");
        
            this.svg.selectAll("text").each(function(){
                let cur = d3.select(this);
                cur.append('tspan').text(function(d) { return `${d.Abbreviation}` })
                                 .attr("x", function(d) {return (parseInt(d["Space"]) * rectWidth + 2) + ((rectWidth - this.getComputedTextLength()) / 2)})
                                .attr("y", function(d) {return (parseInt(d["Row"]) * rectHeight + 2) +  rectHeight / 2});
                cur.append('tspan').text(function(d) { return `${d.Total_EV}` })
                                 .attr("x", function(d) {return (parseInt(d["Space"]) * rectWidth + 2) + ((rectWidth - this.getComputedTextLength()) / 2)})
                                .attr("y", function(d) {return (parseInt(d["Row"]) * rectHeight + 2) +  rectHeight / 2 + 20});
                
            });
            // ******* TODO: PART IV *******
            //Tansform the legend element to appear in the center and make a call to this element for it to display.

            //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

            //Display the state abbreviation and number of electoral votes on each of these rectangles

            //Use global color scale to color code the tiles.

            //HINT: Use .tile class to style your tiles;
            // .tilestext to style the text corresponding to tiles

            //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
            //then, vote percentage and number of votes won by each party.
            //HINT: Use the .republican, .democrat and .independent classes to style your elements.
    
    };


}
