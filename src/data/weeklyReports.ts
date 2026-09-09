import type { WeeklyChart, WeeklyReportPage } from "../domain/weeklyReport";
import { weeklyDashboard0906 } from "./weeklyDashboard";

const reportDate = "2026-09-06";
const reportSource = "华泰研究；图表数据来自 Wind、iFind、CEIC、CAPA、Mysteel 等，详见图表来源";
const reportPeriod = "2026 年 9 月 6 日发布；各指标截至 9 月 4–6 日";
const image = (number: number) => {
  const extension = [41, 43, 47, 68].includes(number) ? "jpg" : "png";
  return `/weekly-reports/${reportDate}/charts/chart-${String(number).padStart(2, "0")}.${extension}`;
};

function chart(
  number: number,
  sectionId: WeeklyChart["sectionId"],
  id: string,
  title: string,
  workbookPath: string,
  worksheet: string,
  isHero = false,
): WeeklyChart {
  return { id, sectionId, title, assetPath: image(number), source: reportSource, periodLabel: reportPeriod, workbookPath, worksheet, alt: title, isHero };
}

const part1 = "data-excel/国内周报Part1";
const part2 = "data-excel/国内周报Part2";
const part3 = "data-excel/国内周报Part3";

export const weeklyReport0906: WeeklyReportPage = {
  id: "weekly-2026-09-06",
  dashboard: weeklyDashboard0906,
  publishedAt: reportDate,
  title: "能源供给压力的挤压效应有所上升",
  overview: "美伊冲突升级再度推升国际油价，国内原材料及农产品价格普遍上涨。居民市内交通出行景气度边际回落，基建与建筑活动持续承压，工业生产或因原材料涨价而受到压制。地产成交淡季呈现低位改善，一线城市维持相对韧性。地方债发行同比略多增、后续重点关注财政发力的可持续性。",
  keyMetrics: [
    { id: "brent-oil", label: "Brent原油", valueText: "96.3美元/桶", changeText: "周环比 +7.8%", interpretation: "能源供给压力再度上升", sourceText: "截至9月4日，Brent原油价格周环比上涨7.8%至96.3美元/桶。" },
    { id: "metro-ridership", label: "18城地铁客运量", valueText: "-1.8%", changeText: "周同比", interpretation: "市内交通景气度回落", sourceText: "8月28日至9月3日，18城地铁客运量同比下降1.8%、环比下降5.7%。" },
    { id: "tier-one-property", label: "一线城市住房成交", valueText: "+22.7% / +12.5%", changeText: "新房 / 二手房周同比", interpretation: "一线城市维持相对韧性", sourceText: "一线城市新房、二手房成交面积同比分别增长22.7%和12.5%。" },
    { id: "government-bond-issuance", label: "利率债发行同比", valueText: "+4.7%", changeText: "同比多增264亿元", interpretation: "地方债发行同比略多增", sourceText: "8月31日至9月6日利率债总发行5893亿元，同比多增264亿元。" },
  ],
  heroCharts: ["domestic-flights", "construction-steel-transactions", "tier-one-new-home-sales", "government-bond-issuance"],
  sections: [
    {
      id: "activity", title: "高频经济活动跟踪",
      summary: "居民市内交通出行景气度边际回落，基建与建筑活动持续承压；工业生产分化，一线城市地产成交保持韧性。",
      detail: "居民市内交通出行景气度边际回落：18城地铁客运量同比下降1.8%，百城拥堵指数同比下降2.5%；国内、国际航班数同比分别增长2.1%和0.3%。生产端焦化企业开工率同比下降8.2个百分点，高炉开工率同比上升2.3个百分点；建筑钢材成交量同比下降5.3%、环比下降3.5%。一线城市新房和二手房成交同比分别增长22.7%和12.5%。",
      charts: [
        chart(1, "activity", "power-generation", "全国重点电厂日均发电量同比下行5.9%", `${part1}/【1,5,6,9,12,14】电厂&螺纹钢产量&水泥发运率（Wind+iFind）.xlsx`, "【1】重点电厂日均发电量"),
        chart(2, "activity", "coal-port-inventory", "主流港口煤炭库存同比增加557.1万吨", `${part1}/【2,3,4】周报-投资活动跟踪-焦化&高炉开工率&煤炭港口库存（Wind）.xlsx`, "【2】煤炭港口库存"),
        chart(3, "activity", "coking-operating-rate", "焦化开工率同比下行3.9个百分点，环比下行0.7个百分点", `${part1}/【2,3,4】周报-投资活动跟踪-焦化&高炉开工率&煤炭港口库存（Wind）.xlsx`, "【3】焦化企业开工率"),
        chart(4, "activity", "blast-furnace-rate", "高炉开工率同比下行1.4个百分点，环比上行0.5个百分点", `${part1}/【2,3,4】周报-投资活动跟踪-焦化&高炉开工率&煤炭港口库存（Wind）.xlsx`, "【4】高炉开工率"),
        chart(5, "activity", "rail-freight", "铁路货运量同比下行1.4%", `${part1}/【1,5,6,9,12,14】电厂&螺纹钢产量&水泥发运率（Wind+iFind）.xlsx`, "【5】铁路货运量"),
        chart(6, "activity", "highway-freight", "高速公路货车通行量同比上行1.1%", `${part1}/【1,5,6,9,12,14】电厂&螺纹钢产量&水泥发运率（Wind+iFind）.xlsx`, "【6】高速公路货车通行量"),
        chart(7, "activity", "copper-inventory", "铜库存同比下行6.0万吨，环比下行0.1万吨", `${part1}/【7,8.13】周报-投资活动跟踪-铜库存&水泥开工率(磨机)&半钢胎开工率（Wind）.xlsx`, "【7】铜库存"),
        chart(8, "activity", "semi-steel-tire-rate", "半钢胎企业开工率同比下行10.0个百分点，环比下行1.3个百分点", `${part1}/【7,8.13】周报-投资活动跟踪-铜库存&水泥开工率(磨机)&半钢胎开工率（Wind）.xlsx`, "【8】半钢胎企业开工率"),
        chart(9, "activity", "rebar-output", "8月1日–7日螺纹钢产量同比下行14.2%，环比下行5.3%", `${part1}/【1,5,6,9,12,14】电厂&螺纹钢产量&水泥发运率（Wind+iFind）.xlsx`, "【9】螺纹钢产量"),
        chart(10, "activity", "rebar-inventory", "螺纹钢库存同比上行33.7%，环比上行1.1%", `${part1}/【10,11】周报-投资活动跟踪-建材&螺纹钢库存(粗钢&钢煤组).xlsx`, "【10】螺纹钢库存"),
        chart(11, "activity", "construction-steel-transactions", "建筑钢材成交量同比下行12.1%，环比上行10.7%", `${part1}/【10,11】周报-投资活动跟踪-建材&螺纹钢库存(粗钢&钢煤组).xlsx`, "【11】建筑钢材成交量", true),
        chart(12, "activity", "asphalt-operating-rate", "沥青装置开工率同比下行8.8个百分点，环比上行2.3个百分点", `${part1}/【1,5,6,9,12,14】电厂&螺纹钢产量&水泥发运率（Wind+iFind）.xlsx`, "【12】沥青装置开工率"),
        chart(13, "activity", "cement-operating-rate", "水泥企业开工率同比下行1.9个百分点，环比下行1.2个百分点", `${part1}/【7,8.13】周报-投资活动跟踪-铜库存&水泥开工率(磨机)&半钢胎开工率（Wind）.xlsx`, "【13】水泥企业开工率"),
        chart(14, "activity", "cement-shipment-rate", "水泥企业发运率同比上行0.1个百分点，环比下行0.3个百分点（未更新）", `${part1}/【1,5,6,9,12,14】电厂&螺纹钢产量&水泥发运率（Wind+iFind）.xlsx`, "【14】水泥企业发运率"),
        chart(15, "activity", "aluminum-profile-rate", "铝型材开工率同比上行2.4个百分点，环比下行0.6个百分点（未更新）", `${part1}/【15,16】铝型材开工率+玻璃库存（建筑建材）.xlsx`, "【15】铝型材开工率"),
        chart(16, "activity", "glass-inventory", "玻璃库存同比上行25.9%，环比下行0.7%", `${part1}/【15,16】铝型材开工率+玻璃库存（建筑建材）.xlsx`, "【16】玻璃库存"),
        chart(17, "activity", "metro-ridership", "18城地铁客运量同比上行0.4%，环比上行3.3%", `${part1}/【17,18】周报-消费活动跟踪-百城拥堵指数&18城地铁客运量（Wind）.xlsx`, "【17】18城地铁客运量"),
        chart(18, "activity", "traffic-congestion", "百城拥堵指数同比基本持平，环比下行0.1%", `${part1}/【17,18】周报-消费活动跟踪-百城拥堵指数&18城地铁客运量（Wind）.xlsx`, "【18】百城拥堵指数"),
        chart(19, "activity", "domestic-flights", "8月2日–8日国内航班数同比上行4.3%，环比上行0.9%", `${part1}/【19,20】CAPA航空.xlsx`, "【19】国内航班数", true),
        chart(20, "activity", "international-flights", "8月2日–8日国际航班数同比下行3.1%，环比上行0.4%", `${part1}/【19,20】CAPA航空.xlsx`, "【20】国际航班数"),
        chart(21, "activity", "passenger-vehicle-sales", "7月27日–31日乘用车销量同比回落14.6%，环比上行51.8%", `${part1}/【21】乘用车销售.xlsx`, "【21】乘用车销售"),
        chart(22, "activity", "movie-box-office", "8月1日–7日全国电影票房同比下行23.7%，环比下行19.9%", `${part1}/【22】电影票房（Wind）.xlsx`, "【22】电影票房"),
        chart(23, "activity", "new-home-sales", "上周新房成交面积同比下行6.4%", `${part2}/【23-26】新房和二手房成交及分线.xlsx`, "【23】新房成交面积"),
        chart(24, "activity", "tier-one-new-home-sales", "一线城市新房成交同比上行28.2%", `${part2}/【23-26】新房和二手房成交及分线.xlsx`, "【24】一线城市新房成交", true),
        chart(25, "activity", "second-hand-home-sales", "上周22城二手房成交面积同比放缓至3.8%", `${part2}/【23-26】新房和二手房成交及分线.xlsx`, "【25】二手房成交面积"),
        chart(26, "activity", "tier-one-second-hand-sales", "一线城市二手房成交同比上行10.8%", `${part2}/【23-26】新房和二手房成交及分线.xlsx`, "【26】一线城市二手房成交"),
        chart(27, "activity", "land-sales", "土地成交面积同比下行40.2%", `${part2}/【27-30】周报-投资活动跟踪-土地&二手房挂牌（Wind）.xlsx`, "【27】土地成交面积"),
        chart(28, "activity", "tier-one-land-sales", "一线城市土地成交面积同比上行137.8%", `${part2}/【27-30】周报-投资活动跟踪-土地&二手房挂牌（Wind）.xlsx`, "【28】一线城市土地成交"),
        chart(29, "activity", "second-hand-listing-price", "全国二手房出售挂牌价指数环比下行0.1%", `${part2}/【27-30】周报-投资活动跟踪-土地&二手房挂牌（Wind）.xlsx`, "【29】二手房挂牌价"),
        chart(30, "activity", "land-floor-price", "百城土地成交楼面均价环比上行162.5%", `${part2}/【27-30】周报-投资活动跟踪-土地&二手房挂牌（Wind）.xlsx`, "【30】土地成交楼面均价"),
        chart(31, "activity", "export-nowcast", "出口高频指标（HDET）显示8月首周出口同比有所放缓", `${part2}/【33-34】周报-价格指标及通胀变化-运价和商品指数（iFind）.xlsx`, "【31】出口高频指标"),
        chart(32, "activity", "yiwu-index", "义乌中国小商品景气指数同比边际放缓（未更新）", `${part2}/【33-34】周报-价格指标及通胀变化-运价和商品指数（iFind）.xlsx`, "【32】义乌景气指数"),
        chart(33, "activity", "bdi-index", "BDI运价指数环比上行13.1%", `${part2}/【33-34】周报-价格指标及通胀变化-运价和商品指数（iFind）.xlsx`, "【33】BDI运价指数"),
        chart(34, "activity", "ccfi-index", "中国出口集装箱运价指数环比下行0.9%", `${part2}/【33-34】周报-价格指标及通胀变化-运价和商品指数（iFind）.xlsx`, "【34】出口集装箱运价指数"),
      ],
    },
    {
      id: "prices", title: "价格指标及通胀变化",
      summary: "国际油价显著上行，国内原材料与农产品价格普遍上涨，能源供给压力对工业生产和通胀的挤压效应上升。",
      detail: "Brent原油周环比上涨7.8%至96.3美元/桶；铜和螺纹钢价格分别上涨0.5%和1.6%，动力煤和焦煤上涨0.4%和6.2%，水泥上涨0.5%。聚乙烯、丁苯橡胶分别上涨9.1%和7.5%。农产品价格指数上涨0.7%，蔬菜、水果和猪肉分别上涨2.2%、2.0%和0.6%。",
      charts: [
        chart(35, "prices", "brent-oil", "上周布伦特原油环比下行7.3%", `${part2}/【35-36】周报-价格指标及通胀变化-油价大宗商品（iFind）.xlsx`, "【35】布伦特原油"),
        chart(36, "prices", "industrial-material-prices", "上周国内铜价环比上行0.8%，螺纹钢价格环比下行2.0%", `${part2}/【35-36】周报-价格指标及通胀变化-油价大宗商品（iFind）.xlsx`, "【36】铜与螺纹钢价格"),
        chart(37, "prices", "metal-oil-gold-ratios", "上周铜金比同比上行16.0%，油金比同比下行1.3%", `${part2}/【37】金铜比&金油比（Wind+iFind）.xlsx`, "【37】金铜比与金油比"),
        chart(38, "prices", "coal-prices", "上周动力煤价格环比下行0.1%，焦煤价格环比上行0.2%", `${part2}/【38-39】周报-价格指标及通胀变化-煤炭水泥（iFind）.xlsx`, "【38】煤炭价格"),
        chart(39, "prices", "cement-prices", "上周水泥价格环比下行0.2%", `${part2}/【38-39】周报-价格指标及通胀变化-煤炭水泥（iFind）.xlsx`, "【39】水泥价格"),
        chart(40, "prices", "fertilizer-prices", "氯化钾价格环比下行0.1%，尿素价格环比下行0.9%", `${part2}/【40-41】周报-价格指标及通胀变化-化肥化工产品（iFind）.xlsx`, "【40】化肥价格"),
        chart(41, "prices", "chemical-prices", "聚乙烯/丁苯橡胶价格环比下行0.4%/1.5%", `${part2}/【40-41】周报-价格指标及通胀变化-化肥化工产品（iFind）.xlsx`, "【41】化工产品价格"),
        chart(42, "prices", "grain-prices", "上周玉米价格环比下行0.9%，小麦价格环比下行0.6%", `${part2}/【42-45】周报-价格指标及通胀变化-粮食&农产品&蔬果&猪肉（iFind）.xlsx`, "【42】粮食价格"),
        chart(43, "prices", "agricultural-index", "上周农产品价格指数环比上行0.3%", `${part2}/【42-45】周报-价格指标及通胀变化-粮食&农产品&蔬果&猪肉（iFind）.xlsx`, "【43】农产品价格指数"),
        chart(44, "prices", "vegetable-fruit-prices", "上周蔬菜批发价格环比上行1.4%，水果价格环比上行2.5%", `${part2}/【42-45】周报-价格指标及通胀变化-粮食&农产品&蔬果&猪肉（iFind）.xlsx`, "【44】蔬菜水果价格"),
        chart(45, "prices", "pork-prices", "上周猪肉批发价格环比下行0.2%", `${part2}/【42-45】周报-价格指标及通胀变化-粮食&农产品&蔬果&猪肉（iFind）.xlsx`, "【45】猪肉价格"),
      ],
    },
    {
      id: "financial", title: "利率、汇率及金融市场环境",
      summary: "银行间流动性维持宽松，国债收益率曲线趋平，人民币兑美元升值；利率债发行同比小幅多增。",
      detail: "DR007和R007环比分别下降1.3和0.5个基点；1年期国债收益率上行2.1个基点，10年期下行1.5个基点。沪深300指数周环比下跌1.33%。在岸、离岸人民币兑美元分别升值0.22%和0.33%。本周利率债总发行5893亿元，同比多增264亿元，其中地方政府债同比多增626亿元。",
      charts: [
        chart(46, "financial", "rate-dashboard", "主要利率指标（截至2026年8月7日，单位：%）", `${part3}/【47】利率汇总表（wind）.xlsx`, "【46】利率汇总表"),
        chart(47, "financial", "repo-rate", "央行质押式回购加权利率环比下行5.3个基点", `${part3}/【48】央行逆回购与银行间利率.xlsx`, "【47】回购加权利率"),
        chart(48, "financial", "dr007-r007", "DR007/R007环比下行5.9/5.3个基点", `${part3}/【49】DR007R007.xlsx`, "【48】DR007R007"),
        chart(49, "financial", "cd-net-issuance", "同业存单净发行量环比下降", `${part3}/【50】同业存单发行与存量（wind）.xlsx`, "【49】同业存单净发行"),
        chart(50, "financial", "cd-rate", "同业存单发行利率环比上升", `${part3}/【52】同业存单利率.xlsx`, "【50】同业存单发行利率"),
        chart(51, "financial", "hibor", "隔夜/1周/1月HIBOR环比均有所下行", `${part3}/【51】HIBOR.xlsx`, "【51】HIBOR"),
        chart(52, "financial", "yield-spread", "1–10年期国债收益率期限利差环比收窄", `${part3}/【53,54,55,56,58】债券收益率（wind、ceic）.xlsx`, "【52】国债期限利差"),
        chart(53, "financial", "government-yield-curve", "国债收益率曲线趋平", `${part3}/【53,54,55,56,58】债券收益率（wind、ceic）.xlsx`, "【53】国债收益率曲线"),
        chart(54, "financial", "aaa-yields", "1年期AAA级企业债收益率下行，曲线趋平", `${part3}/【53,54,55,56,58】债券收益率（wind、ceic）.xlsx`, "【54】AAA企业债收益率"),
        chart(55, "financial", "aa-yields", "1年期AA级企业债收益率下行，曲线趋平", `${part3}/【53,54,55,56,58】债券收益率（wind、ceic）.xlsx`, "【55】AA企业债收益率"),
        chart(56, "financial", "credit-net-issuance", "信用债净发行额环比上行", `${part3}/【57】信用债发行（wind）.xlsx`, "【56】信用债发行"),
        chart(57, "financial", "credit-spread", "1年期AA-AAA级企业债信用利差收窄，3年期走扩", `${part3}/【53,54,55,56,58】债券收益率（wind、ceic）.xlsx`, "【57】信用利差"),
        chart(58, "financial", "property-bond-financing", "房地产企业债券发行金额环比上升", `${part3}/【59】房地产债（wind）.xlsx`, "【58】房地产债"),
        chart(59, "financial", "equity-financing", "企业股票（非金融）融资额环比下降", `${part3}/【60】股票融资（wind）.xlsx`, "【59】股票融资"),
        chart(60, "financial", "csi300", "沪深300指数环比上升2.32%", `${part3}/【61】沪深300指数行情.xlsx`, "【60】沪深300指数"),
        chart(61, "financial", "csi300-pe", "沪深300PE（TTM）较前一周上行", `${part3}/【62】沪深倍数.xlsx`, "【61】沪深300PE"),
        chart(62, "financial", "rmb-usd", "在岸/离岸人民币兑美元汇率环比上行0.10%/0.08%", `${part3}/【63】人民币兑美元汇率.xlsx`, "【62】人民币兑美元"),
        chart(63, "financial", "rmb-basket", "人民币兑一篮子货币汇率环比下行", `${part3}/【64】人民币兑美元和一篮子货币汇率.xlsx`, "【63】人民币一篮子汇率"),
        chart(64, "financial", "open-market-operations", "截至8月7日，央行流动性净回笼1.53万亿元", `${part3}/【65&69】公开市场操作&宏观政策跟踪.xlsx`, "【64】公开市场操作"),
        chart(65, "financial", "government-bond-issuance", "8月3日–9日利率债总发行量同比少增12.0%", `${part3}/【66】周度利率债发行.xlsx`, "【65】利率债发行", true),
      ],
    },
    {
      id: "policy", title: "宏观政策跟踪",
      summary: "稳增长政策进入观察窗口，关注中小企业发展规划、保险法修订以及后续财政发力的持续性。",
      detail: "8月31日国务院常务会议研究促进高质量发展有关工作；9月1日工信部等十部门印发中小企业发展“十五五”规划；9月4日国家金融监督管理总局就保险法修订草案征求意见。本周重点关注8月进出口、通胀和金融数据。",
      charts: [
        chart(67, "policy", "policy-events", "上周重要政策及会议一览（8月3日–8月7日）", `${part3}/【68】本周政策跟踪.xlsx`, "【67】上周政策及会议"),
        chart(68, "policy", "weekly-data-calendar", "本周重要数据一览（8月10日–8月14日）", `${part3}/【68】本周政策跟踪.xlsx`, "【68】本周重要数据"),
      ],
    },
  ],
  watchPoints: ["关注财政发力的可持续性。", "关注能源价格上行对工业生产及通胀的传导。", "关注8月进出口、通胀和金融数据。"],
  risks: ["能源价格波动超预期。", "地产成交修复不及预期，内需超预期下行。"],
};

export const weeklyReport0809 = weeklyReport0906;
