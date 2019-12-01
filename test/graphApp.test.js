import {graphApp} from '../src/graphApp';

describe('calling graphApp with config', () => {
    const setTimeoutMs = 500;
    const vertices = [
        {id: 1},
        {id: 2}
    ];

    const edges = [
        {source: vertices[0], target: vertices[1]}
    ];

    const graphAppProperties = {
        svgWidth: 200,
        svgHeight: 200,
        vertexCircleRadius: 1,
        vertexCircleFill: '#6e6e6e',
        edgeLineStrokeWidth: 1
    };

    beforeEach(() => {
        document.body.innerHTML = '<div id="graph"></div>';
        graphApp({selector: '#graph', edges, vertices, ...graphAppProperties});
    });

    describe('should append svg', () => {
        test('with viewBox attribute', () => {
            const svg = document.querySelector('svg');
            expect(svg.getAttribute('viewBox')).toBe(`0,0,${graphAppProperties.svgWidth},${graphAppProperties.svgHeight}`);
        });
    });

    describe('should append svg:circle', () => {
        let svgCircles;

        beforeEach(() => {
            svgCircles = document.querySelectorAll('circle');
        });

        test(`should contain ${vertices.length} svg:circle(s)`, () => {
            expect(svgCircles.length).toBe(vertices.length);
        });

        test('should have svg:circle with r, fill properties', done => {
            setTimeout(() => {
                Array.from(svgCircles).map(circle => {
                    expect(circle.attributes['r'].value).toBe(graphAppProperties.vertexCircleRadius.toString());
                    expect(circle.attributes['fill'].value).toBe(graphAppProperties.vertexCircleFill);
                    expect(circle.getAttribute('transform')).toBeTruthy();
                });
                done();
              }, setTimeoutMs);
        });
    });

    describe('should append svg:line', () => {
        let svgLines;

        beforeEach(() => {
            svgLines = document.querySelectorAll('line');
        });

        test(`should contain ${edges.length} svg:line(s)`, () => {
            expect(svgLines.length).toBe(edges.length);
        });

        test('should have svg:line with stroke-width, x1,x2,y2,y2 properties', (done) => {
            setTimeout(() => {
                Array.from(svgLines).map(line => {
                    expect(line.getAttribute('stroke-width')).toBeTruthy();
                    expect(line.getAttribute('x1')).toBeTruthy();
                    expect(line.getAttribute('x2')).toBeTruthy();
                    expect(line.getAttribute('y1')).toBeTruthy();
                    expect(line.getAttribute('y2')).toBeTruthy();
                });
                done();
            }, setTimeoutMs);
        });
    });
});