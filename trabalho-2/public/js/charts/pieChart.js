export function renderPieChart(container, data, config = {}) {
  container.innerHTML = "";

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  const svgWidth = clamp(window.innerWidth / 2.5, 500, window.innerWidth / 2.5);
  const svgHeight = svgWidth * 0.6;

  const width = svgWidth;
  const height = svgHeight;
  const radius = (Math.min(width, height) / 2) * 0.8;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const pie = d3.pie().value((d) => +d[config.yField || "pontos"]);
  const data_ready = pie(data);

  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  // Tooltip
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

  svg
    .selectAll("path")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => d3.schemeTableau10[i % 10])
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1).html(
        `<strong>${config.xField || "time"}:</strong> ${d.data[config.xField || "time"]}<br/>
           <strong>${config.yField || "pontos"}:</strong> ${d.data[config.yField || "pontos"]}`
      );
    })
    .on("mousemove", (event) => {
      tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  // Labels fora do gráfico
  const labelArc = d3
    .arc()
    .innerRadius(radius * 1.2)
    .outerRadius(radius * 1.2);

  svg
    .selectAll("text")
    .data(data_ready)
    .enter()
    .append("text")
    .text((d) => d.data[config.xField || "time"])
    .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
    .style("font-size", "10px")
    .style("text-anchor", (d) => {
      const midAngle = (d.startAngle + d.endAngle) / 2;
      return midAngle < Math.PI ? "start" : "end";
    });
}
