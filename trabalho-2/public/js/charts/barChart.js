export function renderBarChart(container, data, config = {}) {
  container.innerHTML = "";

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  const svgWidth = clamp(window.innerWidth / 2.5, 500, window.innerWidth / 2.5);
  const svgHeight = svgWidth * 0.6;

  const svg = d3.select(container).append("svg").attr("width", svgWidth).attr("height", svgHeight);
  const margin = {top: 20, right: 20, bottom: 100, left: 60};
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d[config.xField || "time"]))
    .range([0, width])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[config.yField || "pontos"])])
    .range([height, 0]);

  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

  g.append("g").call(d3.axisLeft(y));

  // Tooltip div (fora do SVG)
  const tooltip = d3
    .select(container)
    .append("div")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("padding", "6px 10px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("font-size", "12px")
    .style("opacity", 0);

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d[config.xField || "time"]))
    .attr("y", (d) => y(+d[config.yField || "pontos"]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(+d[config.yField || "pontos"]))
    .attr("fill", config.color || "steelblue")
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1).html(
        `<strong>${config.xField || "time"}:</strong> ${d[config.xField || "time"]}<br/>
           <strong>${config.yField || "pontos"}:</strong> ${d[config.yField || "pontos"]}`
      );
    })
    .on("mousemove", (event) => {
      tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
}
