// @ts-nocheck
import * as d3 from 'd3';

class D3jsLinhasAgrupadas {
  height = null;
  width = null;
  marginB = 50;
  marginT = 50;
  marginL = 70;
  marginR = 30;

  view = null;
  mapX = null;
  mapY = null;
  color = null;
  MinMaxMapY = null;

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
      );
  }

  attScale(data) {
    const grupos = Array.from(new Set(data.map((d) => d.grupo)));
    const categorias = Array.from(new Set(data.map((d) => d.categoria)));

    const yExtent = d3.extent(data, (d) => d.valor);
    this.MinMaxMapY = yExtent;
    const minY = Math.min(yExtent[0] * 0.95, yExtent[0]);
    const maxY = Math.max(0, yExtent[1]);

    this.mapX = d3
      .scalePoint()
      .domain(grupos)
      .range([this.marginL, this.width - this.marginR])
      .padding(0.5);

    this.mapY = d3
      .scaleLinear()
      .domain([0, maxY + 2])
      .range([this.height - this.marginB, this.marginT]);

    this.color = d3.scaleOrdinal().domain(categorias).range(d3.schemeSet2);
  }

  attEixos() {
    const xAxis = d3.axisBottom(this.mapX);
    const yAxis = d3.axisLeft(this.mapY);

    this.view
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height - this.marginB})`)
      .call(xAxis);

    this.view
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.marginL}, 0)`)
      .call(yAxis);
  }

  createLines(data) {
    const categorias = Array.from(new Set(data.map((d) => d.categoria)));

    categorias.forEach((categoria) => {
      const dadosFiltrados = data.filter((d) => d.categoria === categoria);

      const line = d3
        .line()
        .x((d) => this.mapX(d.grupo))
        .y((d) => this.mapY(d.valor))
        .curve(d3.curveMonotoneX); // curva suave

      // Desenha a linha
      this.view
        .append('path')
        .datum(dadosFiltrados)
        .attr('fill', 'none')
        .attr('stroke', this.color(categoria))
        .attr('stroke-width', 2)
        .attr('d', line);

      // Pontos e valores
      this.view
        .selectAll(`.circle-${categoria}`)
        .data(dadosFiltrados)
        .enter()
        .append('circle')
        .attr('cx', (d) => this.mapX(d.grupo))
        .attr('cy', (d) => this.mapY(d.valor))
        .attr('r', 4)
        .attr('fill', this.color(categoria));

      this.view
        .selectAll(`.label-${categoria}`)
        .data(dadosFiltrados)
        .enter()
        .append('text')
        .attr('x', (d) => this.mapX(d.grupo))
        .attr('y', (d) => this.mapY(d.valor) - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#333')
        .text((d) => d.valor.toFixed(2));
    });
  }

  createLegends(legY, legX) {
    this.view
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height - this.marginB / 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#333')
      .text(legX);

    this.view
      .append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -this.height / 2)
      .attr('y', this.marginL / 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#333')
      .text(legY);
  }
}

export default D3jsLinhasAgrupadas;
