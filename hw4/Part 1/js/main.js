 d3.json("data/countries_2012.json", function(error, data){
     let mainCanvas = d3.select(".mainCanvas");
     let valueData = getValuebleInfo(data);
     let canvasHeight = 800//valueData.length*15;
     let x = d3.scaleLinear().range([0, 1200]);
     let y = d3.scaleLinear().range([0, canvasHeight]);
     let force = d3.forceSimulation()
                    .force("charge", d3.forceManyBody())
                    .nodes(valueData)
                    .on("tick", tick);
     
     d3.select(".select").on("change", function(){
         renderSvg(valueData);
     })
     
     d3.select(".select_circle").on("change", function(){
         renderCircle(valueData);
     })
     
     d3.select(".select_foci").on("change", function(){
         renderFoci(valueData);
     })
     
     mainCanvas.attr("height",  canvasHeight + 40);
     //console.log(valueData);
     renderSvg(valueData);
     
     function getValuebleInfo(data) {
         let valueData = [];
         
         data.forEach(function(cur){
             let curObj = {
                 name: cur.name,
                 gdp: cur.gdp,
                 population: cur.population,
                 continent: cur.continent,
                 latitude: cur.latitude,
                 longitude: cur.longitude,
                 x: 0,
                 y: 0
             }
             valueData.push(curObj);
         })
         return valueData;
    }
     
     function renderSvg(inputData) {
         force.stop();
         let chosen = document.querySelector(".select");
         let selected = chosen.options[chosen.selectedIndex].value;
         let xVal = "population";
         let yVal = "gdp";
         
         if (selected == "geo") {
             xVal = "latitude";
             yVal = "longitude";
         }
         
         let yMin = d3.min(inputData, function(d) { return d[yVal]; } );
         let yMax = d3.max(inputData, function(d) { return d[yVal]; } );
         
         y.range([canvasHeight-10, 10]);
         y.domain([yMin, yMax]);
         
         let xMin = d3.min(inputData, function(d) { return d[xVal]; } );
         let xMax = d3.max(inputData, function(d) { return d[xVal]; } );
         
         x.range([10, 1100]);
         x.domain([xMin, xMax]);
         
         let  points = mainCanvas.selectAll("g").data(inputData)
                    .enter()
                    .append("g")
                    .attr("y", function(d){return y(d[selected])+10});
         
         points.each(function(l, i){
             let curr = d3.select(this);
             
             curr.append("circle")
                    .attr("class", "country")
                    /*.attr("cx", function(d){return x(d[xVal])+10})
                    .attr("cy", function(d){return y(d[yVal])+10});;*/
             
             curr.append("text")
                    .text(function(d) {return d.name})
                    /*.attr("x", function(d){return x(d[xVal])+15})
                    .attr("y", function(d){return y(d[yVal])+15});*/
             
         })
         
         let pontData = inputData.map(function(d) {
                d.x = x(d[xVal]);
                d.y = y(d[yVal]);
                                      
                return d;
          });
         
         renderGraph(pontData);
     }
     
     function renderCircle(inputData){
         force.stop();
         let chosen = document.querySelector(".select_circle");
         let selected = chosen.options[chosen.selectedIndex].value;
         let max = d3.max(inputData, function(d) { return d[selected]; } );
         
         if (selected == "none") {
             renderSvg(inputData);
             return;
         }
         
         let arc = d3.arc().outerRadius(600);

         let pie = d3.pie()
              .sort(function(a, b) { return a[selected] - b[selected];}) // Sorting by categories
              .value(function(d, i) { 
                //return d[selected]/max;
                  return 1;
              });
         
         let pieData = pie(inputData).map(function(d, i) {
            d.innerRadius = 0;
            d.outerRadius = 600;

            d.x = arc.centroid(d)[0]+1200/2;
            d.y = arc.centroid(d)[1]+1200/4 + 50;

            return d;
          });
         
         renderGraph(pieData);  
     }
     
     function renderFoci(inputData) {
         let chosen = document.querySelector(".select_foci");
         let selected = chosen.options[chosen.selectedIndex].value;
         
         if (selected == "none") {
             renderSvg(inputData);
             return;
         }
         force.restart();
         force.alpha(1);;
     };
         
     function tick() {
        let chosen = document.querySelector(".select_foci");
        let selected = chosen.options[chosen.selectedIndex].value;
        let k = .08 * force.alpha();
        console.log(k);
        let foci;
        let continents = ["Oceania", "Asia", "Africa", "Americas", "Europe"];
        
        if (selected == "center") {
            foci = [{x: 600, y: 400}];
        } else {
            foci = [{x: 300, y: 250}, {x: 600, y: 250}, {x: 900, y: 250}, {x: 400, y: 500}, {x: 800, y: 500}];
        }

        let fociData = valueData.map(function(d) {
                let continentId = continents.indexOf(d.continent);

                if (selected == "center") {
                     continentId = 0;
                }
                d.y += (foci[continentId].y - d.y) * k;
                d.x += (foci[continentId].x - d.x) * k;
            
                return d;
        });
        renderGraph(fociData, 0);
    }
     
     function renderGraph(inputData, transitionSpeed = 750) {
          mainCanvas.selectAll("g").data(inputData).select("circle")
             .transition()
             .duration(transitionSpeed)
             .attr("cx", function(d){return d.x})
             .attr("cy", function(d){return d.y});
         
         mainCanvas.selectAll("g").data(inputData).select("text")
             .transition()
             .duration(transitionSpeed)
             .attr("x", function(d){return d.x+5})
             .attr("y", function(d){return d.y+5});
     }
 })


