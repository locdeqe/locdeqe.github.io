/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = null; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = null; // 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        let goalsHeader = d3.select("#goalHeader").append("svg").attr("width", 156).attr("height", 17);
        
        let xAxis = goalsHeader.append("g");
        
        let min =  d3.min(this.teamData, function(d) { return d.value.goalsMade; } );
        let max =  d3.max(this.teamData, function(d) { return d.value.goalsMade; } );
        let x = d3.scaleLinear().range([0, 150]).domain([min,max]);

        var axis = d3.axisBottom().scale(x);
        axis.tickSize(3);
        axis.tickFormat(d3.format(''));
        xAxis.call(axis);

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 

       
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        let rows = d3.select("tbody").selectAll("tr").data(this.teamData).enter().append("tr");
        let cells = rows.selectAll("td").data(getInfoFromRow);
        let maxWins =  d3.max(this.teamData, function(d) {return d.value.wins; } );
        
        let barCharWinsWidth = d3.scaleLinear().range([0, 250]).domain([0,maxWins]);
        
        cells.enter().append('td').text(function (d) {return d});
        cells.exit().remove();
        
        
        let winBars = rows.selectAll("tr td:nth-child(4)");
        
        winBars.append("svg")
               .append("rect")
               .attr("class", "winBar");
        
        winBars.selectAll(".winBar").data(this.teamData).enter().attr("width", function(d) {return barCharWinsWidth(d.value.wins)}).attr("height", 15);
        

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray
        
        function getInfoFromRow(row) {
            let ca = [row.key, "", row.value.result.label];
            ca[5] = "";
            return ca;
        }

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

    }


}
