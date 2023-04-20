/*
 * Based on the stacked area chart copyight by Observable.
 * Therefor is file is licensed under a different license.
 *
 * Copyright 2021 Observable, Inc.
 * Copyright Hilbrand Bouwkamp
 * Released under the ISC license.
 * https://observablehq.com/@d3/stacked-area-chart
 */
import * as d3 from "d3";

function StackedAreaChart(
  id,
  data,
  legenda,
  {
    x = ([x]) => x, // given d in data, returns the (ordinal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    xLabel,
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    zDomain, // array of z-values
    offset = d3.stackOffsetDiverging, // stack offset method
    order = d3.stackOrderNone, // stack order method
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier for the y-axis
    yLabel, // a label for the y-axis
    colors = d3.schemeTableau10, // array of colors for z
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  legenda.setColorFunction((i) => color(Z[i]));

  // Compute default x- and z-domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter((i) => zDomain.has(Z[i]));

  // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
  // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique x- and z-value.
  const series = d3
    .stack()
    .keys(zDomain)
    .value(([x, I], z) => Y[I.get(z)])
    .order(order)
    .offset(offset)(
      d3.rollup(
        I,
        ([i]) => i,
        (i) => X[i],
        (i) => Z[i]
      )
    )
    .map((s) => s.map((d) => Object.assign(d, { i: d.data[1].get(s.key) })));

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (yDomain === undefined) yDomain = d3.extent(series.flat(2));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80, xFormat)
    .tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);

  const area = d3
    .area()
    .x(({ i }) => xScale(X[i]))
    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2));

  d3.select(id).select("svg").remove();

  const svg = d3
    .select(id)
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)
    );

  svg
    .append("g")
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("fill", ([{ i }]) => color(Z[i]))
    .attr("d", area)
    .append("title")
    .text(([{ i }]) => Z[i]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call((g) =>
      g
        .append("text")
        .attr("x", 40)
        .attr("y", 30)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(xLabel)
    );

  //Line chart mouse over
  var hoverLineGroup = svg.append("g").attr("class", "hover-line");

  var hoverLine = hoverLineGroup
    .append("line")
    .attr("stroke", "#777")
    .attr("x1", 10)
    .attr("x2", 10)
    .attr("y1", 0)
    .attr("y2", height);

  hoverLineGroup.style("opacity", 1); //1e-6);

  svg.style("pointer-events", "all");

  svg
    .append("rect")
    .data(data)
    .attr("fill", "none")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);

  legenda.setUpdateFunction((i) => {
    let x = xScale(i);
    hoverLine.attr("x1", x).attr("x2", x);
  });
  // rectHover
  svg.on("mouseout", hoverMouseOff).on("mousemove", hoverMouseOn).on("mouseup", mouseUp);

  function hoverMouseOn(event) {
    onMouse(event, false);
  }

  function mouseUp(event) {
    onMouse(event, true);
  }

  function onMouse(event, legendaVast) {
    var mouse_x = d3.pointer(event)[0];
    var mouseXInvert = xScale.invert(mouse_x);
    var bisectX = d3.bisector((d) => d.id).left;
    var i = bisectX(data, mouseXInvert); // returns the index to the current data item
    var d = data[i];

    if (d == undefined) {
      return;
    }
    if (legendaVast) {
      legenda.setLegendaVast(data, series.length, i);
    } else {
      legenda.setLegendaText(data, series.length, i);
    }
    hoverLine.attr("x1", mouse_x).attr("x2", mouse_x);
  }

  function hoverMouseOff() {
    legenda.setGetal();
  }

  return Object.assign(svg.node(), { scales: { color } });
}

function makeChart(id, gegevens, width, legendaFunction) {
  let legenda = gegevens.berekenen.getLegenda();
  legenda.setLegendaFunction(legendaFunction);

  StackedAreaChart(id, gegevens.series, legenda, {
    x: (d) => d.id,
    y: (d) => d.getal * legenda.getFactorYas(),
    z: (d) => d.type,
    yDomain: gegevens.berekenen.getYDomain(),
    xLabel: "Arbeidsinkomen",
    yLabel: legenda.getLabelYAs(),
    width: width,
    height: 500,
  });
  legenda.setGetal();
}

export default {
  StackedAreaChart,
  makeChart,
};
