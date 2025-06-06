// @ts-nocheck
import * as d3 from 'd3';

class D3jsBarrasAgrupadas {
  height = null;
  width = null;
  marginB = 50;
  marginT = 50;
  marginL = 70;
  marginR = 30;

  view = null;
  mapX0 = null; // escala dos grupos
  mapX1 = null; // escala das categorias dentro do grupo
  mapY = null;
  MinMaxMapY = null;
  factorMin = 0.99;
  color = null;

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
    console.log(grupos);

    const yExtent = d3.extent(data, (d) => d.valor);
    this.MinMaxMapY = yExtent;
    const minY = Math.min(yExtent[0] * this.factorMin, yExtent[0]);
    const maxY = Math.max(0, yExtent[1]);

    this.mapX0 = d3
      .scaleBand()
      .domain(grupos)
      .range([this.marginL, this.width - this.marginR])
      .paddingInner(0.1);

    this.mapX1 = d3
      .scaleBand()
      .domain(categorias)
      .range([0, this.mapX0.bandwidth()])
      .padding(0.05);

    this.mapY = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([this.height - this.marginB, this.marginT]);

    this.color = d3.scaleOrdinal().domain(categorias).range(d3.schemeSet2);
  }

  attEixos() {
    const xAxis = d3.axisBottom(this.mapX0);
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
  createBars(data) {
    const grupos = d3.groups(data, (d) => d.grupo);

    grupos.forEach(([grupo, valores]) => {
      const group = this.view
        .append('g')
        .attr('transform', `translate(${this.mapX0(grupo)}, 0)`);

      valores.forEach((d) => {
        const x = this.mapX1(d.categoria);
        const y = this.mapY(d.valor);
        const h = this.mapY(this.MinMaxMapY[0] * this.factorMin) - y;

        // Desenha a barra
        group
          .append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', this.mapX1.bandwidth())
          .attr('height', h)
          .style('fill', this.color(d.color));

        // Adiciona o valor acima da barra
        group
          .append('text')
          .attr('x', x + this.mapX1.bandwidth() / 2)
          .attr('y', y - 5) // um pouco acima do topo da barra
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', '#333')
          .text(d.valor.toFixed(2)); // arredonda para facilitar a leitura
      });
    });
  }

  createLegends(legY, legX) {
    // Legenda do eixo X (centralizada horizontalmente no eixo inferior)
    this.view
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height - this.marginB / 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', '#333')
      .text(legX);

    // Legenda do eixo Y (rotacionada, centralizada na altura do gráfico)
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
export default D3jsBarrasAgrupadas;
