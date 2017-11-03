    /**
     * Loads in the table information from fifa-matches.json 
     */
//d3.json('data/fifa-matches.json',function(error,data){
//
//    /**
//     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//     *
//     */
//    d3.csv("data/fifa-tree.csv", function (error, csvData) {
//
//        //Create a unique "id" field for each game
//        csvData.forEach(function (d, i) {
//            d.id = d.Team + d.Opponent + i;
//        });
//        
//
//        //Create Tree Object
//        let tree = new Tree();
//        tree.createTree(csvData);
//
//        //Create Table Object and pass in reference to tree object (for hover linking)
//        let table = new Table(data,tree);
//
//        table.createTable();
//        table.updateTable();
//    });
//});




d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {
     
    let teamData = d3.nest()
                        .key(function (d) {
                            return d.Team;
                        })
                        .rollup(function (d) { return {
                            goalsMade: d3.sum(d, function(l){return l["Goals Made"]}),
                            goalsConceded: d3.sum(d, function(l){return l["Goals Conceded"]}),
                            deltaGoals: d3.sum(d, function(l){return l["Delta Goals"]}),
                            wins: d3.sum(d, function(l){return l["Wins"]}),
                            losses: d3.sum(d, function(l){return l["Losses"]}),
                            result: {
                                label: d3.max(d, function(l){
                                    let results = ["Group", "Round of Sixteen", "Fourth Place", "Third Place", "Runner-Up", "Winner"]
                                    let max = "Group";
                                    
                                    if ( results.indexOf(l["Result"]) > results.indexOf(max)) max = l["Result"];
                                    
                                    return max;
                                }),
                                ranking: getRang(d)
                            },
                            totalGames: d.length,
                            type: "aggregate",
                            games: d
                        }})
                        .entries(matchesCSV);
    
    function getRang(d) {
        if (d.length == 7) {
            if ( (d[0]["Result"] == "Winner")||(d[0]["Result"] == "Runner-Up") ){
                return 6;    
            }
            return 5;
        }
        return d.length;
    }
    
                                
    console.log(matchesCSV);

    console.log(teamData);

    d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

            treeCSV.forEach(function (d, i) {
                d.id = d.Team + d.Opponent + i;
            });

           

            //Create Tree Object
            let tree = new Tree();
            tree.createTree(treeCSV);

            //Create Table Object and pass in reference to tree object (for hover linking)
            let table = new Table(teamData,tree);

            table.createTable();
            table.updateTable();


    });
});
// // ********************** END HACKER VERSION ***************************
