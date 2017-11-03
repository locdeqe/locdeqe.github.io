/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
        this.mapCanvas = d3.select("g#map");
        this.path = d3.geoPath().projection(this.projection).pointRadius(8);
    }

    /**
     * Function that clears the map
     */
    clearMap() {

        this.mapCanvas.selectAll(".countries").attr("class", "countries");
        d3.select(".gold").remove();
        d3.select(".silver").remove();

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();
        
        let path = this.path;
        
        this.mapCanvas.selectAll(".countries")
                    .attr("class", function(d){
                        let classNames = "countries";
                        if (d.id == worldcupData.host_country_code) {
                            classNames += " host";
                        }
                        if (worldcupData.TEAM_LIST.indexOf(d.id) + 1) {
                            classNames += " team";
                        }
                        return classNames;
                    });
        
        this.mapCanvas.append('path')
                    .attr('class', 'gold')
                    .attr('d', function (d) {
                        return path({
                            'type': 'Point',
                            'coordinates': [worldcupData.WIN_LON, worldcupData.WIN_LAT]
                        });
                    });
        this.mapCanvas.append('path')
                    .attr('class', 'silver')
                    .attr('d', function (d) {
                        return path({
                            'type': 'Point',
                            'coordinates': [worldcupData.RUP_LON, worldcupData.RUP_LAT]
                        });
                    });

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
        this.countries = topojson.feature(world, world.objects.countries).features;
        console.log(world);
        
        this.mapCanvas.append('path')
                .datum(d3.geoGraticule().stepMinor([10, 10]))
                .attr('class', 'graticule')
                .attr('d', this.path);
        
        this.mapCanvas.selectAll('.countries').data(this.countries).enter()
                .append('path')
                .attr('class', 'countries')
                .attr('d', this.path);

    }


}
