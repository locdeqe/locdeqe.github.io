 d3.json("data/countries_1995_2012.json", function(error, data){
     let mainCanvas = d3.select(".mainCanvas");
     let valueData = getValuebleInfo(data);
     let x = d3.scaleLinear().range([0, 1200]);
     let y = d3.scaleLinear().range([0, valueData.length*15]);
     
     d3.select(".select").on("change", function(){
         renderSvg(valueData);
     })
     
     mainCanvas.attr("height",  valueData.length*15 + 40);
     renderSvg(valueData);
     console.log(valueData);
     
     function getValuebleInfo(data) {
         let valueData = [];
         
         data.forEach(function(cur){
             let curObj = {
                 country_id: cur.country_id,
                 name: cur.name,
                 gdp: cur.years[17].gdp,
                 population: cur.years[17].population,
                 partners: cur.years[17].top_partners
             }
             valueData.push(curObj);
         })
         return valueData;
    }
     
     function renderSvg(inputData) {
         let chosen = document.querySelector(".select");
         let selected = chosen.options[chosen.selectedIndex].value;
         let min = d3.min(inputData, function(d) { return d[selected]; } );
         let max = d3.max(inputData, function(d) { return d[selected]; } );
         
         y.range([valueData.length*15, 0]);
         y.domain([min, max]);
         
         let  points = mainCanvas.selectAll("g").data(inputData)
                    .enter()
                    .append("g")
                    .attr("y", function(d){return y(d[selected])+10});
         
         points.each(function(l, i){
             let curr = d3.select(this);
             
             curr.append("circle")
                    .attr("cx", 10)
                    .attr("cy", 10)
                    .attr("class", "country")
                    .attr("cy", function(d){return y(d[selected])+10});;
             
             curr.append("text")
                    .text(function(d) {return d.name})
                    .attr("x", 15)
                    .attr("y", function(d){return y(d[selected])+15});
             
         })
         
         mainCanvas.selectAll("g").select("circle")
             .transition()
             .duration(500)
             .attr("cy", function(d){return y(d[selected])+10});
         
         mainCanvas.selectAll("g").select("text")
             .transition()
             .duration(500)
             .attr("y", function(d){return y(d[selected])+15});
     }
 })


