/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    
    updateBarChart(selectedDimension) {
        let self = this;
        let svgCanvas = d3.selectAll("svg#barChart");
        let min =  d3.min(this.allData, function(d) { return d[selectedDimension]; } );
        let max =  d3.max(this.allData, function(d) { return d[selectedDimension]; } );
        let xScale = d3.scaleLinear().range([0, this.allData.length]);
        let yScale = d3.scaleOrdinal().range([0, max]);
        
        renderX (this.allData);
        renderY (this.allData);
        renderData (this.allData);
        
        
        function renderX(inputData) {
            let xAxis = svgCanvas.select("g#xAxis");
            xAxis.attr("transform", "translate(50,380)");
            let min =  d3.min(inputData, function(d) { return d.year; } );
            let max =  d3.max(inputData, function(d) { return d.year; } );
            let x = d3.scaleLinear().range([0, 450]).domain([min,max]);
            
            var axis = d3.axisBottom().scale(x);
            axis.tickSize(4);
            axis.tickFormat(d3.format(''));
            xAxis.call(axis);
        }
        
        function renderY(inputData) {
            let yAxis = svgCanvas.select("g#yAxis");
            yAxis.attr("transform", "translate(50,0)");
            let y = d3.scaleLinear().range([380, 0]).domain([min,max]);
            
            var axis = d3.axisLeft().scale(y);
            axis.tickSize(3);
            axis.tickFormat(d3.format(''));
            yAxis.transition().duration(500).call(axis); 
        }
        
        function renderData(inputData) {
            let mainCanvas = svgCanvas.select("g#bars");
            mainCanvas.attr("transform", "translate(50,0)");
            
            let y = d3.scaleLinear().range([0, 380]).domain([0,max]);
            let barWidth = (500-50)/inputData.length; 
            
            let color = d3.scaleLinear().domain([0,max])
                              .interpolate(d3.interpolateHcl)
                              .range([d3.rgb("#7872D8"), d3.rgb('#0E0874')]);
            
            let bars = mainCanvas.selectAll("rect").data(inputData);
            
            bars.enter()
                .append("rect")
                .on("click", function(d){
                    self.infoPanel.updateInfo(d);
                    self.worldMap.updateMap(d);
                    d3.selectAll("rect").data(inputData).transition().duration(500).style('fill', function (d) {return color(d[selectedDimension]);});
                    d3.select(this).transition()
                      .duration(500)
                      .style('fill', "#f00");
                })
                .attr("x", function(d,i) {return barWidth * i})
                .attr("y", function(d) {return 380 - y(d[selectedDimension])})
                .attr("height", function(d) {return y(d[selectedDimension])})
                .attr("width", barWidth)
                .style('fill', function (d) {return color(d[selectedDimension]);});
            
            mainCanvas.selectAll("rect").transition()
              .duration(500)
              .attr("y", function(d) {return 380 - y(d[selectedDimension])})
              .attr("height", function(d) {return y(d[selectedDimension])})
              .style('fill', function (d) {return color(d[selectedDimension]);});
            
            bars.exit().remove();
        }

        


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

    }
}