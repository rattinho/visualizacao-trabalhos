// @ts-nocheck
import * as d3 from 'd3';

class D3jsBarrasEmpilhadas {
  width;
  height;
  margin = { top: 50, right: 30, bottom: 50, left: 60 };
  view;
  mapX;
  mapY;
  color;
  series;

  constructor(width, height, target) {
    this.width = width;
    this.height = height;

    this.view = d3
      .select(target)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr(
        'class',
        'border-[1px] border-black/25 bg-white drop-shadow-md rounded-xl',
      )
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  attScale(data) {
    const grupos = Array.from(new Set(data.map((d) => d.grupo)));
    const categorias = Array.from(new Set(data.map((d) => d.categoria)));

    const dadosPorGrupo = d3.rollup(
      data,
      (v) => Object.fromEntries(v.map((d) => [d.categoria, d.valor])),
      (d) => d.grupo,
    );

    const dadosEmpilhados = Array.from(dadosPorGrupo, ([grupo, valores]) => ({
      grupo,
      ...valores,
    }));

    const series = d3.stack().keys(categorias)(dadosEmpilhados);

    const maxY = d3.max(series, (s) => d3.max(s, (d) => d[1]));

    this.mapX = d3
      .scaleBand()
      .domain(grupos)
      .range([0, this.width - this.margin.left - this.margin.right])
      .padding(0.2);

    this.mapY = d3
      .scaleLinear()
      .domain([0, maxY])
      .nice()
      .range([this.height - this.margin.top - this.margin.bottom, 0]);

    this.color = d3.scaleOrdinal().domain(categorias).range(d3.schemeSet2);

    this.series = series;
    this.dadosEmpilhados = dadosEmpilhados;
  }

  attEixos() {
    this.view
      .append('g')
      .attr(
        'transform',
        `translate(0,${this.height - this.margin.top - this.margin.bottom})`,
      )
      .call(d3.axisBottom(this.mapX));

    this.view.append('g').call(d3.axisLeft(this.mapY));
  }

  createBars() {
    // Criar barras empilhadas
    this.view
      .selectAll('g.layer')
      .data(this.series)
      .enter()
      .append('g')
      .attr('class', 'layer')
      .attr('fill', (d) => this.color(d.key))
      .selectAll('rect')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => this.mapX(d.data.grupo))
      .attr('y', (d) => this.mapY(d[1]))
      .attr('height', (d) => this.mapY(d[0]) - this.mapY(d[1]))
      .attr('width', this.mapX.bandwidth());

    // Adicionar valor dentro de cada segmento
    this.view
      .selectAll('g.layer')
      .data(this.series)
      .append('g')
      .selectAll('text')
      .data((d) => d)
      .enter()
      .append('text')
      .attr('x', (d) => this.mapX(d.data.grupo) + this.mapX.bandwidth() / 2)
      .attr(
        'y',
        (d) => this.mapY(d[1]) + (this.mapY(d[0]) - this.mapY(d[1])) / 2,
      )
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#fff')
      .text((d) => (d[1] - d[0]).toFixed(1));
  }

  createTurnoLegend() {
    const categorias = this.color.domain();
    const legenda = this.view
      .append('g')
      .attr('transform', `translate(0, -40)`); // move para o topo

    categorias.forEach((cat, i) => {
      const x = i * 120;

      legenda
        .append('rect')
        .attr('x', x)
        .attr('y', 0)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', this.color(cat));

      legenda
        .append('text')
        .attr('x', x + 20)
        .attr('y', 12)
        .attr('font-size', '12px')
        .text(cat);
    });
  }

  createLegends(legY, legX) {
    this.view
      .append('text')
      .attr(
        'transform',
        `translate(${(this.width - this.margin.left - this.margin.right) / 2}, ${
          this.height - this.margin.top - 10
        })`,
      )
      .style('text-anchor', 'middle')
      .text(legX);

    this.view
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -this.height / 2)
      .attr('y', -40)
      .style('text-anchor', 'middle')
      .text(legY);
  }
}

export default D3jsBarrasEmpilhadas;
