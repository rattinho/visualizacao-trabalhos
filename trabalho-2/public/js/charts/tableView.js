export function renderTableView(container, data) {
  container.innerHTML = "";

  function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  const table = d3.select(container).append("table").style("border-collapse", "collapse").style("border", "1px solid black").style("width", "100%");

  const thead = table.append("thead");
  const tbody = table.append("tbody");

  const columns = Object.keys(data[0]);

  thead
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text((d) => d)
    .style("border", "1px solid black")
    .style("padding", "5px");

  const rows = tbody.selectAll("tr").data(data).enter().append("tr");

  rows
    .selectAll("td")
    .data((row) => columns.map((c) => row[c]))
    .enter()
    .append("td")
    .text((d) => d)
    .style("border", "1px solid black")
    .style("padding", "5px");
}
