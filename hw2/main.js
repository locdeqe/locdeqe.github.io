 d3.json("countries.json", function(error, data){
     	var valueData = getValuebleInfo(data);
        var columns = Object.keys(valueData[0]);
     
        var margin = {top: 50, bottom: 10, left:300, right: 40};
        var settings = makeCanvas();
     
        var table = d3.select(".table").append("table"),
            thead = table.append("thead")
                         .attr("class", "thead");
            tbody = table.append("tbody");

        table.append("caption")
          .html("World Countries Ranking");

        thead.append("tr").selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(d) { return d; })
            .on("click", function(header) {
            if (data.sorted == "toLower"+header) {
                tbody.selectAll("tr").sort(function(a, b) {
                    if ( parseFloat(a[header]) >= 0){
                        return parseFloat(b[header]) - parseFloat(a[header]);
                    }
                    
                    
                    if (header == "continent" && (b[header].localeCompare(a[header]) == 0)) {
                        return b["name"].localeCompare(a["name"]);
                    }
                    
                    return b[header].localeCompare(a[header]);
                    
                });
                
                tbody.style('opacity', 0.0).transition().duration(500).style('opacity', 1.0);
                
                data.sorted = "toUpper"+header;
            
            } else {
                tbody.selectAll("tr").sort(function(a, b) {
                    
                    if ( parseFloat(a[header]) || a[header] == 0){
                        return parseFloat(a[header]) - parseFloat(b[header]);
                    }
                    
                    if (header == "continent" && (a["continent"].localeCompare(b["continent"]) == 0)) {
                        return a["name"].localeCompare(b["name"]);
                    }
                    
				    return a[header].localeCompare(b[header]);
                });
                
                tbody.style('opacity', 0.0).transition().duration(500).style('opacity', 1.0);
        
                data.sorted = "toLower"+header;
            }
          });
     
        renderTable(valueData);
         
     
        d3.selectAll(".checkboxes input").on("change", renderChecked);
        
        d3.selectAll(".aggregation input").on("change", function(){
            if (document.querySelector(".aggregation input:checked").value == "none") {
                if (d3.select(".toogle").node().checked){
                    renderSvg(valueData);
                } else {
                    renderTable(valueData);
                };
            } else {
                renderAggregation(valueData);
            }
        });
        
        d3.selectAll(".timeupdate").on("input", function(){
            valueData = getValuebleInfo(data, this.value);
            if (document.querySelector(".aggregation input:checked").value == "none"){
                renderChecked();
            } else {
                renderAggregation(valueData);
            }
        });
        
        d3.select(".toogle").on("change", function(){
            if (this.checked){
                table.style("display", "none");
                d3.select(".svg-charts").style("display", "block");
                d3.select(".encoding").style("display", "block");
                d3.select(".svgSort").style("display", "block");
                
                if (document.querySelector(".aggregation input:checked").value == "none"){
                    renderChecked(valueData);
                } else {
                    renderAggregation(valueData);
                }
            } else {
                table.style("display", "table");
                d3.select(".svg-charts").style("display", "none");
                d3.select(".encoding").style("display", "none");
                d3.select(".svgSort").style("display", "none");
                if (document.querySelector(".aggregation input:checked").value == "none"){
                    renderChecked(valueData);
                } else {
                    renderAggregation(valueData);
                }
            }
        })
        
        d3.selectAll(".encoding input").on("change", function(){
            if (document.querySelector(".aggregation input:checked").value == "none"){
                renderChecked(valueData);
            } else {
                renderAggregation(valueData);
            }
            
        });
     
        d3.selectAll(".svgSort input").on("change", function(){
            if (document.querySelector(".aggregation input:checked").value == "none"){
                renderChecked(valueData);
            } else {
                renderAggregation(valueData);
            }
        });
        
        function renderAggregation(inputData) {
            var aggregatedData ={};
            var resultArray = [];
            inputData.forEach(function(current){
                if (!aggregatedData[current.continent]) {
                    aggregatedData[current.continent] = {
                        name: current.continent,
                        continent: current.continent,
                        gdp: current.gdp,
                        life_expectancy: current.life_expectancy,
                        population: current.population,
                        year: current.year,
                        count: 0
                    }
                } else {
                    aggregatedData[current.continent].gdp += current.gdp;
                    aggregatedData[current.continent].life_expectancy += current.life_expectancy;
                    aggregatedData[current.continent].population +=  current.population;
                    aggregatedData[current.continent].count++;
                }
            })
            var coutnres = Object.keys(aggregatedData);
            
            coutnres.forEach(function(current){
                aggregatedData[current].life_expectancy = aggregatedData[current].life_expectancy / aggregatedData[current].count;
                delete aggregatedData[current].count;
                resultArray.push(aggregatedData[current]);
            })
            
             if (d3.select(".toogle").node().checked){
                renderSvg(resultArray);
            } else {
                renderTable(resultArray);
            }
            tbody.style('opacity', 0.0).transition().duration(500).style('opacity', 1.0);
            d3.selectAll('.checkboxes input:checked').property("checked", false);
        }
     
        function renderTable(data){
            var rows = d3.select("tbody").selectAll("tr").data(data);
            var cells = rows.selectAll("td").data(getInfoFromRow);
            
            cells.enter().append('td');
            cells.text(function (d) {return d});
            cells.exit().remove();
            
            var cells_in_new_rows = rows.enter().append('tr').selectAll('td').data(getInfoFromRow);

            cells_in_new_rows.enter().append('td');
            cells_in_new_rows.text(function (d) {return d});
            tbody.style('opacity', 0.0).transition().duration(500).style('opacity', 1.0);
            rows.exit().remove();
        }
        
        function getValuebleInfo(data, year) {
            var valueInfo = [];
            if (data[0].years) { //Если несколько лет, значит первый раз данные парсятся 
                year = year||1995;
                data.forEach(function(currentObj){
                    currentObj.years.forEach(function(currentYear) {
                        if (currentYear.year != year) return;
                        valueInfo.push({
                            name: currentObj.name,
                            continent: currentObj.continent,
                            gdp: currentYear.gdp,
                            life_expectancy: currentYear.life_expectancy,
                            population: currentYear.population,
                            year: currentYear.year
                        })
                    })
                })
            } else {
                data.forEach(function(currentObj){
                        valueInfo.push({
                            name: currentObj.name,
                            continent: currentObj.continent,
                            gdp: currentObj.gdp,
                            life_expectancy: currentObj.life_expectancy,
                            population: currentObj.population,
                            year: currentObj.year
                        })
                })
            }
            
            return valueInfo;
        }
        
        function getInfoFromRow(row) {
              return d3.range(Object.keys(row).length).map(function(column, i) {
                  return makeFormating(Object.keys(row)[i], row[Object.keys(row)[i]]);
              });
          }
        
        function makeFormating (name, value){
            var formObj = {
                gdp: function(val) {
                    return d3.format(".2s")(val);
                },
                
                life_expectancy: function(val) {
                    return d3.format(".1f")(val);
                },
                
                population: function(val) {
                    return d3.format(",.3")(val);
                }
            }
            
            if (formObj[name]) {
                return formObj[name](value);
            }
            
            return value;
        }
        
        function renderChecked(){
            var checkedBoxes = [];
            var filtredData = [];
            
            d3.selectAll('.checkboxes input:checked').each(function(){
                checkedBoxes.push(this.value);
            });
            
            if (!checkedBoxes.length || checkedBoxes.length == 4) {
                filtredData = valueData;
            } else {
                valueData.forEach(function(current) {
                    if (checkedBoxes.indexOf(current['continent']) > -1 ) {
                        filtredData.push(current);
                    }
                });
            } 
           
            filtredData = getValuebleInfo(filtredData);
            
            if (d3.select(".toogle").node().checked){
                renderSvg(filtredData);
            } else {
                renderTable(filtredData);
            }
            
            d3.select('.aggregation input#none').property("checked", true);
        }
          
        function makeCanvas() {
            var margin = {top: 0, bottom: 10, left:300, right: 40},
            width = 1300 - margin.left - margin.right,
            height = 2100 - margin.top - margin.bottom,
            categoryIndent = 4*15 + 5,
            defaultBarWidth = 2000;

            //Set up scales
            var x = d3.scale.linear().range([0, width]);
            var y = d3.scale.ordinal().rangeRoundBands([0, height], .8, 0);

            //Create SVG element
            d3.select(".svg-charts").selectAll("svg").remove()
            var svg = d3.select(".svg-charts").append("svg")
                .attr("width", width + margin.left + margin.right)
                //.attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate("+margin.left+","+margin.top+")");

            //Package and export settings
            var settings = {
              margin:margin, width:width, height:height, categoryIndent:categoryIndent,
              svg:svg, x:x, y:y
            }
            return settings;
        };
        
        function renderSvg (inputData){
            var margin=settings.margin, width=settings.width, categoryIndent=settings.categoryIndent, 
            svg=settings.svg, x=settings.x, y=settings.y;
            
            var value = document.querySelector(".encoding input:checked").value;
            var sortFilter = document.querySelector(".svgSort input:checked").value;
            
            var max = d3.max(inputData, function(d) { return d[value]; } );
            var min = 0;
            
            var height = inputData.length * 20 + margin.top + margin.bottom;
            
            d3.select(".svg-charts svg").attr("height", height);
            y = d3.scale.ordinal().rangeRoundBands([0, height -  margin.top - margin.bottom]);

            x.domain([min, max]);
            y.domain(inputData.map(function(d) { return d.name; }));
            
            inputData.sort(function(a, b){
                if (sortFilter == "name") {
                    return d3.ascending(a[sortFilter], b[sortFilter]);
                }
                return d3.descending(a[sortFilter], b[sortFilter]);
            });
            
            var minVal = d3.min(inputData, function(d) { return d[value]; } );
            var maxVal = d3.max(inputData, function(d) { return d[value]; } );
                        
            var chartRow = svg.selectAll("g.chartRow").data(inputData, function(d){ return d.name});
            
            var newRow = chartRow
              .enter()
              .append("g")
              .attr("class", "chartRow");
            
            newRow.append("rect")
                  .attr("width", function(d) { return x(d[value]); })
                  .style({
                      fill: function(d){
                          if (d.continent == "Asia") return "#CA0300";
                          if (d.continent == "Americas") return "#E16519";
                          if (d.continent == "Europe") return "#CACE17";
                          if (d.continent == "Africa") return "#388C04";
                          if (d.continent == "Asia") return "#047331";
                      }
                  })
                  .attr("x", x(min))
                  .attr("opacity",0)
                  .attr("height", 12)
                  .attr("y", function(d) {return inputData.indexOf(d)}) 


            var text = newRow.append("text")
              .attr("y", function(d, i) {console.log(d.name, inputData.indexOf(d)); return inputData.indexOf(d);})
              .attr("opacity",0)
              .text(function(d){return d.name});
            
            text.each(function(){
                d3.select(this).attr("x", -this.getComputedTextLength())
            })
        

            chartRow.select("rect").transition()
              .duration(500)
              .attr("width", function(d) { return x(d[value]);})
              .attr("x", x(min))
              .attr("y", function(d) {return inputData.indexOf(d)*20 - 10;})
              .duration(1000)
              .attr("opacity",1);
            
            chartRow.select("text").transition()
              .duration(500)
              .attr("y", function(d) {return inputData.indexOf(d)*20;})
              .duration(1000)
              .attr("opacity",1);


            chartRow.exit().transition()
              .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
              .remove();

        };
    })
