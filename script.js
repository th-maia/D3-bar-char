import * as d3 from "d3";
import './styles.css';

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

let data

const req = new XMLHttpRequest();
req.open("GET", url, true);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  data = json.data
  
  const lastDateOnXScale = new Date(data[data.length-1][0]) //Date to be used in scale of axis X
  lastDateOnXScale.setMonth(lastDateOnXScale.getMonth()+3) //to see better in the chart the last data on scaleTime need put +3 months to get a margin of space.

  const w = 1000; //width to the svg
  const h = 500; //height to the svg
  const padding = 40;

  //creating the scale of the axis
  const scaleX = d3.scaleTime()                                  
                .domain([new Date(data[0][0]), lastDateOnXScale])
                .range([padding, w-3])       // this 3 is because the number in the leftAxis need this to show the number 2015 to get a margin of space.

  const scaleY = d3.scaleLinear()
                .domain([0, d3.max(data, (d) => d[1])])
                .range([h - padding, 3]); // this 3 is because the number in the leftAxis need this to show the number 1800 to get a margin of space.

  //create a <svg> in tag <main>
  const svg = d3.select("main") 
    .append("svg")
    .attr("width", w)
    .attr("height", h)
  
  //tooltip, the box near the mouse that show de data.
  const tooltip = d3.select("main") // the html tag <main>
  .append("div")
  .attr("class", "tooltip") //attribute for css
  .attr("id", "tooltip") //attribute for test
  .style("display", "none");

  const bar = svg.selectAll("rect") //the bars of the chart
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => scaleX(new Date(d[0])))
    .attr("y", (d, i) => scaleY(d[1]))
    .attr("width", Math.floor((w-padding) / 275)) //275 number of data elements
    .attr("height", (d, i) => h - scaleY(d[1]) - padding)
    .attr("fill", "blue")
    .attr("class", "bar")
    .attr("data-date", (d)=>`${d[0]}`)
    .attr("data-gdp", (d)=>`${d[1]}`)
    .on("mouseover", (event) => { //event when mouse is over a .bar
      //event.target.__data__ is the atributes from the element that the mouse on. 
      const year = `${event.target.__data__[0]}`.substring(0,4) //event.target.__data__ need be transformed to string to use
      const month = Number(`${event.target.__data__[0]}`.substring(5,7)) 
      const quarter = Math.ceil(month / 3)
      
      tooltip.html(`${year} Q${quarter}<br/>$${event.target.__data__[1]} Billion`) // .html put the innerHTML
             .style("left", (event.pageX + 9) + "px") //change the tooltip style
             .style("top", (event.pageY - 43) + "px")
             .style("display", "block")
             .style("opacity", 0.85)
             .attr("data-date", event.target.__data__[0])
    })
    .on("mouseout", () => { //event when mouse go out a .bar
      tooltip.style("display", "none")
    })
 
  //axis 
  const axisX = d3.axisBottom(scaleX);
  const axisY = d3.axisLeft(scaleY);

  svg.append("g")
    .attr("transform", `translate(0, ${h - padding})`)
    .attr("id", "x-axis")
    .call(axisX)

  svg.append("g")
     .attr("transform", `translate(${padding}, 0)`)
     .attr("id", "y-axis")
     .call(axisY)

  //show raw data details   
  data = JSON.stringify(json.data);
  d3.select("main").append("details").append("summary").text("show raw data details")
  d3.select("details").append("p").text(data);
};



