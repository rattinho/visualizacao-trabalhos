//@ts-nocheck

import * as d3 from 'd3';


class D3jsDados {
    circles = [];
    squares = [];
    height = null;
    width = null;
    view = null;
    mapY = null;
    mapX = null;

    constructor(width, height) {
        this.circles = [
            {
                val01: 10,
                val02: 10,
                val03: 10,
            }
        ];
        this.squares = [];
        this.width = width
        this.height = height
        this.view = d3.select("#view")
        .append("svg")
        .attr('x', 10)
        .attr('y', 10)
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'border-[1px] border-black/25 bg-white drop-shadow-md rounded-xl')
    }


    attScaleY(data: any, parameter: any) {
        const svg = this.view
        const tipExtent = d3.extent(data, d => d[parameter]);
        this.mapY = d3.scaleLinear().domain([0,tipExtent[1]*1.2]).range([this.height -50, 50]);
    }


    attScaleX(data: any, parameter: any) {
        const svg = this.view
        const distExtent = d3.extent(data, d => d[parameter]);
        console.log(distExtent)
        this.mapX = d3.scaleLinear().domain(distExtent).range([150, this.width - 50]);
    }

    attEixos() {



    const xAxis  = d3.axisBottom(this.mapX);
    const groupX = this.view.append('g');
    groupX
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${this.height - 50})`)
        .call(xAxis);

    const yAxis  = d3.axisLeft(this.mapY);
    const groupY = this.view.append('g');
    groupY
        .attr('class', 'y axis')
        .attr('transform', `translate(60, 0)`)
        .call(yAxis);
    }

    createCircles() {
        const svg = this.view

        let circles = svg.selectAll('circle')
            .data(this.circles);

        circles.enter()
            .append('circle')
            .attr('cx', d => d.val01)
            .attr('cy', d => d.val02)
            .attr('r',  d => d.val03)
            .style('fill', 'RoyalBlue');


        circles
            .attr('cx', d => d.val01)
            .attr('cy', d => d.val02)
            .attr('r',  d => d.val03)
            .style('fill', 'SeaGreen');
    }

    createSquare(height, idx) {
        const svg = this.view

        svg.append('rect')
            .attr('x', this.mapX(idx) - 50/2)
            .attr('y', d => this.mapY(height)  )
            .attr('width', 50)
            .attr('height', d => this.height - this.mapY(height))
            .style('fill', 'SeaGreen');
        
        
    }
}

export default D3jsDados;