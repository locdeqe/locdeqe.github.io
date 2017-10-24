/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.


        // Select the host country and change it's color accordingly.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.


        // Add a marker for gold/silver medalists
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {
        let mapCanvas = d3.select("g#map");
        let projection = d3.geoConicConformal();
        let path = d3.geoPath().projection(projection);
        let countries = topojson.feature(world, world.objects.countries).features;
        
        /*mapCanvas.append("path")
                 .datum(topojson.feature(world, world.objects.countries))
                 .attr("d", d3.geoPath().projection(projection));*/
        
        mapCanvas.selectAll('.country').data(countries).enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', path);
        

        console.log(world);

    }


}
