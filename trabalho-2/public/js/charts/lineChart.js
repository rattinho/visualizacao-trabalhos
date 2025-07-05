export function renderLineChart(container, data, config = {}) {
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

  const xField = config.xField || "time";
  const yField = config.yField || "pontos";

  const x = d3
    .scalePoint()
    .domain(data.map((d) => d[xField]))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[yField])])
    .range([height, 0]);

  const line = d3
    .line()
    .x((d) => x(d[xField]))
    .y((d) => y(+d[yField]));

  g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

  g.append("g").call(d3.axisLeft(y));

  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", config.color || "green")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Tooltip div
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

  // Círculos interativos nos pontos
  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d[xField]))
    .attr("cy", (d) => y(+d[yField]))
    .attr("r", 4)
    .attr("fill", config.color || "green")
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1).html(`<strong>${xField}:</strong> ${d[xField]}<br/><strong>${yField}:</strong> ${d[yField]}`);
    })
    .on("mousemove", (event) => {
      tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
}
