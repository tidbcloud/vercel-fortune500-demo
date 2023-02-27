"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartMap = void 0;

var _LineChart = require("@/components/Charts/LineChart");

var _NumberCard = require("@/components/Charts/NumberCard");

var _TableChart = require("@/components/Charts/TableChart");

var _PieChart = require("@/components/Charts/PieChart");

var _BarChart = require("@/components/Charts/BarChart");

var _MapChart = require("@/components/Charts/MapChart");

var ChartMap = {
  LineChart: _LineChart.LineChart,
  // NumberCard,
  PieChart: _PieChart.PieChart,
  BarChart: _BarChart.BarChart,
  Table: _TableChart.TableChart // MapChart,

};
exports.ChartMap = ChartMap;