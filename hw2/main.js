 d3.json("countries.json", function(error, data){
     	var valueData = getValuebleInfo(data);
        
        var columns = Object.keys(valueData[0]);

        var table = d3.select("body").append("table"),
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
        
                data.sorted = "toLower"+header;
            }
          });
     
        renderTable(valueData);
         
        d3.selectAll(".checkboxes input").on("change", function(){             
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
            
            renderTable(filtredData);
           
            
        });
        
        d3.selectAll(".aggregation input").on("change", function(){
            if (document.querySelector(".aggregation input:checked").value == "none") {
                renderTable(valueData);
            } else {
                var aggregatedData ={};
                var resultArray = [];
                valueData.forEach(function(current){
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
                renderTable(resultArray);
            }
        });
        
        d3.selectAll(".timeupdate").on("input", function(){
            valueData = getValuebleInfo(data, this.value);
            renderTable(valueData);
        })
     
        function renderTable(data){
             var rows = d3.select("tbody").selectAll("tr").data(data);
            var cells = rows.selectAll("td").data(getInfoFromRow);
            
            cells.enter().append('td');
            cells.text(function (d) {return d});
            cells.exit().remove();
            
            var cells_in_new_rows = rows.enter().append('tr').selectAll('td').data(getInfoFromRow);

            cells_in_new_rows.enter().append('td');
            cells_in_new_rows.text(function (d) {return d});
            
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
        
        
    })