class ScatterPlot {

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
  * @param (object) threshold
  * @param (numeric) width optional
  * @param (numeric) height optional
  * @return (object) self
  */
  init(selector, threshold, width = 600, height = 500) {
    try {
      this.width = width;
      this.height = height;
      this.threshold = threshold;
      this.color = ['#bb0000', '#0000bb', '#bbbbbb'];
      this.maxX = this.maxY = Number.MIN_SAFE_INTEGER;
      this.minX = this.minY = Number.MAX_SAFE_INTEGER;
      this.pointsets = [[], [], []];

      // svg for axis plot
      this.svg = d3.select(selector)
        .attr('width', this.width)
        .attr('height', this.height);

      // canvas helper to plot dots faster than svg!
      this.canvas = d3.select(`${selector}-canvas`)
        .attr('width', this.width)
        .attr('height', this.height);

      // set height for the container
      $(selector).parent().css('height', `${this.height + 50}px`);

      // scale factor
      this.k = this.height / this.width;

      // set x
      this.x = d3.scaleLinear()
        .domain([-1, 1])
        .range([0, this.width]);

      // set y
      this.y = d3.scaleLinear()
        .domain([-1 * this.k, 1 * this.k])
        .range([this.height, 0]);

      // adding x axis
      this.xAxis = d3.axisTop(this.x).ticks(12);
      this.gx = this.svg.append('g')
        .attr('class', 'd3-axis d3-axis-x')
        .attr('transform', `translate(0, ${this.height})`)
        .call(this.xAxis);

      // adding y axis
      this.yAxis = d3.axisRight(this.y).ticks(12 * this.k);
      this.gy = this.svg.append('g')
        .attr('class', 'd3-axis d3-axis-y')
        .attr('transform', 'translate(0, 0)')
        .call(this.yAxis);

      // set zoomed function to plot dots in canvas
      this.zoom = d3.zoom()
        .on('zoom', this.zoomed());

      // hide domains
      this.svg.selectAll('.domain')
        .style('display', 'none');

    } catch (err) {
      console.log(err.message);
    }

    return this;
  }

  /*
  * Zoomed function to plot dots in canvas
  * this function keep the correspondency
  * between canvas dots coords and svg axis
  * @return function
  */
  zoomed() {
    return () => {
      const transform = d3.event.transform;
      const zx = transform.rescaleX(this.x);
      const zy = transform.rescaleY(this.y);

      this.gx.call(this.xAxis.scale(zx));
      this.gy.call(this.yAxis.scale(zy));

      // get the canvas context
      const context = this.canvas.node().getContext('2d');
      context.clearRect(0, 0, this.width, this.height);

      // for each poinsets
      for (let j = 0, m = this.pointsets.length; j < m; ++j) {
        context.beginPath();
        // set the color for the pointset
        context.fillStyle = this.color[j];
        // for each point in the pointset
        for (let points = this.pointsets[j], i = 0, n = points.length, p, px, py; i < n; ++i) {
          // calculate coords for the dot to match axis
          p = points[i], px = zx(p[0]), py = zy(p[1]);
          context.moveTo(px + 1, py);
          context.arc(px, py, 1, 0, 2 * Math.PI);
        }
        context.fill();
      }
    };
  }

  /*
  * Start d3 interval to automatically zoom
  * in order to scale the chart while it is
  * loading the dots
  */
  startInterval() {
    this.stop = false;
    this.interval = d3.interval(() => {
      // check stop call
      if (this.stop) this.interval.stop();

      // update axes domain
      this.x.domain([this.minX, this.maxX]);
      this.y.domain([this.minY * this.k, this.maxY * this.k]);

      // get max and min for translation
      const x0 = this.x(this.minX);
      const x1 = this.x(this.maxX);
      const y0 = this.y(this.maxY);
      const y1 = this.y(this.minY);

      // set k zoom to see all the dots
      const k = this.k * 0.8;

      // calculate translation to keep dots in the middle
      const tx = (this.width - k * (x0 + x1)) / 2;
      const ty = (this.height - k * (y0 + y1)) / 2;

      // start a transition to center and zoom the chart
      this.svg.transition()
        .duration(5000)
        .call(this.zoom.transform, d3.zoomIdentity
          .translate(tx, ty)
          .scale(k));
    }, 500);
  }

  /*
  * Set to stop the interval
  */
  stopInterval() {
    this.stop = true;
  }

  /*
  * Add the dots coords to the pointsets
  * and classify them by the threshold
  * also it calculate min and max for
  * axis domain
  * @param (array) dot name and coords
  */
  addPoint(dot) {
    // if not valid coords ignore
    if (!dot[1] || !dot[2]) return;

    // create 3 sets of point based in the threshold
    // dot[1] = Log2FoldChange and dot[2] = pvalue
    if (dot[1] > this.threshold.maxLog2FoldChange && dot[2] > this.threshold.pvalue) {
      this.pointsets[0].push([dot[1], dot[2]]);
    } else if (dot[1] < this.threshold.minLog2FoldChange && dot[2] > this.threshold.pvalue) {
      this.pointsets[1].push([dot[1], dot[2]]);
    } else {
      this.pointsets[2].push([dot[1], dot[2]]);
    }

    this.maxX = (dot[1] > this.maxX) ? dot[1] : this.maxX;
    this.maxY = (dot[2] > this.maxY) ? dot[2] : this.maxY;

    this.minX = (dot[1] < this.minX) ? dot[1] : this.minX;
    this.minY = (dot[2] < this.minY) ? dot[2] : this.minY;

  }

  /*
  * Set the threshold and trigger the interval
  * to refresh the chart
  * @param (object) threshold
  */
  setThreshold(threshold) {
    this.threshold = threshold;
    const points = d3.merge(this.pointsets);
    this.pointsets = [[], [], []];
    points.forEach((dot) => {
      dot.unshift('name');
      this.addPoint(dot);
    });
    this.startInterval();
    this.stopInterval();
  }

}
