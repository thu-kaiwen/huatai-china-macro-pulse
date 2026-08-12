import type { WeeklyChart, WeeklyReportPage } from "../domain/weeklyReport";

const source = "Wind，华泰研究";
const chart = (id: string, sectionId: WeeklyChart["sectionId"], title: string, workbookPath: string, worksheet: string, isHero = false): WeeklyChart => ({
  id, sectionId, title, assetPath: `/weekly-reports/2022-07-31/${id}.png`, source, periodLabel: "截至2022年7月29日（报告周）", workbookPath, worksheet, alt: title, isHero,
});

export const weeklyReport0731: WeeklyReportPage = {
  id: "weekly-2022-07-31",
  publishedAt: "2022-07-31",
  title: "工业减速地产暂稳，政策定调保底线",
  overview: "全国疫情仍有反复，上游重工业生产减速，但基建开工有所加快、汽车生产保持强势。上周房地产与土地成交增长均有所回升，持续性待进一步观察。国内原材料价格有所回升。政治局会议提出经济保“底线”，房地产“保交楼”，短期内可能不会加大刺激力度以及出台新的刺激性政策。",
  keyMetrics: [
    { id: "blast-furnace-rate", label: "高炉开工率", valueText: "-1.6个百分点", changeText: "环比下行", interpretation: "上游重工业生产减速", sourceText: "上周高炉开工率下行1.6个百分点，终端需求走弱压制焦钢企业利润。" },
    { id: "cement-starting-rate", label: "水泥企业开工率", valueText: "+1.0个百分点", changeText: "环比走高", interpretation: "基建开工有所加快", sourceText: "水泥开工率环比走高1个百分点，基建落地进度可能有所加快。" },
    { id: "land-transactions", label: "土地成交面积同比", valueText: "+45.9%", changeText: "同比上行", interpretation: "房地产与土地成交增长回升", sourceText: "上周土地成交同比大幅上行45.9%，主要是上海、东莞等地释放一批集中供地。" },
    { id: "copper-rebar", label: "铜与螺纹钢价格", valueText: "+5.7% / +4.9%", changeText: "周环比上行", interpretation: "国内原材料价格有所回升", sourceText: "周环比来看，螺纹钢价格上行4.9%，铜价格上行5.7%。" },
  ],
  heroCharts: ["heavy-industry-production", "cement-starting-rate", "land-transactions", "industrial-commodities"],
  sections: [
    { id: "activity", title: "高频经济活动跟踪", summary: "上游重工业生产减速，但汽车生产和销售保持较快增长；一二线城市房地产和土地成交明显回升。", detail: "水泥开工率环比走高1个百分点，钢材成交量环比上行5.2%；30城商品房成交面积同比跌幅收窄至14.1%，土地成交同比上行45.9%。", charts: [
      chart("passenger-vehicle-sales", "activity", "上周乘用车销量同比增长24.7%、继续加速", "data-excel/国内周报Part1/【21】乘用车销售.xlsx", "乘用车销售"),
      chart("metro-ridership", "activity", "18城地铁客运量同比降幅收窄至5.5%", "data-excel/国内周报Part1/【17,18】周报-消费活动跟踪-百城拥堵指数&18城地铁客运量（Wind）.xlsx", "18城地铁"),
      chart("heavy-industry-production", "activity", "焦化企业与高炉开工率环比下行", "data-excel/国内周报Part1/【2,3,4】周报-投资活动跟踪-焦化&高炉开工率&煤炭港口库存（Wind）.xlsx", "高炉开工率", true),
      chart("cement-starting-rate", "activity", "水泥企业开工率环比上升1.0个百分点", "data-excel/国内周报Part1/【7,8.13】周报-投资活动跟踪-铜库存&水泥开工率(磨机)&半钢胎开工率（Wind）.xlsx", "水泥开工率", true),
      chart("property-transactions-30-city", "activity", "30大中城市商品房成交面积同比下降14.1%", "data-excel/国内周报Part2/【23-26】新房和二手房成交及分线.xlsx", "30城商品房"),
      chart("land-transactions", "activity", "土地成交面积同比上升45.9%", "data-excel/国内周报Part2/【27-30】周报-投资活动跟踪-土地&二手房挂牌（Wind）.xlsx", "土地成交", true),
    ] },
    { id: "prices", title: "价格指标及通胀变化", summary: "国内原材料价格有所回升，但煤价持续下行。", detail: "布伦特原油回升至114美元/桶；螺纹钢和铜价上涨，动力煤、氯化钾和尿素价格下跌，运价和农产品价格走弱。", charts: [
      chart("brent-oil-price", "prices", "WTI与布伦特原油价格均环比回升", "data-excel/国内周报Part2/【35-36】周报-价格指标及通胀变化-油价大宗商品（iFind）.xlsx", "油价"),
      chart("industrial-commodities", "prices", "国内铜和螺纹钢价格上涨", "data-excel/国内周报Part2/【35-36】周报-价格指标及通胀变化-油价大宗商品（iFind）.xlsx", "大宗商品", true),
      chart("freight-indices", "prices", "BDI与中国进出口集装箱运价指数环比下降", "data-excel/国内周报Part2/【33-34】周报-价格指标及通胀变化-运价和商品指数（iFind）.xlsx", "运价"),
      chart("agricultural-prices", "prices", "农产品价格与猪肉批发价环比下行", "data-excel/国内周报Part2/【42-45】周报-价格指标及通胀变化-粮食&农产品&蔬果&猪肉（iFind）.xlsx", "农产品"),
    ] },
    { id: "financial", title: "利率、汇率及金融市场环境", summary: "短期流动性保持平稳，融资环境持续偏弱，人民币兑美元小幅上行。", detail: "R007和DR007分别上行13bp和15bp；国债收益率曲线略微陡峭下行，地产债、海外债与股票融资额走弱。", charts: [
      chart("dr007-r007", "financial", "上周DR007和R007分别上升", "data-excel/国内周报Part3/【49】DR007R007.xlsx", "DR007R007"),
      chart("government-yields", "financial", "国债收益率曲线略微走陡", "data-excel/国内周报Part3/【53,54,55,56,58】债券收益率（wind、ceic）.xlsx", "国债收益率"),
      chart("stock-market", "financial", "沪深300指数环比下降1.61%", "data-excel/国内周报Part3/【61】沪深300指数行情.xlsx", "沪深300"),
      chart("rmb-exchange-rate", "financial", "人民币兑一篮子货币小幅贬值、兑美元微升", "data-excel/国内周报Part3/【64】人民币兑美元和一篮子货币汇率.xlsx", "人民币汇率"),
    ] },
    { id: "policy", title: "宏观政策跟踪", summary: "政治局会议关注保底线，制造业利润分化加剧，7月PMI走弱至49%。", detail: "会议提出经济保“底线”、房地产“保交楼”；短期内可能不会加大刺激力度或出台新的刺激性政策。", charts: [
      chart("open-market-operations", "policy", "7月至今央行净回笼160亿元", "data-excel/国内周报Part3/【65&69】公开市场操作&宏观政策跟踪（wind）.xlsx", "公开市场操作"),
      chart("policy-tracker", "policy", "本周重要宏观数据与事件", "data-excel/国内周报Part3/【68】本周政策跟踪.xlsx", "政策跟踪"),
    ] },
  ],
  watchPoints: ["关注本周地产回暖能否持续。", "关注地方层面“保交楼”的责任主体及具体执行。", "继续跟踪基建相关资金投放和项目施工进度。"],
  risks: ["海外衰退风险加大。", "房地产去杠杆风险蔓延。"],
};
