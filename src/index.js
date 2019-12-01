import {graphApp} from './graphApp';

const vertices = [
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
];

const edges = [
    {source: vertices[0], target: vertices[1]},
    {source: vertices[0], target: vertices[2]},
    {source: vertices[0], target: vertices[3]}
];

const graphAppProperties = {
    svgWidth: 300,
    svgHeight: 200,
    vertexCircleRadius: 2,
    vertexCircleFill: '#6e6e6e'
};

graphApp({selector: '#graph', edges, vertices, ...graphAppProperties});