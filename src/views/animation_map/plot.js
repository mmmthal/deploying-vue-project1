function legend1({
    color,
    title,
    tickSize = 6,
    width = 320,
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues
} = {}) {

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 40, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    let x;

    //continuous
    if (color.interpolator) {
        x = Object.assign(color.copy()
            .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
            { range() { return [marginLeft, width - marginRight]; } });

        svg.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight)
            .attr("height", height - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.interpolator()).toDataURL());

        //scaleSequentialQuantile doesn’t implement ticks or tickFormat.
        if (!x.ticks) {
            if (tickValues === undefined) {
                const n = Math.round(ticks + 1);
                tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
            }
            if (typeof tickFormat !== "function") {
                tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
            }
        }
    }

    //discrete
    else if (color.invertExtent) {
        const thresholds
            = color.thresholds ? color.thresholds() // scaleQuantize
                : color.quantiles ? color.quantiles() // scaleQuantile
                    : color.domain(); // scaleThreshold

        const thresholdFormat
            = tickFormat === undefined ? d => d
                : typeof tickFormat === "string" ? d3.format(tickFormat)
                    : tickFormat;

        x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([marginLeft, width - marginRight]);

        svg.append("g")
            .selectAll("rect")
            .data(color.range())
            .join("rect")
            .attr("x", (d, i) => x(i - 1))
            .attr("y", marginTop)
            .attr("width", (d, i) => x(i) - x(i - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", d => d);

        tickValues = d3.range(thresholds.length);
        tickFormat = i => thresholdFormat(thresholds[i], i);
    }

    svg.append("g")
        .attr("transform", `translate(0, ${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
        .call(g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(title));

    return svg.node();
}

function ramp(color, n = 256) {
    const canvas = DOM.canvas(n, 1);
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
    }
    return canvas;
}

/////////////////////////////////////////////////////////////
//choropleth code

var promises = [];

promises.push(d3.json('data/countries-110m.json'));
promises.push(d3.json('data/data2019.json'));

Promise.all(promises).then(function (values) {  //see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
    var us = values[0];
    var data = values[1];
    states = new Map(us.objects.land.geometries.map(d => [d.id, d.properties]));

    format = d => `${d}%`

    path = d3.geoPath()

    color = d3.scaleQuantize([0, 500000], d3.schemeBlues[8])  // Create a Quantize color scale based on d3.schemeBlues (9 shades of Blue) 

    //original line from Observable
    //data = Object.assign(new Map(await d3.csv("unemployment.csv", ({id, rate}) => [id, +rate])), {title: "Unemployment rate (%)"})
    data = Object.assign(new Map(data.slice(1).map(([country, value, id]) => [id, +value])));
    data.title = "Wind Electricity Generation";
    const projection = d3.geoCylindricalStereographic().scale(130);
    path = d3.geoPath(projection);

    // const svg = d3.create("svg") from Observable
    svg = d3.select("#svg2")
        .attr("viewBox", [0, -20, 975, 610]);

    svg.append("g")
        .attr("transform", "translate(610,20)")
        .append(() => legend1({ color, title: data.title, width: 260 }));

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.countries).features)
        .join("path")
        .attr("fill", d => color(data.get(d.id)))
        .attr("d", path)
        .append("title")
    // .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name} ${format(data.get(d.id))}`);

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.land, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
});