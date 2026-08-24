import type { WeeklyDashboard, WeeklyLineDashboardChart } from "../domain/weeklyReport";

const ticks52 = [
  { index: 0, label: "1月" }, { index: 4, label: "2月" }, { index: 9, label: "3月" },
  { index: 13, label: "4月" }, { index: 17, label: "5月" }, { index: 22, label: "6月" },
  { index: 26, label: "7月" }, { index: 31, label: "8月" }, { index: 35, label: "9月" },
  { index: 39, label: "10月" }, { index: 44, label: "11月" }, { index: 51, label: "12月" },
];
const ticks12 = Array.from({ length: 12 }, (_, index) => ({ index, label: `${index + 1}月` }));
const ticks20 = [
  { index: 0, label: "25/1" }, { index: 3, label: "25/4" }, { index: 6, label: "25/7" },
  { index: 9, label: "25/10" }, { index: 12, label: "26/1" }, { index: 15, label: "26/4" },
  { index: 19, label: "26/8" },
];
const pad = (values: number[], total: number): Array<number | null> => [
  ...values,
  ...Array(Math.max(0, total - values.length)).fill(null),
];

const flights: WeeklyLineDashboardChart = {
  kind: "line", id: "domestic-flights", title: "国内航班数", subtitle: "周度绝对量｜2024–2026年季节性",
  unit: "班", totalPoints: 52, yDomain: [155_000, 230_000], xTicks: ticks52, currentValue: "221,761 班",
  changeText: "周同比 +4.3%｜周环比 +0.9%", endpointLabel: "周同比 +4.3%", source: "CAPA航空.xlsx（截至2026年8月8日）",
  series: [
    { id: "flights-2024", label: "2024", tone: "lightBlue", values: [180048,182775,186532,194140,203491,197517,203676,203743,197340,183312,180233,181495,183516,181060,184972,186777,190836,197705,186291,184198,183666,181828,178158,185013,190159,196833,205249,206754,208323,208288,209102,209978,210140,207503,199696,189254,187556,184766,192493,201436,191006,186136,182527,178212,177189,176743,177316,176878,173667,173293,173530,176051] },
    { id: "flights-2025", label: "2025", tone: "blue", values: [180105,184759,199672,205716,197565,206962,200941,192370,181826,175415,177909,180765,182711,180858,186483,186028,189076,196998,188512,184659,185016,183243,181845,183766,188634,196949,210481,213203,210289,211255,211513,212605,213380,213428,204751,186039,187017,187629,191309,205291,198145,185571,184351,178080,176926,177693,178829,179927,178308,176964,177132,178292] },
    { id: "flights-2026", label: "2026", tone: "red", values: pad([181289,179095,184074,189460,194297,207409,212185,205672,213494,200500,189339,186254,187183,185056,184518,181682,184475,192290,185154,172401,174436,170444,165006,170822,179637,190881,202786,212370,219410,219990,219772,221761], 52) },
  ],
};

const newHomes: WeeklyLineDashboardChart = {
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

const usedHomes: WeeklyLineDashboardChart = {
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
  unit: "%", totalPoints: 52, yDomain: [54, 74], xTicks: ticks52, currentValue: "62.93%", changeText: "周环比 -0.7个百分点｜同比 -3.9个百分点", endpointLabel: "62.93%",
  source: "焦化&高炉开工率&煤炭港口库存.xlsx", interpretation: "焦化开工率继续回落，上游生产仍偏弱。",
  series: [
    { id: "coking-2024", label: "2024", tone: "lightBlue", values: [71.3,70.18,67.76,68.07,65.6,65.68,65.72,64.42,62.51,61.31,60.18,58.84,58.4,57.97,57.38,57.94,58.43,59.84,64.78,65.31,65.65,65.64,65.79,66.44,66.27,66.36,67,67.07,66.45,65.73,65.41,65.26,64.57,64.14,61.15,61.26,60.48,60.35,60.89,62.58,65.02,65.37,65.16,65.05,65,64.74,65.57,65.18,65.29,65.17,64.24,64.58] },
    { id: "coking-2025", label: "2025", tone: "blue", values: [64.64,64.89,65.27,64.97,null,65.26,65.26,64.99,64.41,63.54,61.95,63.73,63.96,64.73,64.98,65.26,67.24,67.47,67.29,67.57,67.39,67.23,67.55,66.68,66.01,65.95,65.96,65.61,65.8,66.41,66.54,66.8,67.15,67.15,65.62,66.19,68.39,67.94,68.24,67.8,67.72,67.2,66.51,65.79,64.78,64.22,64.1,64.74,65.16,64.55,63.78,63.66] },
    { id: "coking-2026", label: "2026", tone: "red", values: [63.84,64.27,63.19,62.9,62.01,62.67,63.25,63.06,65.11,64.72,65.02,65.29,66.19,66,65.99,65.62,66.23,65.87,65.88,65.41,66.03,65.23,65.71,65.48,64.23,64.37,63.86,64.25,64.18,64.86,63.67,62.93,...Array(20).fill(null)] },
  ],
};

const blastFurnace: WeeklyLineDashboardChart = {
  kind: "line", id: "blast-furnace-rate", category: "上游", title: "高炉开工率", subtitle: "周度｜2024–2026年季节性",
  unit: "%", totalPoints: 52, yDomain: [72, 87], xTicks: ticks52, currentValue: "82.34%", changeText: "周环比 +0.5个百分点｜同比 -1.4个百分点", endpointLabel: "82.34%",
  source: "焦化&高炉开工率&煤炭港口库存.xlsx", interpretation: "高炉开工率周环比回升，但仍低于去年同期。",
  series: [
    { id: "blast-2024", label: "2024", tone: "lightBlue", values: [75.17,75.65,76.1,76.25,76.84,76.5,76.78,76.35,75.61,75.17,75.62,76.17,76.92,76.58,77.83,78.43,78.88,79.75,80.6,81.52,81.52,81.52,81.67,81.48,82.07,82.83,83.13,82.79,82.48,82.65,82.31,81.26,80.19,78.82,77.45,76.39,77.65,77.65,78.25,78.25,79.59,80.81,81.7,82.16,82.46,82.27,82.06,81.91,81.6,81.45,80.53,79.61] },
    { id: "blast-2025", label: "2025", tone: "blue", values: [78.69,78.08,77.16,77.16,78,78,78,77.66,78.31,79.53,80.6,81.98,82.13,83.15,83.3,83.58,84.35,84.35,84.64,84.13,83.67,83.89,83.54,83.39,83.84,83.84,83.44,83.13,83.48,83.48,83.48,83.77,83.57,83.34,83.18,80.38,83.85,84,84.47,84.27,84.25,84.25,84.73,81.73,83.15,82.79,82.17,81.07,80.14,78.61,78.45,78.3] },
    { id: "blast-2026", label: "2026", tone: "red", values: [78.96,79.33,78.82,78.66,79.02,79.55,80.15,null,80.24,77.69,78.36,79.8,81.05,83.09,83.22,83.22,83.03,83.38,83.24,83.54,84.16,84.16,83.92,84.27,84.27,84.43,83.97,83.82,82.71,82.07,81.83,82.34,...Array(20).fill(null)] },
  ],
};

const steel: WeeklyLineDashboardChart = {
  kind: "line", id: "construction-steel", category: "中游", title: "建筑钢材现货成交量", subtitle: "周均｜2024–2026年季节性",
  unit: "千吨", totalPoints: 52, yDomain: [0, 180], xTicks: ticks52, currentValue: "90.87 千吨", changeText: "周环比 +10.7%｜同比 -12.1%", endpointLabel: "90.87",
  source: "建材&螺纹钢库存.xlsx", interpretation: "成交量环比改善，但同比仍偏弱。",
  series: [
    { id: "steel-2024", label: "2024", tone: "lightBlue", values: [135.91,124.65,108.05,83.04,24.04,4.15,100.17,89.75,101.7,111.29,159.05,122.81,164.94,161.99,155.84,138.87,129.55,138.04,133.9,139.34,119.75,121.69,127.44,111.87,118.26,131.72,118.03,115.44,103.34,113.45,104.4,94.89,121.99,120.58,98.73,124.48,109.39,147.91,141.16,131.29,132.94,120.2,116.67,124.06,111.8,116.09,113.8,112.94,114.58,108.53,109.02,103.73] },
    { id: "steel-2025", label: "2025", tone: "blue", values: [103.73,85.18,66.28,null,null,null,60.82,104.06,101.96,96.21,110.38,105.1,115.02,122.76,111.78,108.72,121.29,112.34,102.7,109.99,95.33,101.72,106.13,99.58,97.42,98.68,106.8,99.28,93.73,114.71,94.06,103.39,102.28,94.83,94.4,96.97,103.1,106.52,103.95,101.11,109.14,96.7,100.58,104.34,96.41,100.14,100.39,104.56,99.01,98.22,99.25,94.99] },
    { id: "steel-2026", label: "2026", tone: "red", values: [97.9,95.47,91.87,77.8,67.39,34.88,null,null,null,56.55,97.49,94.4,93.06,97.38,101.98,113.98,114.7,117.54,126.5,98.33,89.23,88.66,93.27,91.84,88.41,90.94,90.51,88.58,83.94,84.73,82.1,90.87,...Array(20).fill(null)] },
  ],
};

const metro: WeeklyLineDashboardChart = {
  kind: "line", id: "metro-ridership", category: "经济活动", title: "18城地铁客运量", subtitle: "月均日度客运量｜分年季节性",
  unit: "千万人次/日", totalPoints: 12, yDomain: [3.4, 5.5], xTicks: ticks12, currentValue: "4,852 万人次/日", changeText: "周环比 +3.3%｜同比 +0.4%", endpointLabel: "4.87",
  source: "百城拥堵指数&18城地铁客运量.xlsx", interpretation: "暑期出行保持较高活跃度。",
  series: [
    { id: "metro-2024", label: "2024", tone: "lightBlue", values: [4.77,3.81,4.92,4.43,4.88,4.79,5.04,4.91,4.63,4.85,4.92,4.92] },
    { id: "metro-2025", label: "2025", tone: "blue", values: [4.65,4.34,5.12,5.11,5.02,4.9,5.09,5.02,4.79,4.89,5.18,5.07] },
    { id: "metro-2026", label: "2026", tone: "red", values: pad([5.12,4.04,5.06,5.18,5.04,4.86,4.91,4.87], 12) },
  ],
};

const priceChart = (chart: Omit<WeeklyLineDashboardChart, "kind" | "unit" | "totalPoints" | "xTicks">): WeeklyLineDashboardChart => ({
  ...chart, kind: "line", unit: "指数", totalPoints: 20, xTicks: ticks20,
});

export const weeklyDashboard0809: WeeklyDashboard = {
  heroCharts: [
    flights, newHomes, usedHomes,
    {
      kind: "bonds", id: "bond-issuance", title: "利率债发行结构", subtitle: "亿元｜三组分区独立刻度",
      currentValue: "本周 7,118", changeText: "同比少增 967亿元", source: "周度利率债发行.xlsx；按周频底稿累计至8月9日",
      groups: [
        { title: "本年（1月1日至8月9日）", scaleMax: 220000, bars: [
          { label: "上年同期", segments: [{ label: "国债", value: 97595.4, tone: "red" }, { label: "地方政府债", value: 68622.5, tone: "blue" }, { label: "政策性银行债", value: 44456.6, tone: "gray" }] },
          { label: "本年", segments: [{ label: "国债", value: 94055.6, tone: "red" }, { label: "地方政府债", value: 71565.2, tone: "blue" }, { label: "政策性银行债", value: 41873.2, tone: "gray" }] },
        ] },
        { title: "本月（8月1日至8月9日）", scaleMax: 16000, bars: [
          { label: "去年本月", segments: [{ label: "国债", value: 6488.1, tone: "red" }, { label: "地方政府债", value: 5026.3, tone: "blue" }, { label: "政策性银行债", value: 3295, tone: "gray" }] },
          { label: "本月", segments: [{ label: "国债", value: 4530, tone: "red" }, { label: "地方政府债", value: 3081, tone: "blue" }, { label: "政策性银行债", value: 3200, tone: "gray" }] },
        ] },
        { title: "本周（8月3日至8月9日）", scaleMax: 9000, bars: [
          { label: "去年同期", segments: [{ label: "国债", value: 4685.5, tone: "red" }, { label: "地方政府债", value: 1654.6, tone: "blue" }, { label: "政策性银行债", value: 1745, tone: "gray" }] },
          { label: "本周", segments: [{ label: "国债", value: 3630, tone: "red" }, { label: "地方政府债", value: 1818.4, tone: "blue" }, { label: "政策性银行债", value: 1670, tone: "gray" }] },
        ] },
      ],
    },
  ],
  activityCharts: [coking, blastFurnace, steel, metro],
  priceCharts: [
    priceChart({ id: "raw-materials", title: "原材料价格指数", subtitle: "2025/1/1=100｜不含黄金", yDomain: [75, 165], source: "Wind、iFind；Excel原始价格序列定基计算", series: [
      { id: "brent", label: "Brent原油", tone: "red", weeklyChange: "周环比 -7.3%", values: [102.8,98,100.1,84.6,85.6,90.6,97.2,91.3,89.8,87.2,84.7,81.5,94.7,97.1,158.6,152.7,123.3,97.7,120.7,111.9] },
      { id: "copper", label: "铜", tone: "blue", weeklyChange: "周环比 +0.8%", values: [102.4,104.3,108.8,105.1,105.4,108.1,106.3,107.3,112.8,118.2,118.2,133.7,146.8,139.3,129.5,137,142.1,138.9,143,146.4] },
      { id: "thermal-coal", label: "动力煤", tone: "gray", weeklyChange: "周环比 -0.1%", values: [99.7,98.7,97.4,96.4,95.2,94.3,94.5,95.4,96.3,97.4,99.3,98.9,97.4,97.4,97.9,98.7,100.1,101.6,101.7,101.6] },
      { id: "coking-coal", label: "焦煤", tone: "purple", weeklyChange: "周环比 +0.2%", values: [97,91.7,87.6,88,83.1,78.6,91.3,95.9,100.5,104.1,104.2,101.1,103.4,99.9,104.2,103,108.3,122.4,121.1,121.3] },
    ] }),
    priceChart({ id: "industrial-products", title: "工业品价格指数", subtitle: "2025/1/1=100｜不含氯化钾", yDomain: [60, 140], source: "Wind、iFind；Excel原始价格序列定基计算", series: [
      { id: "rebar", label: "螺纹钢", tone: "red", weeklyChange: "周环比 -2.0%", values: [101.8,100.2,95.8,93.5,89.5,90.9,97.9,93.8,93.3,93.9,93.5,94.4,95,92.4,94.5,96.7,95.3,93.1,91,90.9] },
      { id: "cement", label: "水泥", tone: "blue", weeklyChange: "周环比 -0.2%", values: [96.4,92.9,93.1,90.7,86.8,85.8,80.6,80.8,84,84.9,84.8,84.5,82.7,80.6,81.5,78.3,77.6,78.1,77.3,77.1] },
      { id: "pe", label: "聚乙烯", tone: "teal", weeklyChange: "周环比 -0.4%", values: [95.1,96.9,93.7,86.9,85.3,89.2,90.2,89.5,87.6,85,82.6,79.2,86,80.7,106.4,103.3,95.5,84.9,94.3,94] },
      { id: "sbr", label: "丁苯橡胶", tone: "purple", weeklyChange: "周环比 -1.5%", values: [106.2,99.3,95.9,82.1,82.1,82.1,83.4,86.2,81.4,77.2,74.5,79.3,89.7,88.3,131,111.7,98.6,82.8,91.7,90.3] },
      { id: "urea", label: "尿素", tone: "orange", weeklyChange: "周环比 -0.9%", values: [95.8,99.6,103.3,100.6,103.4,99.4,98.4,96.7,92.2,89.2,90.9,94.5,95,96.3,101,100.9,100,99.8,96.7,95.8] },
    ] }),
    priceChart({ id: "agricultural-products", title: "农产品价格指数", subtitle: "2025/1/1=100", yDomain: [60, 120], source: "Wind、iFind；Excel原始价格序列定基计算", series: [
      { id: "agri-index", label: "农产品指数", tone: "blue", weeklyChange: "周环比 +0.3%", values: [105.5,97.5,97.9,95.9,93.6,92.2,92.5,95.9,97.3,102.4,103.9,105.8,106.9,105.3,98,94.9,92.6,90.5,93.1,93.3] },
      { id: "vegetables", label: "蔬菜", tone: "red", weeklyChange: "周环比 +1.4%", values: [110.9,95.2,93.8,85.1,83.9,84.9,85.5,95.7,97.1,110.3,112.2,109.1,108.9,102.7,92.4,82.6,81,82,85.1,86.2] },
      { id: "fruit", label: "水果", tone: "orange", weeklyChange: "周环比 +2.5%", values: [105.2,104.9,106.5,106.6,110.1,102.1,100.7,96.2,97.5,98.9,101.4,111.2,111.1,111.1,108.4,107.7,107.9,103.4,94.9,97.3] },
      { id: "corn", label: "玉米", tone: "purple", weeklyChange: "周环比 -0.9%", values: [101.8,104.5,106.7,109,112.2,114.5,113.5,111.4,111.6,105.5,109.8,110.8,112,112.2,115.6,115,114.3,113.6,112.3,111.2] },
      { id: "wheat", label: "小麦", tone: "teal", weeklyChange: "周环比 -0.6%", values: [100,101.6,101.2,102.5,102.4,102.1,102,101.4,101.8,103.9,104.6,105,105.6,105.8,108,107.7,105.8,102.7,101.1,100.5] },
      { id: "pork", label: "猪肉", tone: "gray", weeklyChange: "周环比 -0.2%", values: [104.5,93.3,93.7,92.1,92.4,90.5,93.4,89.2,86.4,79.6,79.8,78.7,83.3,79.2,70.4,66.9,66.5,64.8,70.8,70.7] },
    ] }),
  ],
  financeGroups: [
    { title: "资金与债券市场", rows: [
      { id: "dr007", label: "DR007", value: "1.39%", change: "-5.9bp", direction: "negative", trend: [1.5926,1.5034,1.423,1.3897,1.3809,1.4587,1.4469,1.3881], observation: "银行间流动性偏松" },
      { id: "r007", label: "R007", value: "1.41%", change: "-5.3bp", direction: "negative", trend: [1.6401,1.5074,1.4888,1.3998,1.3997,1.5268,1.4624,1.4092], observation: "与DR007利差收窄" },
      { id: "cgb-1y", label: "1年期国债收益率", value: "1.20%", change: "+5.8bp", direction: "positive", trend: [1.3008,1.3191,1.2062,1.1641,1.1578,1.1218,1.1473,1.2036], observation: "短端上行" },
      { id: "cgb-10y", label: "10年期国债收益率", value: "1.71%", change: "-0.3bp", direction: "negative", trend: [1.8104,1.7752,1.8153,1.7464,1.7108,1.73,1.7126,1.7113], observation: "收益率曲线趋平" },
    ] },
    { title: "汇率与权益市场", rows: [
      { id: "usdcny", label: "在岸人民币兑美元", value: "6.747", change: "+0.10%", direction: "positive", trend: [6.9514,6.8589,6.8979,6.829,6.768,6.7901,6.7544,6.7479], observation: "人民币小幅升值" },
      { id: "usdcnh", label: "离岸人民币兑美元", value: "6.748", change: "+0.08%", direction: "positive", trend: [6.9568,6.8727,6.9034,6.8326,6.7376,6.792,6.7526,6.7473], observation: "离岸与在岸接近" },
      { id: "cfets", label: "CFETS人民币汇率指数", value: "102.02", change: "-0.24%", direction: "negative", trend: [96.99,98.58,100.87,100.17,100.66,102.59,102.19,102.02], observation: "一篮子汇率回落" },
      { id: "csi300", label: "沪深300指数", value: "4,694", change: "+2.32%", direction: "positive", trend: [4706,4711,4450,4807,4892,4979,4588,4694], observation: "风险偏好改善" },
      { id: "csi300-pe", label: "沪深300 PE（TTM）", value: "14.42倍", change: "上行", direction: "positive", trend: [14.5825,14.5216,13.9581,14.6946,14.5634,14.4876,14.3842,14.423], observation: "高于历史均值12.52倍" },
    ] },
  ],
  policyEvents: [
    { date: "8月4日", title: "部署新型电力系统建设", detail: "围绕“十五五”规划衔接，推进电网、储能和调节能力建设。" },
    { date: "8月5日", title: "商务部公布对美反制措施进展", detail: "进一步完善出口管制与不可靠实体清单相关安排。" },
    { date: "8月7日", title: "光伏行业召开反“内卷式”竞争座谈会", detail: "强调规范低价竞争、推动落后产能退出。" },
    { date: "8月8日", title: "北京进一步优化房地产政策", detail: "调整住房限购、公积金支持及住房赠与政策。" },
  ],
  policyCalendar: [
    { date: "8/10", label: "7月社会融资规模" }, { date: "8/11", label: "新增人民币贷款" },
    { date: "8/12", label: "二季度货币政策执行报告" }, { date: "8/14", label: "工业增加值、社零及固定资产投资" },
  ],
};
