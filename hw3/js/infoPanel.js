/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
     updateInfo(oneWorldCup) {
        let hostPlaceHolder = d3.select("#host").transition().duration(500).text(oneWorldCup.host);
        let winerPlaceholder = d3.select("#winner").transition().duration(500).text(oneWorldCup.winner);
        let silver = d3.select("#silver").transition().duration(500).text(oneWorldCup.runner_up);
         
        d3.select("#teams").html("");
        let teamsPlaceholder = d3.select("#teams").append("ul");
        let teams = teamsPlaceholder.selectAll("li")
                                    .data(oneWorldCup.TEAM_NAMES.split(",").sort())
                                    .enter()
                                    .append("li")
                                    .text(function(d){return d});
         
         teamsPlaceholder.selectAll("li")
                         .transition()
                         .duration(500)
                         .text(function(d){return d});
         
         teamsPlaceholder.exit().remove();
        

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        //Set Labels

    }
    
}
