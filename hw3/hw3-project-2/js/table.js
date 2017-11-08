/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = null; // 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;
        this.originalData = teamData;

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
        this.goalScale = d3.scaleLinear()
                           .range([0, 150])
                           .domain([d3.min(this.teamData, function(d) { return d.value.goalsMade; } ),d3.max(this.teamData, function(d) { return d.value.goalsMade; } )]); 

        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear().range([0, 70])
                                         .domain([0,d3.max(this.teamData, function(d) {return d.value.totalGames; } )]);

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear().domain([0,d3.max(this.teamData, function(d) {return d.value.totalGames; } )])
                                                   .interpolate(d3.interpolateHcl)
                                                   .range([d3.rgb("#ece2f0"), d3.rgb('#016450')]); 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = function(d) {
            if (d.made > d.concede){
                return "rgba(3,78,123,.5)";
            }
            return "rgba(203,24,29,.5)";
        }; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {
        let self = this;
        let goalsHeader = d3.select("#goalHeader").append("svg").attr("width", 175).attr("height", 17);
        let xAxis = goalsHeader.append("g").attr("transform", "translate(15,0)");
        
    

        let axis = d3.axisBottom().scale(this.goalScale);
        axis.tickSize(3);
        axis.tickFormat(d3.format(''));
        xAxis.call(axis);

    
        d3.selectAll("thead tr:first-child td").on("click", function(){
            let header = this.textContent;
            let element = d3.select(this);
            let sorted = element.classed("sorted");
            let helpObj = {
                "Team": "key",
                "Goals": "goalsMade",
                "Round/Result": "result",
                "Wins": "wins",
                "Losses": "losses",
                "Total Games": "totalGames"
            }

            self.collapseList();

            sortBy(helpObj[header]);
            
            self.updateTable();

            function sortBy(incomeString) {
                if (incomeString == "key") {
                    if (sorted) {
                        element.classed("sorted", false);

                        self.teamData.sort(function(a,b) {
                            return b.key.localeCompare(a.key);
                        });
                    } else {
                        element.classed("sorted", true);

                        self.teamData.sort(function(a,b) {
                            return a.key.localeCompare(b.key);
                        })
                    }
                    return;
                }

                if (incomeString == "result") {
                    let allResults = ["Group", "Round of Sixteen", "Fourth Place", "Third Place", "Runner-Up", "Winner"];
                    if (sorted) {
                        element.classed("sorted", false);

                        self.teamData.sort(function(a,b) {
                            if ( allResults.indexOf(b.value.result.label) == allResults.indexOf(a.value.result.label) ) return b.key.localeCompare(a.key);
                            return allResults.indexOf(b.value.result.label) - allResults.indexOf(a.value.result.label);
                        });
                    } else {
                        element.classed("sorted", true);

                        self.teamData.sort(function(a,b) {
                            if ( allResults.indexOf(a.value.result.label) == allResults.indexOf(b.value.result.label) ) return a.key.localeCompare(b.key);
                            return allResults.indexOf(a.value.result.label) - allResults.indexOf(b.value.result.label);
                        })
                    }
                } else {
                    if (sorted) {
                        element.classed("sorted", false);

                        self.teamData.sort(function(a,b) {
                            if (b.value[incomeString] == a.value[incomeString]) return b.key.localeCompare(a.key);
                            return b.value[incomeString] - a.value[incomeString];
                        });
                    } else {
                        element.classed("sorted", true);

                        self.teamData.sort(function(a,b) {
                            if (b.value[incomeString] == a.value[incomeString]) return a.key.localeCompare(b.key);
                            return a.value[incomeString] - b.value[incomeString];
                        })
                    }
                }
            }
        });       
    }


    updateTable() {
        d3.select("tbody").html("");

        let self = this;
        let rows = d3.select("tbody").selectAll("tr").data(this.teamData);
        let cells = rows.selectAll("td").data(getInfoFromRow);
        
        cells.enter().append('td').text(function (d) {return d});
        cells.exit().remove();

        let cellsInNewRows = rows.enter().append('tr')
                                .on("click", function(d) {
                                    let current = d3.select(this);
                                    let next = d3.select(this.nextElementSibling);

                                    if ( !current.classed("aggregate") ) {
                                        return;
                                    } 

                                    if ( !next.classed("aggregate") ) {
                                        self.updateList(d, true);
                                    } else {
                                        self.updateList(d);
                                    }
                                })
                                .on("mouseover", function(d) {
                                    self.tree.updateTree(d);
                                })
                                .on("mouseleave", self.tree.clearTree)
                                .attr("class", function(d) {return d.value.type})
                                .selectAll('td')
                                .data(getInfoFromRow);

        cellsInNewRows.enter().append('td').text(function (d) {return d});
        

        let winCells = d3.select("tbody").selectAll("tr").selectAll("td:nth-child(4)");
        let loseCells = d3.select("tbody").selectAll("tr").selectAll("td:nth-child(5)");
        let totalCells = d3.select("tbody").selectAll("tr").selectAll("td:nth-child(6)");
        let goalsCanvas = d3.select("tbody").selectAll("tr").selectAll("td:nth-child(2)")
                              .append('svg')
                              .attr("height", 25)
                              .attr("width", 172)
                              .append('g')
                              .attr("transform", "translate(15,0)");
        
        winCells.data(getWins);
        winCells.each(function(){
            if (d3.select(this.parentNode).classed("aggregate")) {
                d3.select(this).append("svg")
                               .attr("height", 25)
                               .attr("width", 70)
                               .append("rect")
                               .attr("width", function(d) {return self.gameScale(d)})
                               .attr("height", 20)
                               .style("fill", function(d) {return self.aggregateColorScale(d)});

                d3.select(this).select("svg")
                               .append("text")
                               .text(function(d) {return d})
                               .attr("x", function(d) {return self.gameScale(d) - 10})
                               .attr("y", 15)
                               .style("fill", "fff");
            }
        });
        
        loseCells.data(getLoses);
        loseCells.each(function(){
            if (d3.select(this.parentNode).classed("aggregate")) {
                d3.select(this).append("svg")
                               .attr("height", 25)
                               .attr("width", 70)
                               .append("rect")
                               .attr("width", function(d) {return self.gameScale(d)})
                               .attr("height", 20)
                               .style("fill", function(d) {return self.aggregateColorScale(d)});

                d3.select(this).select("svg")
                               .append("text")
                               .text(function(d) {return d})
                               .attr("x", function(d) {return self.gameScale(d) - 10})
                               .attr("y", 15)
                               .style("fill", "fff");
            }
        });

        totalCells.data(getTotal);
        totalCells.each(function(){
            if (d3.select(this.parentNode).classed("aggregate")) {
                d3.select(this).append("svg")
                               .attr("height", 25)
                               .attr("width", 70)
                               .append("rect")
                               .attr("width", function(d) {return self.gameScale(d)})
                               .attr("height", 20)
                               .style("fill", function(d) {return self.aggregateColorScale(d)});

                d3.select(this).select("svg")
                               .append("text")
                               .text(function(d) {return d})
                               .attr("x", function(d) {return self.gameScale(d) - 10})
                               .attr("y", 15)
                               .style("fill", "fff");
            }
        });

        rows.exit().remove();

        d3.select("tbody").selectAll("tr").enter().append("tr");
        let goalsCellsCanvas = d3.select("tbody").selectAll("tr").select("td:nth-child(2) svg g");

        let rects = goalsCellsCanvas.selectAll("rect")
                                    .data(getGoalDelta)
                                    .enter()
                                    .append('rect')
                                    .attr("x", function(d) {
                                        if (self.goalScale(d.made) > self.goalScale(d.concede)){
                                            return self.goalScale(d.concede);
                                        }
                                        return self.goalScale(d.made);
                                    })
                                    .attr("y", 6)
                                    .attr("width", function(d) {return Math.abs(self.goalScale(d.made)-self.goalScale(d.concede))})
                                    .attr("height", 12)
                                    .style("fill", function(d) {return self.goalColorScale(d)});

        goalsCellsCanvas.selectAll("circle")
                        .data(getGoals)
                        .enter()
                        .append("circle")
                        .attr("cx", function(d) {return self.goalScale(d)})
                        .attr("cy", 12)
                        .attr("r", 6)
                        .style("fill", function(d, i) {
                            if (i == 0) {
                                return "#034e7b";
                            }
                            return "#cb181d";
                        });
        
        function getInfoFromRow(row) {
            let ca = [row.key, "", row.value.result.label];
            ca[5] = "";
            return ca;
        }

        function getWins(row) {
            let resArr = [];
            resArr.push(row.value.wins);
            return resArr;
        }

        function getLoses(row) {
            let resArr = [];
            resArr.push(row.value.losses);
            return resArr;
        }

        function getTotal(row) {
            let resArr = [];
            resArr.push(row.value.totalGames);
            return resArr;
        }

        function getGoals(row) {
            let resArr = [row.value.goalsMade, row.value.goalsConceded];
            return resArr;
        }

        function getGoalDelta(row) {
            let resArr = [{
                "made": row.value.goalsMade,
                "concede": row.value.goalsConceded,
            }];
            return resArr;
        }


    };


    updateList(i, remove = false) {
        let data = this.teamData;
        let index = data.indexOf(i);
        let newArray = [];

        if (remove) {
            let nextIndex = index+1;

            while(true) {
                if (!data[nextIndex].value.type) {
                    nextIndex++;
                } else {
                    break;
                }
            }

            let firstPart = data.slice(0, index+1);
            let lastPart = data.slice(nextIndex);

            this.teamData = firstPart.concat(lastPart);
            console.log(index, nextIndex);

        } else {
            i.value.games.forEach(function(item) {
                let currItem = {
                    "key": "x" + item.Opponent,
                    "value": {
                        "goalsConceded": item["Goals Conceded"],
                        "goalsMade": item["Goals Made"],
                        "result": {
                            "label": item["Result"]
                        },
                        "opponent": i.key,
                        "team": item.Opponent
                    }
                }

                newArray.push(currItem);
            });

            let firstPart = data.slice(0, index+1);
            let lastPart = data.slice(index+1);

            this.teamData = firstPart.concat(newArray).concat(lastPart);
        }
        

        this.updateTable();
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        this.teamData = this.originalData;

        this.updateTable();        
    }

}
