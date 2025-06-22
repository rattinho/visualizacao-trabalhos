export function renderBarChart(container, data, config = {}) {
    container.innerHTML = '';

    const svg = d3.select(container).append('svg').attr('width', 900).attr('height', 500);
    const margin = { top: 20, right: 20, bottom: 100, left: 60 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(data.map(d => d[config.xField || 'time'])).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => +d[config.yField || 'pontos'])]).range([height, 0]);

    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    g.append('g').call(d3.axisLeft(y));

    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(d[config.xField || 'time']))
        .attr('y', d => y(+d[config.yField || 'pontos']))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(+d[config.yField || 'pontos']))
        .attr('fill', config.color || 'steelblue');
}
