class StackedBarChart {

  /*
  * Constructor
  */
  constructor() {
    if (!d3) {
      throw new Error('D3Js library is required to be loaded first.');
    }
  }

  /*
  * Initialize chart object
  * @param (string) dom element selector
  * @param (object) input data to plot
  * @param (numeric) width optional
  * @param (numeric) height optional
  * @return (object) self
  */
  init(selector, input, width = 600, height = 500) {
    try {
      const margin = {top: 20, right: 30, bottom: 30, left: 30};

      this.svg = d3.select(selector)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      this.width = width - margin.left - margin.right,
      this.height = height - margin.top - margin.bottom;

      // format dataset as needed
      const dataset = this._format(input);

      // calculate the maxs values to set the domain in x axis
      const maxs = this._getMaxValues(dataset);

      // set y
      const y = d3.scaleBand()
        .paddingInner(0.2)
        .domain(Object.keys(dataset))
        .range([10, this.height - 10]);

      // set x
      const x = d3.scaleLinear()
        .domain([0, Math.max(...maxs) + 10])
        .range([1, this.width]);

      // adding x axis
      this.svg.append('g')
        .attr('class', 'd3-x d3-axis')
        .attr('transform', `translate(-1, ${this.height - 10})`)
        .call(d3.axisBottom(x));

      // adding y axis
      this.svg.append('g')
        .attr('class', 'd3-y d3-axis')
        .call(d3.axisLeft(y));

      // create groups for each series, rects for each segment
      this.groups = this.svg.selectAll('g.d3-serie')
        .data(Object.keys(dataset).map((key) => dataset[key]))
        .enter().append('g')
        .attr('class', 'd3-serie');

      this.rect = this.groups.selectAll('rect')
        .data((d) => d)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d[1]))
        .attr('y', (d) => y(d[0]))
        .attr('height', y.bandwidth())
        .attr('width', (d) => x(d[2] - d[1]))
        .on('mouseover', () => tooltip.style('display', null))
        .on('mouseout', () => tooltip.style('display', 'none'))
        .on('mousemove', function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip.attr('transform', `translate(${xPosition}, ${yPosition})`);
          tooltip.select('text').text(`${d[3]}`);
        });

      // prep the tooltip, initial display is hidden
      const tooltip = this.svg.append('g')
        .attr('class', 'd3-tooltip')
        .style('display', 'none');

      tooltip.append('rect')
        .attr('width', 80)
        .attr('height', 20)
        .attr('fill', 'white')
        .style('opacity', 0.5);

      tooltip.append('text')
        .attr('x', 40)
        .attr('dy', '1.2em')
        .style('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold');
    } catch (err) {
      console.log(err.message);
    }
    return this;
  }

  /*
  * Format input data
  * @param (object) input data to plot
  * @return (object) dataset
  */
  _format(input) {
    let dataset = {};
    // for each serie
    Object.keys(input).forEach((key) => {
      // for each value in serie
      dataset[key] = input[key].data.reduce((acc, current) => {
        // format data to use in the rect creation and tooltip
        // [ serie name, accumulated, accumulated + current, current ]

        acc.push((acc.length === 0) // if first
          ? [key, 0, current, current] // initial element in stack
          : [key, acc[acc.length - 1][2], acc[acc.length - 1][2] + current, current]); // else cumulative stack
        return acc;
      }, []);
    });
    return dataset;
  }

  /*
  * Get max value for each serie
  * @param (object) dataset
  * @return (array) [val1, val2, ... val#]
  */
  _getMaxValues(dataset) {
    return Object.keys(dataset).map((key) => {
      const last = dataset[key].length - 1;
      return dataset[key][last][2];
    });
  }

}
