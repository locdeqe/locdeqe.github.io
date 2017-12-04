 d3.json("data/countries_2012.json", function(error, data){
     let mainCanvas = d3.select(".mainCanvas");
     let valueData = getValuebleInfo(data);
     let circleData;
     let canvasHeight = 800//valueData.length*15;
     let x = d3.scaleLinear().range([0, 1200]);
     let y = d3.scaleLinear().range([0, canvasHeight]);
     let force = d3.forceSimulation()
                    .force("charge", d3.forceManyBody())
                    .nodes(valueData)
                    .on("tick", tick);
     
     let select_circle = d3.select(".select_circle");
     let select_foci =  d3.select(".select_foci");
     let select =  d3.select(".select");
     
     d3.json("data/countries_1995_2012.json", function(error, data){
        valueData = valueData.map(function(item, i){
            item.id = data[i].country_id;
            item.partners = data[i].years[7].top_partners;
            return item;
        })
     });
     
     select.on("change", function(){
         renderSvg(valueData);
         select_foci.property("value", "none");
         select_circle.property("value", "none");
     })
     
     select_circle.on("change", function(){
         renderCircle(valueData);
         select_foci.property("value", "none");
         select.property("value", "none");
     })
     
     select_foci.on("change", function(){
         select_circle.property("value", "none");
         select.property("value", "none");
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
         clearCanvas();
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
                    .attr("class", function(d){
                        let name = d.name.replace(/\s/ig, "-");
                        name = name.replace(/\./g,'').replace(/,/g,'');
                        return name;
                    });
         
         points.each(function(l, i){
             let curr = d3.select(this);
             
             curr.append("circle")
                    .attr("class", "country")
                    /*.attr("cx", function(d){return x(d[xVal])+10})
                    .attr("cy", function(d){return y(d[yVal])+10});;*/
             
             curr.append("text");      
         })
         
         let pontData = inputData.map(function(d) {
                d.x = x(d[xVal]);
                d.y = y(d[yVal]);
                                      
                return d;
          });
         
         renderGraph(pontData);
     }
     
     function renderCircle(inputData){
         clearCanvas();
         force.stop();
         let chosen = document.querySelector(".select_circle");
         let selected = chosen.options[chosen.selectedIndex].value;
         let pieData = [];
         //let max = d3.max(inputData, function(d) { return d[selected]; } );
         
         if (selected == "none") {
             renderSvg(inputData);
             return;
         }
         
         let arc = d3.arc().outerRadius(600);

         let pie = d3.pie()
              .sort(function(a, b) { return a[selected] - b[selected];})
              .value(function(d, i) { 
                //return d[selected]/max;
                  return 1;
              });
         if (selected == "continents") {
             let tempData = d3.nest().key(function(d) { return d.continent; }).entries(inputData);
             tempData.forEach(function(cur, i){
                 let curAngle = 135 * i + 55;
                 let arc = d3.arc().outerRadius(200);
                 let data = cur.values;
                 let tempPie = pie(data).map(function(d) {
                    d.innerRadius = 0;
                    d.outerRadius = 50;
                    let x0 = arc.centroid(d)[0] + 600;
                    let y0 = arc.centroid(d)[1] + 400;
                    let dist = 300;
                    let u = curAngle/180 * Math.PI/2;
                    d.x = x0 + Math.cos(u) * dist;
                    d.y = y0 + Math.sin(u) * dist;

                    return d;
                  });
                 pieData = pieData.concat(tempPie);
             });
             pieData.sort(function(a, b) { return a.data.name.localeCompare(b.data.name);})
             console.log(pieData);
         } else {
             pieData = pie(inputData).map(function(d) {
                d.innerRadius = 0;
                d.outerRadius = 600;

                d.x = arc.centroid(d)[0]+1200/2;
                d.y = arc.centroid(d)[1]+1200/4 + 50;

                return d;
              });
             let links = getLinks(pieData);
             circleData = pieData;
             renderLinks(links);
         }
         
         renderGraph(pieData);
     }
     
     function renderFoci(inputData) {
         clearCanvas();
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
        let foci;
        let continents = ["Oceania", "Asia", "Africa", "Americas", "Europe"];
        
        if (selected == "center") {
            foci = [{x: 600, y: 400}];
        } else {
            foci = [{x: 300, y: 250}, {x: 600, y: 250}, {x: 900, y: 250}, {x: 400, y: 500}, {x: 800, y: 500}];
        }

        let fociData = valueData.map(function(d) {
                let continentId = continents.indexOf(d.continent);
                let continentClass = continents[continentId];

                if (selected == "center") {
                    continentId = 0;
                    continentClass = "";
                }
            
                d.y += (foci[continentId].y - d.y) * k;
                d.x += (foci[continentId].x - d.x) * k;
                d.class = continentClass;
            
                return d;
        });
        renderGraph(fociData, 100);
    }
     
     function getLinks(data) {
         let map = {};
         let links = [];
         
         data.forEach(function(item){
             map[item.data.id] = item;
         })
         
         data.forEach(function(item) {
            item.data.partners.forEach(function(i) {
              links.push({source: map[item.data.id], target: map[i.country_id]});
            });
          });
         
         return links;
     }
     
     function renderLinks(links) {
         clearCanvas();
         
         d3.selectAll("g").on("mouseover", showLinks);
         d3.selectAll("g").on("mouseout", hideLinks);
         let link = mainCanvas.select(".linksCanvas").selectAll(".link");
         link = link.data(links)
                    .enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("d", function(d) {
                         let x0 = Math.abs(d.source.x + 600)/2;
                         let x1 = Math.abs(d.target.x + 600)/2;
                         let y0 = Math.abs(d.source.y + 470)/2;
                         let y1 = Math.abs(d.target.y + 470)/2;
                        
                       return "M" + d.source.x + "," + d.source.y
                         + "C" + x0 + "," + y0
                         + " " + x1 + "," + y1
                         + " " + d.target.x + "," + d.target.y;
                       });
         
     }
     
     function clearCanvas() {
         mainCanvas.select(".linksCanvas").html("");
         d3.selectAll("g").on("mouseover", null);
         d3.selectAll("g").on("mouseout", null);
     }
     
     function showLinks(event) {
         let links = [];
         let map = {};
         
         circleData.forEach(function(item){
             map[item.data.id] = item;
         })
         
         event.data.partners.forEach(function(item, i){
            links.push({source: event, target: map[event.data.partners[i].country_id]});
         });

         d3.selectAll("path").classed("opacity", true);
         d3.selectAll("text").classed("opacityText", true);
         d3.selectAll("circle").classed("opacity", true);
         
         let className = links[0].source.data.name.replace(/\s/ig, "-");
         className = className.replace(/\./g,'').replace(/,/g,'');
         
         console.log(`.${className} cirle`);
         d3.select(`.${className} circle`).classed("source", true);
         d3.select(`.${className} text`).classed("targetText", true);
         
         links.forEach(function(d) {
             let className = d.target.data.name.replace(/\s/ig, "-");
             className = className.replace(/\./g,'').replace(/,/g,'');
             d3.select(`.${className} circle`).classed("target", true);
             d3.select(`.${className} text`).classed("targetText", true);
             
             let radius = Math.sqrt((d.source.x - d.target.x) ** 2 + (d.source.y - d.target.y) ** 2)
             
             //600, 470;
             let x0 = Math.abs(d.source.x + 600)/2;
             let x1 = Math.abs(d.target.x + 600)/2;
             let y0 = Math.abs(d.source.y + 470)/2;
             let y1 = Math.abs(d.target.y + 470)/2;
             
             let dValue = "M" + d.source.x + "," + d.source.y
                         + "C" + x0 + "," + y0
                         + " " + x1 + "," + y1
                         + " " + d.target.x + "," + d.target.y;
            
           let path = d3.selectAll(`path[d="${dValue}"]`).remove();
           let link = mainCanvas.select(".linksCanvas").append("path").attr("class", "link").attr("d", dValue).classed("highlight", true);
         });
     }
     
     function hideLinks() {
         d3.selectAll("path").classed("highlight", false).classed("opacity", false);
         d3.selectAll("circle").classed("opacity", false).classed("target", false).classed("source", false);
         d3.selectAll("text").classed("opacityText", false).classed("targetText", false);
     }
     
     function renderGraph(inputData, transitionSpeed = 750) {
          mainCanvas.selectAll("g").data(inputData).select("circle")
             .transition()
             .duration(transitionSpeed)
             .attr("cx", function(d){return d.x})
             .attr("cy", function(d){return d.y});
         
         mainCanvas.selectAll("g").data(inputData)
             .select("text")
             .transition()
             .duration(transitionSpeed)
             .attr("x", function(d){return d.x+5})
             .attr("y", function(d){return d.y+5})
             .text(function(d){
                if (d.name) return d.name;
                return d.data.name;
             });
     }
 })


