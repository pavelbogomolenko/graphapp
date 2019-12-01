import * as d3 from 'd3';

export function graphApp(config) {
    const svg = d3.select(config.selector).append('svg');

    const width = config.svgWidth;
    const height = config.svgHeight;

    svg.attr('viewBox', [0, 0, width, height]);

    const line = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(config.edges)
        .join('line')
        .attr('stroke-width', 1);

    const node = svg.append('g')
        .selectAll('circle')
        .data(config.vertices)
        .join('circle')
        .attr('r', config.vertexCircleRadius)
        .attr('fill', config.vertexCircleFill);

    const simulation = d3.forceSimulation(config.vertices)
        .force('link', d3.forceLink(config.edges).id(d => d.id))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', () => {
            line
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
        });
}