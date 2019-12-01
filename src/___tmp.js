import * as d3 from 'd3';

const svg = d3.select('#graph').append('svg');

const width = 300;
const height = 200;
const nodeCircleRadius = 3;
const lineStrokeWidth = 1;

svg.attr('viewBox', [0, 0, width, height]);

const nodes = [
    {id: 1, name: 'базы', value: 1},
    {id: 2, name: 'пакеты', value: 1},
    {id: 3, name: 'намотка', value: 1},
    {id: 4, name: 'формовка', value: 1},
    {id: 5, name: 'монтаж', value: 3},
    {id: 6, name: 'заливка', value: 1},
    {id: 7, name: 'доводка', value: 1},
    {id: 8, name: 'контроль', value: 1},
    {id: 9, name: 'упаковка', value: 1},
];

const links = [
    {source: nodes[2], target: nodes[3], right: true},
    {source: nodes[0], target: nodes[4], right: true},
    {source: nodes[1], target: nodes[4], right: true},
    {source: nodes[3], target: nodes[4], right: true},
    {source: nodes[4], target: nodes[5], right: true},
    {source: nodes[5], target: nodes[6], right: true},
    {source: nodes[6], target: nodes[7], right: true},
    {source: nodes[7], target: nodes[8], right: true},
];

const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('x', d3.forceX(width / 2))
    .force('y', d3.forceY(height / 2));

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 5 15')
    .attr('refX', 14)
    .attr('refY', 5)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M 0 0 L 5 5 L 0 10 z')
    .attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 5 15')
    .attr('refX', 14)
    .attr('refY', 5)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto-start-reverse')
    .append('svg:path')
    .attr('d', 'M 0 0 L 5 5 L 0 10 z')
    .attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow2')
    .attr('viewBox', '0 -5 5 15')
    .attr('refX', -7)
    .attr('refY', 0)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M 10 -5 L 0 0 L 10 5 z')
    .attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow-drag-line')
    .attr('viewBox', '0 -5 5 15')
    .attr('refY', 5)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M 0 0 L 5 5 L 0 10 z')
    .attr('fill', '#000');

// line displayed when dragging new nodes
const dragLine = svg.append('svg:path')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('d', 'M 0,0 L 0,0');

let link = svg.append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line');

let node = svg.append('g').selectAll('g');
let newNodeIdCounter = 9;
let mousedownNode = null;
let mouseupNode = null;

simulation.on('tick', () => {
    link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    });
});

function redraw() {
    link = link.data(links);
    link = link
        .join('line')
        .attr('stroke-width', lineStrokeWidth)
        .attr('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
        .attr('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

    node = node.data(nodes);
    const g = node.enter().append('g');
    g.append('circle')
        .attr('r', nodeCircleRadius)
        .attr('fill', '#6e6e6e')
        .on('mouseover', function (d) {
            // enlarge target node
            d3.select(this).attr('transform', 'scale(1.1)');
        })
        .on('mouseout', function (d) {
            // unenlarge target node
            d3.select(this).attr('transform', '');
        })
        .on('mousedown', d => {
            // reposition drag line
            mousedownNode = d;
            dragLine
                .attr('stroke-width', lineStrokeWidth)
                .attr('cursor', 'default')
                .style('marker-end', 'url(#end-arrow-drag-line)')
                .attr('d', `M ${mousedownNode.x} ${mousedownNode.y} L ${mousedownNode.x} ${mousedownNode.y}`);
        })
        .on('mouseup', function (d) {
            if (!mousedownNode) return;

            dragLine
                .attr('stroke-width', 0)
                .style('marker-end', '');

            // check for drag-to-self
            mouseupNode = d;
            if (mouseupNode === mousedownNode) {
                mousedownNode = null;
                mouseupNode = null;
                return;
            }

            // unenlarge target node
            d3.select(this).attr('transform', '');

            // add link to graph (update if exists)
            // NB: links are strictly source < target; arrows separately specified by booleans
            const isRight = mousedownNode.id < mouseupNode.id;
            const source = isRight ? mousedownNode : mouseupNode;
            const target = isRight ? mouseupNode : mousedownNode;
            links.push({ source, target, left: !isRight, right: isRight });

            // select new link
            //selectedLink = link;
            mousedownNode = null;
            redraw();
        });

    g.append('svg:text')
        .attr('fill', 'black')
        .attr('font-size', '4px')
        .attr('x', nodeCircleRadius)
        .text(d => d.name);
    node = g.merge(node);

    // set the graph in motion
    simulation
        .nodes(nodes)
        .force('link').links(links);

    simulation.alphaTarget(0.3).restart();
}

function mousedown() {
    if (d3.event.ctrlKey || mousedownNode) return;

    // insert new node at point
    const point = d3.mouse(this);
    const newNode = { id: ++newNodeIdCounter, name: 'NEW', x: point[0], y: point[1] };
    nodes.push(newNode);

    redraw();
}

function mousemove() {
  if (!mousedownNode) return;

  // update drag line
  dragLine.attr('d', `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${d3.mouse(this)[1]}`);
}

svg
    .on('mousedown', mousedown)
    .on('mousemove', mousemove);

redraw();