export function renderPieChart(container, data, config = {}) {
    container.innerHTML = '';

    const width = 800;  // Aumente aqui
    const height = 600;
    const radius = Math.min(width, height) / 2 * 0.8; // Deixe um espaço extra para labels

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);  // Mantém centralizado

    const pie = d3.pie().value(d => +d[config.yField || 'pontos']);
    const data_ready = pie(data);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll('path')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => d3.schemeTableau10[i % 10]);

    // Labels fora do gráfico
    const labelArc = d3.arc().innerRadius(radius * 1.2).outerRadius(radius * 1.2);

    svg.selectAll('text')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => d.data[config.xField || 'time'])
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .style('font-size', '10px')
        .style('text-anchor', d => {
            const midAngle = (d.startAngle + d.endAngle) / 2;
            return midAngle < Math.PI ? 'start' : 'end';
        });
}
