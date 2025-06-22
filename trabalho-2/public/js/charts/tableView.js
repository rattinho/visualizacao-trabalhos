export function renderTableView(container, data) {
    container.innerHTML = '';

    const table = d3.select(container).append('table')
        .style('border-collapse', 'collapse')
        .style('border', '1px solid black');

    const thead = table.append('thead');
    const tbody = table.append('tbody');

    const columns = Object.keys(data[0]);

    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(d => d)
        .style('border', '1px solid black')
        .style('padding', '5px');

    const rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');

    rows.selectAll('td')
        .data(row => columns.map(c => row[c]))
        .enter()
        .append('td')
        .text(d => d)
        .style('border', '1px solid black')
        .style('padding', '5px');
}
