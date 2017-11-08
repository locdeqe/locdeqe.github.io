/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        this.nodes;

    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {
        let canvas = d3.select("g#tree");
        let treemap = d3.tree().size([900, 480]);
        let root = d3.stratify().id(function(d) { return d.id; })
                                .parentId(function(d) {
                                    if (d.ParentGame == "") return "";
                                    if (d.Wins == "1") {
                                        return d.Team + d.ParentGame;
                                    }
                                    return d.Opponent + d.ParentGame;
                                })(treeData);
        let nodes = d3.hierarchy(root);

        nodes = treemap(nodes);
        this.nodes = nodes;

        let g = d3.select("g#tree").attr("transform", "translate(10,0)");

        let link = g.selectAll(".link")
                    .data( nodes.links())
                    .enter().append("path")
                    .attr("class", function(d, i){return "link link"+i})
                    .attr("d", function(d) {
                       return "M" + d.source.y + "," + d.source.x
                         + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
                         + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
                         + " " + d.target.y + "," + d.target.x;
                       });

        let node = g.selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr("class", function(d){
                let classes = "node";
                if (d.data.data.Wins == "1") {
                    classes += " winner";
                }
                return classes;
            })
            .attr("transform", function(d) {
              return "translate(" + d.y + "," + d.x + ")"; });

        node.append("circle")
            .attr("r", 10);

       let text = node.append("text")
                      .attr("dy", ".35em")
                      .attr("class", function(d){if (!d.parent){return "root"}})
                      .text(function(d) {return d.data.data.Team; });

        text.each(function(d){
            if (d3.select(this).classed("root")) {
                d3.select(this).attr("x", 10);
            } else {
                d3.select(this).attr("x", -this.getComputedTextLength()-10);
            }

        })
    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        let nodes = this.nodes;
        let targetNodes = [];
        let paths = [];
        let selMatch = [];

        if (row.value.type != "aggregate") {
            getMatch(nodes);

            selMatch.forEach(function(d){
                let tranlate = "translate(" + d.y + "," + d.x + ")";

                let match = d3.select(`g.node[transform="${tranlate}"]`);
                match.classed("match", true);
            })
            
            return;
        }

        if (row.value.result.ranking < 4) return;

        getNode(nodes);
        
        targetNodes[0].links().forEach(function(d){
            if (d.source.data.data.Team == d.target.data.data.Team && d.source.data.data.Team == row.key){
                paths.push(d);
            }
        });

        paths.forEach(function(d){  //немного стыдно
            let dValue = "M" + d.source.y + "," + d.source.x
                         + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
                         + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
                         + " " + d.target.y + "," + d.target.x;

            let pathLine = d3.select(`path[d="${dValue}"]`);
            pathLine.classed("redLine", true);
        })

        d3.select("g#tree").selectAll("text").each(function(){
            let text = d3.select(this).text();
            if (text == row.key){
                d3.select(this).classed("redText", true);
            }
        })

        function getNode(node) {
            if (node.data.data.Team == row.key) {
                targetNodes.push(node);
            }
            if (!node.children) return;
            getNode(node.children[0]);
            getNode(node.children[1]);
            
        }

        function getMatch(node) {
            if (!node.children) return;
            if ( ((node.data.data.Opponent == row.value.opponent)&&(node.data.data.Team == row.value.team))||((node.data.data.Team == row.value.opponent)&&(node.data.data.Opponent == row.value.team))) {
                selMatch.push(node);
            }
            getMatch(node.children[0]);
            getMatch(node.children[1]);
            
        }
                   
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        d3.selectAll(".link").classed("redLine", false);
        d3.select("g#tree").selectAll("text").classed("redText", false);
         d3.select("g#tree").selectAll("g").classed("match", false);
    }
}
