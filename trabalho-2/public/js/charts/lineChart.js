export function renderLineChart(container, data, config = {}) {
    container.innerHTML = '';

    const svg = d3.select(container).append('svg').attr('width', 900).attr('height', 500);
    const margin = { top: 20, right: 20, bottom: 100, left: 60 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
        .domain(data.map(d => d[config.xField || 'time']))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d[config.yField || 'pontos'])])
        .range([height, 0]);

    const line = d3.line()
        .x(d => x(d[config.xField || 'time']))
        .y(d => y(+d[config.yField || 'pontos']));

    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    g.append('g').call(d3.axisLeft(y));

    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', config.color || 'green')
        .attr('stroke-width', 2)
        .attr('d', line);
}
