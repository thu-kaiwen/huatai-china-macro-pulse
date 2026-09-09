import type { WeeklyDashboard, WeeklyLineDashboardChart } from "../domain/weeklyReport";

const ticks52 = [
  { index: 0, label: "1月" }, { index: 4, label: "2月" }, { index: 9, label: "3月" },
  { index: 13, label: "4月" }, { index: 17, label: "5月" }, { index: 22, label: "6月" },
  { index: 26, label: "7月" }, { index: 31, label: "8月" }, { index: 35, label: "9月" },
  { index: 39, label: "10月" }, { index: 44, label: "11月" }, { index: 51, label: "12月" },
];
const ticks12 = Array.from({ length: 12 }, (_, index) => ({ index, label: `${index + 1}月` }));
const ticks21 = [
  { index: 0, label: "25/1" }, { index: 3, label: "25/4" }, { index: 6, label: "25/7" },
  { index: 9, label: "25/10" }, { index: 12, label: "26/1" }, { index: 15, label: "26/4" },
  { index: 19, label: "26/8" }, { index: 20, label: "26/9" },
];
const pad = (values: Array<number | null>, total: number): Array<number | null> => [
  ...values,
  ...Array(Math.max(0, total - values.length)).fill(null),
];

const flights: WeeklyLineDashboardChart = {
  kind: "line", id: "domestic-flights", title: "国内航班数", subtitle: "周度绝对量｜2024–2026年季节性",
  unit: "班", totalPoints: 52, yDomain: [155_000, 230_000], xTicks: ticks52, currentValue: "189,991 班",
  changeText: "周同比 +2.1%｜周环比 -10.0%", endpointLabel: "周同比 +2.1%", source: "CAPA、华泰研究（截至2026年9月5日；由报告指数按底稿基期还原）",
  series: [
    { id: "flights-2024", label: "2024", tone: "lightBlue", values: [180048,182775,186532,194140,203491,197517,203676,203743,197340,183312,180233,181495,183516,181060,184972,186777,190836,197705,186291,184198,183666,181828,178158,185013,190159,196833,205249,206754,208323,208288,209102,209978,210140,207503,199696,189254,187556,184766,192493,201436,191006,186136,182527,178212,177189,176743,177316,176878,173667,173293,173530,176051] },
    { id: "flights-2025", label: "2025", tone: "blue", values: [180105,184759,199672,205716,197565,206962,200941,192370,181826,175415,177909,180765,182711,180858,186483,186028,189076,196998,188512,184659,185016,183243,181845,183766,188634,196949,210481,213203,210289,211255,211513,212605,213380,213428,204751,186039,187017,187629,191309,205291,198145,185571,184351,178080,176926,177693,178829,179927,178308,176964,177132,178292] },
    { id: "flights-2026", label: "2026", tone: "red", values: pad([181289,179095,184074,189460,194297,207409,212185,205672,213494,200500,189339,186254,187183,185056,184518,181682,184475,192290,185154,172401,174436,170444,165006,170822,179637,190881,202786,212370,219410,219990,219772,221761,221761,220989,211037,189991], 52) },
  ],
};

export const weeklyNewHomesSeasonality: WeeklyLineDashboardChart = {
  kind: "line", id: "tier-one-new-home", title: "一线城市新房成交面积", subtitle: "日均成交面积｜分年季节性",
  unit: "万平方米", totalPoints: 12, yDomain: [0, 15], xTicks: ticks12, currentValue: "周均 6.35",
  changeText: "周同比 +28.2%", endpointLabel: "6.35", source: "新房和二手房成交及分线.xlsx",
  series: [
    { id: "new-2023", label: "2023", tone: "gray", values: [6.41,3.97,7.18,10.87,9.5,10.64,8.66,7.09,9.29,8.02,7.72,8.72] },
    { id: "new-2024", label: "2024", tone: "lightBlue", values: [6.88,2.86,7.27,7.34,6.48,9.25,7.89,7.49,6.35,10.33,11.58,12.27] },
    { id: "new-2025", label: "2025", tone: "blue", values: [6.67,4.9,8.61,7.18,7.8,8.75,5.86,5.76,7.38,6.38,6.63,7.94] },
    { id: "new-2026", label: "2026", tone: "red", values: pad([5.31,3.17,8.02,8.53,8.59,8.56,6.63,6.35], 12) },
  ],
};

export const weeklyUsedHomesSeasonality: WeeklyLineDashboardChart = {
  kind: "line", id: "tier-one-used-home", title: "一线城市二手房成交面积", subtitle: "日均成交面积｜分年季节性",
  unit: "万平方米", totalPoints: 12, yDomain: [0, 20], xTicks: ticks12, currentValue: "周均 10.63",
  changeText: "周同比 +10.8%", endpointLabel: "10.63", source: "新房和二手房成交及分线.xlsx",
  series: [
    { id: "used-2023", label: "2023", tone: "gray", values: [4.72,11.32,14.27,10.61,9.21,8.29,7.39,7.93,8.7,7.75,9.09,9.01] },
    { id: "used-2024", label: "2024", tone: "lightBlue", values: [9.02,4.65,10.46,9.93,10.01,13.05,11.46,10.27,9.44,13.14,15.21,17.43] },
    { id: "used-2025", label: "2025", tone: "blue", values: [10.35,10.01,15.28,13.15,11.48,12,10.61,10.63,11.97,9.69,11.96,12.68] },
    { id: "used-2026", label: "2026", tone: "red", values: pad([12.05,6.71,15.17,14.85,13.71,13.68,11.78,10.63], 12) },
  ],
};

const coking: WeeklyLineDashboardChart = {
  kind: "line", id: "coking-rate", category: "上游", title: "焦化企业开工率", subtitle: "周度｜2024–2026年季节性",
  unit: "%", totalPoints: 52, yDomain: [54, 74], xTicks: ticks52, currentValue: "57.96%", changeText: "周环比持平｜同比 -8.2个百分点", endpointLabel: "57.96%",
  source: "Wind、华泰研究（截至2026年9月4日）", interpretation: "焦化开工率处在近年同期低位，上游生产承压。",
  series: [
    { id: "coking-2024", label: "2024", tone: "lightBlue", values: [71.3,70.18,67.76,68.07,65.6,65.68,65.72,64.42,62.51,61.31,60.18,58.84,58.4,57.97,57.38,57.94,58.43,59.84,64.78,65.31,65.65,65.64,65.79,66.44,66.27,66.36,67,67.07,66.45,65.73,65.41,65.26,64.57,64.14,61.15,61.26,60.48,60.35,60.89,62.58,65.02,65.37,65.16,65.05,65,64.74,65.57,65.18,65.29,65.17,64.24,64.58] },
    { id: "coking-2025", label: "2025", tone: "blue", values: [64.64,64.89,65.27,64.97,null,65.26,65.26,64.99,64.41,63.54,61.95,63.73,63.96,64.73,64.98,65.26,67.24,67.47,67.29,67.57,67.39,67.23,67.55,66.68,66.01,65.95,65.96,65.61,65.8,66.41,66.54,66.8,67.15,67.15,65.62,66.19,68.39,67.94,68.24,67.8,67.72,67.2,66.51,65.79,64.78,64.22,64.1,64.74,65.16,64.55,63.78,63.66] },
    { id: "coking-2026", label: "2026", tone: "red", values: pad([63.837,64.27,63.19,62.9,62.007,62.667,63.247,63.057,65.107,64.717,65.02,65.287,66.19,65.997,65.987,65.62,66.233,65.873,65.88,65.413,66.033,65.23,65.713,65.483,64.23,64.367,63.863,64.253,64.18,64.863,63.67,62.927,62.333,61.263,58.007,57.96], 52) },
  ],
};

const blastFurnace: WeeklyLineDashboardChart = {
  kind: "line", id: "blast-furnace-rate", category: "上游", title: "高炉开工率", subtitle: "周度｜2024–2026年季节性",
  unit: "%", totalPoints: 52, yDomain: [72, 87], xTicks: ticks52, currentValue: "82.30%", changeText: "周环比 +0.4个百分点｜同比 +2.3个百分点", endpointLabel: "82.30%",
  source: "Wind、华泰研究（截至2026年9月4日）", interpretation: "高炉开工率周环比小幅回升，且高于去年同期。",
  series: [
    { id: "blast-2024", label: "2024", tone: "lightBlue", values: [75.17,75.65,76.1,76.25,76.84,76.5,76.78,76.35,75.61,75.17,75.62,76.17,76.92,76.58,77.83,78.43,78.88,79.75,80.6,81.52,81.52,81.52,81.67,81.48,82.07,82.83,83.13,82.79,82.48,82.65,82.31,81.26,80.19,78.82,77.45,76.39,77.65,77.65,78.25,78.25,79.59,80.81,81.7,82.16,82.46,82.27,82.06,81.91,81.6,81.45,80.53,79.61] },
    { id: "blast-2025", label: "2025", tone: "blue", values: [78.69,78.08,77.16,77.16,78,78,78,77.66,78.31,79.53,80.6,81.98,82.13,83.15,83.3,83.58,84.35,84.35,84.64,84.13,83.67,83.89,83.54,83.39,83.84,83.84,83.44,83.13,83.48,83.48,83.48,83.77,83.57,83.34,83.18,80.38,83.85,84,84.47,84.27,84.25,84.25,84.73,81.73,83.15,82.79,82.17,81.07,80.14,78.61,78.45,78.3] },
    { id: "blast-2026", label: "2026", tone: "red", values: pad([78.96,79.33,78.82,78.66,79.02,79.55,80.15,null,80.24,77.69,78.36,79.8,81.05,83.09,83.22,83.22,83.03,83.38,83.24,83.54,84.16,84.16,83.92,84.27,84.27,84.43,83.97,83.82,82.71,82.07,81.83,82.34,82.66,82.82,82.3], 52) },
  ],
};

const steel: WeeklyLineDashboardChart = {
  kind: "line", id: "construction-steel", category: "中游", title: "建筑钢材现货成交量", subtitle: "周均｜2024–2026年季节性",
  unit: "千吨", totalPoints: 52, yDomain: [0, 180], xTicks: ticks52, currentValue: "91.78 千吨", changeText: "周环比 -3.5%｜同比 -5.3%", endpointLabel: "91.78",
  source: "Mysteel、华泰研究（截至2026年9月4日）", interpretation: "建筑钢材成交量同环比均回落，传统基建与建筑需求仍偏弱。",
  series: [
    { id: "steel-2024", label: "2024", tone: "lightBlue", values: [135.91,124.65,108.05,83.04,24.04,4.15,100.17,89.75,101.7,111.29,159.05,122.81,164.94,161.99,155.84,138.87,129.55,138.04,133.9,139.34,119.75,121.69,127.44,111.87,118.26,131.72,118.03,115.44,103.34,113.45,104.4,94.89,121.99,120.58,98.73,124.48,109.39,147.91,141.16,131.29,132.94,120.2,116.67,124.06,111.8,116.09,113.8,112.94,114.58,108.53,109.02,103.73] },
    { id: "steel-2025", label: "2025", tone: "blue", values: [103.73,85.18,66.28,null,null,null,60.82,104.06,101.96,96.21,110.38,105.1,115.02,122.76,111.78,108.72,121.29,112.34,102.7,109.99,95.33,101.72,106.13,99.58,97.42,98.68,106.8,99.28,93.73,114.71,94.06,103.39,102.28,94.83,94.4,96.97,103.1,106.52,103.95,101.11,109.14,96.7,100.58,104.34,96.41,100.14,100.39,104.56,99.01,98.22,99.25,94.99] },
    { id: "steel-2026", label: "2026", tone: "red", values: pad([97.896,95.475,91.866,77.799,67.394,34.882,null,null,null,56.553,97.485,94.399,93.056,97.381,101.983,113.985,114.704,117.544,126.497,98.331,89.226,88.66,93.271,91.838,88.406,90.935,90.509,88.582,83.937,84.726,82.102,90.868,80.308,92.727,95.066,91.783], 52) },
  ],
};

const metro: WeeklyLineDashboardChart = {
  kind: "line", id: "metro-ridership", category: "经济活动", title: "18城地铁客运量", subtitle: "月均日度客运量｜分年季节性",
  unit: "千万人次/日", totalPoints: 12, yDomain: [3.4, 5.5], xTicks: ticks12, currentValue: "4,685 万人次/日", changeText: "周环比 -5.7%｜同比 -1.8%", endpointLabel: "4.68",
  source: "Wind、华泰研究（截至2026年9月3日）", interpretation: "居民市内交通出行景气度边际回落。",
  series: [
    { id: "metro-2024", label: "2024", tone: "lightBlue", values: [4.77,3.81,4.92,4.43,4.88,4.79,5.04,4.91,4.63,4.85,4.92,4.92] },
    { id: "metro-2025", label: "2025", tone: "blue", values: [4.65,4.34,5.12,5.11,5.02,4.9,5.09,5.02,4.79,4.89,5.18,5.07] },
    { id: "metro-2026", label: "2026", tone: "red", values: pad([5.12,4.04,5.06,5.18,5.04,4.86,4.91,4.97,4.68], 12) },
  ],
};

const brentHero: WeeklyLineDashboardChart = {
  kind: "line", id: "brent-oil", title: "Brent原油价格", subtitle: "2025/1/1=100｜能源供给冲击",
  unit: "指数", totalPoints: 21, yDomain: [75, 165], xTicks: ticks21, currentValue: "96.3 美元/桶",
  changeText: "周环比 +7.8%", endpointLabel: "+7.8%", source: "Wind、华泰研究（截至2026年9月4日）",
  series: [{ id: "brent-hero", label: "Brent原油", tone: "red", values: [102.8,98,100.1,84.6,85.6,90.6,97.2,91.3,89.8,87.2,84.7,81.5,94.7,97.1,158.6,152.7,123.3,97.7,120.7,111.9,128.9] }],
};

const propertyPulse: WeeklyLineDashboardChart = {
  kind: "line", id: "tier-one-property", title: "一线城市住房成交同比", subtitle: "2023年至今｜7日移动平均",
  unit: "%", totalPoints: 48, yDomain: [-90, 190],
  xTicks: [{ index: 0, label: "23/1" }, { index: 12, label: "24/1" }, { index: 24, label: "25/1" }, { index: 36, label: "26/1" }, { index: 44, label: "26/9" }, { index: 47, label: "26/12" }],
  currentValue: "新房 +22.7%｜二手房 +12.5%", changeText: "周同比", endpointLabel: "+12.5%",
  source: "Wind、华泰研究（截至2026年8月30日）",
  series: [
    { id: "tier-one-new-yoy", label: "一线新房", tone: "red", weeklyChange: "周同比 +22.7%", values: [-76.92,-13.82,20.44,91.84,22.75,49.71,66.4,43.14,76.76,26,38.9,27.56,40.51,93.22,-11.59,-22.36,-26.32,3.6,-11.9,-1.92,-41.1,40.54,42.61,45.51,-41.33,92.78,6.36,-6.41,17.48,-8.19,-20.33,-14.65,18.92,-43.24,-40.38,-31.57,35.94,-79.08,0.14,6.33,15,-15.2,1.8,8.03,22.7,null,null,null] },
    { id: "tier-one-used-yoy", label: "一线二手房", tone: "blue", weeklyChange: "周同比 +12.5%", values: [-66.47,51.86,10.01,-18.38,-28.55,-31.22,-27.32,-24.11,-21.61,-22.94,-20.94,-18.92,-28.19,94.89,-28.22,1.9,25.9,78.85,50.66,35.65,13.11,74.89,70.22,84.89,-28.42,105.01,43.09,46.83,10.22,-8.97,-1.34,10.24,34.01,-21.05,-24.8,-15.13,173.6,-73.67,10.55,31.65,31.2,6.05,11.63,9.13,12.5,null,null,null] },
  ],
};

const priceChart = (chart: Omit<WeeklyLineDashboardChart, "kind" | "unit" | "totalPoints" | "xTicks">): WeeklyLineDashboardChart => ({
  ...chart, kind: "line", unit: "指数", totalPoints: 21, xTicks: ticks21,
});

export const weeklyDashboard0906: WeeklyDashboard = {
  heroCharts: [
    brentHero, flights, propertyPulse,
    {
      kind: "bonds", id: "bond-issuance", title: "利率债发行结构", subtitle: "亿元｜三组分区独立刻度",
      currentValue: "本周 5,893亿元", changeText: "同比多增 264亿元（+4.7%）", source: "Wind、华泰研究；按周频底稿累计至9月6日",
      groups: [
        { title: "本年（1月1日至9月6日）", scaleMax: 250000, bars: [
          { label: "去年同期", segments: [{ label: "国债", value: 108115.6, tone: "red" }, { label: "地方政府债", value: 77678.22, tone: "blue" }, { label: "政策性银行债", value: 50351.6, tone: "gray" }] },
          { label: "本年", segments: [{ label: "国债", value: 107285.3, tone: "red" }, { label: "地方政府债", value: 82426.2676, tone: "blue" }, { label: "政策性银行债", value: 47452.11, tone: "gray" }] },
        ] },
        { title: "本月（9月1日至9月6日）", scaleMax: 7000, bars: [
          { label: "去年本月", segments: [{ label: "国债", value: 3490.7, tone: "red" }, { label: "地方政府债", value: 933.91, tone: "blue" }, { label: "政策性银行债", value: 1205, tone: "gray" }] },
          { label: "本月", segments: [{ label: "国债", value: 3223.2, tone: "red" }, { label: "地方政府债", value: 1560.2557, tone: "blue" }, { label: "政策性银行债", value: 1110, tone: "gray" }] },
        ] },
        { title: "本周（8月31日至9月6日）", scaleMax: 7000, bars: [
          { label: "去年同期", segments: [{ label: "国债", value: 3490.7, tone: "red" }, { label: "地方政府债", value: 933.91, tone: "blue" }, { label: "政策性银行债", value: 1205, tone: "gray" }] },
          { label: "本周", segments: [{ label: "国债", value: 3223.2, tone: "red" }, { label: "地方政府债", value: 1560.2557, tone: "blue" }, { label: "政策性银行债", value: 1110, tone: "gray" }] },
        ] },
      ],
    },
  ],
  activityCharts: [coking, blastFurnace, steel, metro],
  priceCharts: [
    priceChart({ id: "raw-materials", title: "原材料价格指数", subtitle: "2025/1/1=100｜不含黄金", yDomain: [75, 165], source: "Wind、iFind、华泰研究；报告底稿价格序列定基计算", series: [
      { id: "brent", label: "Brent原油", tone: "red", weeklyChange: "周环比 +7.8%", values: [102.8,98,100.1,84.6,85.6,90.6,97.2,91.3,89.8,87.2,84.7,81.5,94.7,97.1,158.6,152.7,123.3,97.7,120.7,111.9,128.9] },
      { id: "copper", label: "铜", tone: "blue", weeklyChange: "周环比 +0.5%", values: [102.4,104.3,108.8,105.1,105.4,108.1,106.3,107.3,112.8,118.2,118.2,133.7,146.8,139.3,129.5,137,142.1,138.9,143,146.4,147.1] },
      { id: "thermal-coal", label: "动力煤", tone: "gray", weeklyChange: "周环比 +0.4%", values: [99.7,98.7,97.4,96.4,95.2,94.3,94.5,95.4,96.3,97.4,99.3,98.9,97.4,97.4,97.9,98.7,100.1,101.6,101.7,101.6,102] },
      { id: "coking-coal", label: "焦煤", tone: "purple", weeklyChange: "周环比 +6.2%", values: [97,91.7,87.6,88,83.1,78.6,91.3,95.9,100.5,104.1,104.2,101.1,103.4,99.9,104.2,103,108.3,122.4,121.1,121.3,128.8] },
    ] }),
    priceChart({ id: "industrial-products", title: "工业品价格指数", subtitle: "2025/1/1=100｜不含氯化钾", yDomain: [60, 140], source: "Wind、iFind、华泰研究；报告底稿价格序列定基计算", series: [
      { id: "rebar", label: "螺纹钢", tone: "red", weeklyChange: "周环比 +1.6%", values: [101.8,100.2,95.8,93.5,89.5,90.9,97.9,93.8,93.3,93.9,93.5,94.4,95,92.4,94.5,96.7,95.3,93.1,91,90.9,92.4] },
      { id: "cement", label: "水泥", tone: "blue", weeklyChange: "周环比 +0.5%", values: [96.4,92.9,93.1,90.7,86.8,85.8,80.6,80.8,84,84.9,84.8,84.5,82.7,80.6,81.5,78.3,77.6,78.1,77.3,77.1,77.5] },
      { id: "pe", label: "聚乙烯", tone: "teal", weeklyChange: "周环比 +9.1%", values: [95.1,96.9,93.7,86.9,85.3,89.2,90.2,89.5,87.6,85,82.6,79.2,86,80.7,106.4,103.3,95.5,84.9,94.3,94,102.6] },
      { id: "sbr", label: "丁苯橡胶", tone: "purple", weeklyChange: "周环比 +7.5%", values: [106.2,99.3,95.9,82.1,82.1,82.1,83.4,86.2,81.4,77.2,74.5,79.3,89.7,88.3,131,111.7,98.6,82.8,91.7,90.3,97.1] },
      { id: "urea", label: "尿素", tone: "orange", weeklyChange: "周环比 -0.3%", values: [95.8,99.6,103.3,100.6,103.4,99.4,98.4,96.7,92.2,89.2,90.9,94.5,95,96.3,101,100.9,100,99.8,96.7,95.8,95.5] },
    ] }),
    priceChart({ id: "agricultural-products", title: "农产品价格指数", subtitle: "2025/1/1=100", yDomain: [60, 120], source: "Wind、iFind、华泰研究；报告底稿价格序列定基计算", series: [
      { id: "agri-index", label: "农产品指数", tone: "blue", weeklyChange: "周环比 +0.7%", values: [105.5,97.5,97.9,95.9,93.6,92.2,92.5,95.9,97.3,102.4,103.9,105.8,106.9,105.3,98,94.9,92.6,90.5,93.1,93.3,94] },
      { id: "vegetables", label: "蔬菜", tone: "red", weeklyChange: "周环比 +2.2%", values: [110.9,95.2,93.8,85.1,83.9,84.9,85.5,95.7,97.1,110.3,112.2,109.1,108.9,102.7,92.4,82.6,81,82,85.1,86.2,88.1] },
      { id: "fruit", label: "水果", tone: "orange", weeklyChange: "周环比 +2.0%", values: [105.2,104.9,106.5,106.6,110.1,102.1,100.7,96.2,97.5,98.9,101.4,111.2,111.1,111.1,108.4,107.7,107.9,103.4,94.9,97.3,99.2] },
      { id: "corn", label: "玉米", tone: "purple", weeklyChange: "周环比持平", values: [101.8,104.5,106.7,109,112.2,114.5,113.5,111.4,111.6,105.5,109.8,110.8,112,112.2,115.6,115,114.3,113.6,112.3,111.2,111.2] },
      { id: "wheat", label: "小麦", tone: "teal", weeklyChange: "周环比持平", values: [100,101.6,101.2,102.5,102.4,102.1,102,101.4,101.8,103.9,104.6,105,105.6,105.8,108,107.7,105.8,102.7,101.1,100.5,100.5] },
      { id: "pork", label: "猪肉", tone: "gray", weeklyChange: "周环比 +0.6%", values: [104.5,93.3,93.7,92.1,92.4,90.5,93.4,89.2,86.4,79.6,79.8,78.7,83.3,79.2,70.4,66.9,66.5,64.8,70.8,70.7,71.1] },
    ] }),
  ],
  financeGroups: [
    { title: "资金与债券市场", rows: [
      { id: "dr007", label: "DR007", value: "1.373%", change: "-1.3bp", direction: "negative", trend: [1.5926,1.5034,1.423,1.3897,1.3809,1.4587,1.4469,1.418,1.3726], observation: "银行间流动性维持宽松" },
      { id: "r007", label: "R007", value: "1.403%", change: "-0.5bp", direction: "negative", trend: [1.6401,1.5074,1.4888,1.3998,1.3997,1.5268,1.4624,1.4207,1.4027], observation: "与DR007利差较窄" },
      { id: "cgb-1y", label: "1年期国债收益率", value: "1.234%", change: "+2.1bp", direction: "positive", trend: [1.3008,1.3191,1.2062,1.1641,1.1578,1.1218,1.1473,1.2232,1.2337], observation: "短端收益率上行" },
      { id: "cgb-10y", label: "10年期国债收益率", value: "1.680%", change: "-1.5bp", direction: "negative", trend: [1.8104,1.7752,1.8153,1.7464,1.7108,1.73,1.7126,1.6879,1.6803], observation: "收益率曲线趋平" },
    ] },
    { title: "汇率与权益市场", rows: [
      { id: "usdcny", label: "在岸人民币兑美元", value: "6.710", change: "+0.22%", direction: "positive", trend: [6.9568,6.8727,6.9034,6.8326,6.7376,6.792,6.7526,6.7214,6.7104], observation: "人民币对美元继续升值" },
      { id: "usdcnh", label: "离岸人民币兑美元", value: "6.712", change: "+0.33%", direction: "positive", trend: [6.9514,6.8589,6.8979,6.829,6.768,6.7901,6.7544,6.722,6.7124], observation: "离岸与在岸汇率接近" },
      { id: "cfets", label: "人民币一篮子货币指数", value: "101.64", change: "基本持平", direction: "neutral", trend: [97.131,98.7437,101.0136,100.4254,100.993,102.8715,102.267,101.6424,101.6424], observation: "一篮子汇率保持稳定" },
      { id: "csi300", label: "沪深300指数", value: "4,548", change: "-1.33%", direction: "negative", trend: [4706.34,4710.65,4450.05,4807.31,4892.12,4979.43,4588.2,4625.09,4548.05], observation: "权益市场周环比回落" },
      { id: "csi300-pe", label: "沪深300 PE（TTM）", value: "13.64倍", change: "下行", direction: "negative", trend: [14.5825,14.5216,13.9581,14.6946,14.5634,13.6871,13.5895,13.782,13.6436], observation: "估值较前一周下行" },
    ] },
  ],
  policyEvents: [
    { date: "8月31日", title: "国务院常务会议研究促进高质量发展有关工作", detail: "审议通过《中华人民共和国银行法（修订草案）》，并听取城市地下管网建设情况汇报。" },
    { date: "9月1日", title: "工信部等十部门印发中小企业发展“十五五”规划", detail: "强化企业梯度培育、融资支持、科技创新与数字化转型。" },
    { date: "9月4日", title: "国家金融监督管理总局就保险法修订草案征求意见", detail: "完善保险公司规则、强化风险处置和金融风险防范。" },
  ],
  policyCalendar: [
    { date: "9/7", label: "重要经济数据观察周开启" }, { date: "9/8", label: "8月进出口数据" },
    { date: "9/9", label: "8月CPI与PPI" }, { date: "9/10–11", label: "8月金融数据窗口" },
  ],
};

export const weeklyDashboard0809 = weeklyDashboard0906;
