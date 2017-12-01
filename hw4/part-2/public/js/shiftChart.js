/** Class implementing the shiftChart. */
class ShiftChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
        let svgBounds = d3.select("#electoral-vote").node().getBoundingClientRect();
        let svgWidth = svgBounds.width - 70;
        this.brush = d3.brushX()
                        .extent([[0, 65], [svgWidth, 85]])
                        .on("brush end", brushed);
        
        let self = this;
        
        function brushed(){
            let range = d3.event.selection;
            let rects = d3.select("#electoral-vote").selectAll("rect");
            let allobj = [];
            rects.each(function(){
                let cur = d3.select(this);
                let x = parseInt(cur.attr("x"));
                let y = x + parseInt(cur.attr("width"));
                if (range) {
                    if (x >= range[0]) {
                        if (x <= range[1]) allobj.push(this);
                    } else {
                        if ((range[1] >= x) && (range[1] <= y)) allobj.push(this);
                    }
                }
            });
            self.clear();
            self.update(allobj);
        };
    }

    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    update(selectedStates){
        let list = d3.select("#stateList").append("ul");
        
        selectedStates.forEach(function(obj){
            let name = d3.select(obj).attr("data-state");
            if (name) {
                list.append("li").text(name);
            }
        })
     // ******* TODO: PART V *******
    //Display the names of selected states in a list

    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information

    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years

    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

    };

    clear() {
        let list = d3.select("#stateList");
        list.selectAll("ul").remove();
    }

}
