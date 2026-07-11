"use client";

import { useMemo, useState } from "react";

type Place = {
  name: string;
  area: string;
  type: "室內" | "戶外";
  budget: number;
  travel: number;
  chair: boolean;
  emoji: string;
  tone: string;
  tags: string[];
  reason: string;
  duration: string;
  supplies: string[];
  mrtFriendly: boolean;
};

type PlaceSeed = [string, string, "室內" | "戶外", number, number, boolean, string, string];

const placeSeeds: PlaceSeed[] = [
  // 新北市：新埔捷運站出發的近程選擇
  ["板橋 435 藝文特區", "板橋", "戶外", 200, 15, false, "🎨", "草地、展館與親子藝術空間一次滿足"],
  ["新北市立圖書館總館", "板橋", "室內", 0, 15, true, "📚", "親子閱讀區安靜舒適，雨天也好安排"],
  ["臺灣玩具博物館", "板橋", "室內", 300, 15, false, "🧸", "收藏大量童玩，能讓寶寶看色彩與大人懷舊"],
  ["板橋放送所", "板橋", "戶外", 100, 15, false, "📻", "老建築搭配庭院草地，散步路線短而輕鬆"],
  ["林本源園邸", "板橋", "戶外", 200, 15, false, "🏮", "庭園、池水與迴廊有豐富景物可慢慢觀察"],
  ["新北市民廣場", "板橋", "戶外", 0, 10, true, "⛲", "空間平坦寬敞，臨時想出門也不用複雜準備"],
  ["板橋萬坪都會公園", "板橋", "戶外", 0, 10, true, "🌳", "車站旁就有草地與步道，交通最省力"],
  ["蝴蝶公園", "板橋", "戶外", 0, 15, false, "🦋", "河濱視野開闊，適合推車散步與看花草"],
  ["江翠礫間水岸公園", "板橋", "戶外", 0, 20, false, "🌼", "大片水岸綠地適合野餐與寶寶練習走路"],
  ["音樂公園", "板橋", "戶外", 0, 15, false, "🎵", "社區型公園距離近，適合簡短放風"],
  ["新北市藝文中心", "板橋", "室內", 100, 15, true, "🖼️", "室內展覽可彈性停留，周邊也容易用餐"],
  ["四號公園", "中和", "戶外", 100, 20, false, "🌲", "樹蔭、草地與遊戲區兼具，行程很好伸縮"],
  ["國立臺灣圖書館", "中和", "室內", 0, 20, true, "📖", "親子資料與閱讀空間豐富，適合安靜半日"],
  ["員山公園恐龍遊戲場", "中和", "戶外", 0, 25, false, "🦕", "大型恐龍造景醒目，低齡孩子也能看得開心"],
  ["錦和運動公園", "中和", "戶外", 0, 25, false, "⚽", "腹地寬廣、步道平坦，可推車慢慢繞一圈"],
  ["陽光運動公園", "新店", "戶外", 300, 35, false, "🌿", "共融遊戲場與河畔草地適合幼兒放電"],
  ["碧潭風景區", "新店", "戶外", 500, 35, true, "🛶", "河岸步道平緩，沿途休息與吃飯選擇多"],
  ["新北大都會公園", "三重", "戶外", 100, 25, false, "🌈", "大片草地與多元遊戲區能安排長短不同路線"],
  ["熊猴森樂園", "三重", "戶外", 100, 25, false, "🐒", "超大型共融遊戲場有低齡可觀察與活動的區域"],
  ["中港大排親水步道", "新莊", "戶外", 100, 25, false, "🐟", "水岸造景與平坦步道適合傍晚推車散步"],
  ["塭仔底濕地公園", "新莊", "戶外", 0, 25, false, "🦆", "濕地生態與木棧道能讓寶寶接觸自然"],
  ["新莊運動公園", "新莊", "戶外", 0, 25, false, "🏃", "綠地廣、樹蔭多，是簡單可靠的放風選擇"],
  ["十三行博物館", "八里", "室內", 300, 50, true, "🏺", "展館寬敞並有考古主題，可避雨也可吹冷氣"],
  ["新北考古公園", "八里", "戶外", 100, 50, false, "⛺", "草地與考古意象兼具，適合親子慢遊"],
  ["八里左岸公園", "八里", "戶外", 400, 50, true, "🚲", "河景、草地與餐飲集中，推車移動也方便"],
  ["新北市立鶯歌陶瓷博物館", "鶯歌", "室內", 300, 45, true, "🏺", "寬敞展間與陶瓷色彩適合全家輕鬆看展"],
  ["鶯歌公園", "鶯歌", "戶外", 100, 45, false, "🚂", "特色遊戲設施與坡地景觀讓短程散步有變化"],
  ["新北市美術館", "鶯歌", "室內", 500, 45, true, "🖼️", "新穎展館、無障礙動線與河岸環境適合推車家庭"],
  ["三鶯藝術村", "鶯歌", "戶外", 100, 45, false, "🎨", "大型陶瓷裝置和開闊草地很適合拍照散步"],
  ["淡水海關碼頭", "淡水", "戶外", 200, 55, false, "⛵", "紅磚古蹟與河景能安排舒服的午後散步"],
  ["滬尾藝文休閒園區", "淡水", "室內", 500, 60, true, "🎭", "展覽、餐飲與休息空間集中，帶寶寶較省心"],
  ["淡水古蹟園區", "淡水", "戶外", 400, 60, false, "🏰", "古蹟與街區景色豐富，可依體力縮短路線"],
  ["鹿角溪人工濕地", "樹林", "戶外", 0, 35, false, "🐸", "生態池與步道安靜，適合避開人潮看小動物"],

  // 臺北市：博物館、公園與親子場館
  ["臺北市立動物園", "文山區", "戶外", 800, 50, true, "🐘", "動物辨識正適合這個月齡，路線也能自由縮短"],
  ["臺北市立兒童新樂園", "士林區", "戶外", 1000, 45, true, "🎠", "有低齡設施、室內休息區與完整親子服務"],
  ["國立臺灣科學教育館", "士林區", "室內", 600, 45, true, "🔬", "互動展覽多，雨天可以舒適地待上半天"],
  ["臺北市立天文科學教育館", "士林區", "室內", 500, 45, true, "🚀", "大型星球與太空展示能吸引寶寶視線"],
  ["故宮兒童學藝中心", "士林區", "室內", 700, 50, true, "🏛️", "兒童導向互動展示讓大人看展、寶寶探索"],
  ["國立臺灣博物館本館", "中正區", "室內", 300, 25, true, "🦣", "自然史標本與經典建築適合短時間看展"],
  ["國立臺灣博物館鐵道部園區", "大同區", "室內", 300, 30, true, "🚂", "火車主題、鮮明色彩與寬敞展間都很親子友善"],
  ["國立臺灣博物館南門館", "中正區", "室內", 300, 25, true, "🏭", "小型展館搭配庭院，行程不會太累"],
  ["國立歷史博物館", "中正區", "室內", 500, 30, true, "🏺", "重新整修的展館與植物園可組成一趟慢遊"],
  ["臺北植物園", "中正區", "戶外", 0, 30, false, "🪷", "荷花池、林蔭與平坦步道適合推車散步"],
  ["中正紀念堂園區", "中正區", "戶外", 100, 25, true, "🏯", "廣場遼闊、室內外皆有空間，行程彈性高"],
  ["華山 1914 文化創意產業園區", "中正區", "戶外", 500, 25, true, "🎪", "展覽、草地與餐飲集中，能依寶寶狀態調整"],
  ["松山文創園區", "信義區", "戶外", 500, 35, true, "🏭", "池塘、古蹟與展覽相連，推車路線好安排"],
  ["大安森林公園", "大安區", "戶外", 100, 30, false, "🌳", "樹蔭、草地與生態池豐富，是經典親子散步點"],
  ["榮星花園公園", "中山區", "戶外", 100, 35, false, "🌺", "環境平坦、綠意充足，適合寶寶短程放風"],
  ["花博新生公園", "中山區", "戶外", 200, 35, true, "🌸", "花園、草地與迷宮造景讓散步更有變化"],
  ["林安泰古厝民俗文物館", "中山區", "戶外", 100, 35, false, "🏮", "傳統庭園與水景安靜優美，適合慢慢走"],
  ["大佳河濱公園", "中山區", "戶外", 100, 40, false, "🌉", "大草地與河景開闊，適合野餐和推車"],
  ["美堤河濱公園", "中山區", "戶外", 100, 45, false, "🌇", "大片草地與飛機視野能讓寶寶看得目不轉睛"],
  ["關渡自然公園", "北投區", "戶外", 500, 55, true, "🦜", "濕地鳥類與室內觀景區兼具，探索節奏溫和"],
  ["臺北市立圖書館北投分館", "北投區", "室內", 0, 55, false, "📚", "木造綠建築與閱讀氛圍適合安靜親子時光"],
  ["北投溫泉博物館", "北投區", "室內", 0, 55, false, "♨️", "日式建築與榻榻米空間有別於一般展館"],
  ["臺北市立美術館", "中山區", "室內", 300, 35, true, "🖼️", "展間寬敞且鄰近花博公園，室內外容易搭配"],
  ["臺北探索館", "信義區", "室內", 0, 35, true, "🏙️", "免費認識臺北城市，停留時間可長可短"],
  ["臺北市客家文化主題公園", "中正區", "戶外", 100, 30, true, "🌾", "草地、水岸與文化展覽可組合成輕鬆半日"],
  ["青年公園", "萬華區", "戶外", 100, 25, false, "🌲", "樹蔭與寬闊綠地充足，適合就近放電"],
  ["和平青草園", "萬華區", "戶外", 100, 25, false, "🌱", "大片草坪與遊戲空間適合寶寶練走"],
  ["自來水博物館園區", "中正區", "戶外", 500, 30, true, "💧", "歷史建築與戶外園區適合天氣好的半日遊"],
  ["台北偶戲館", "松山區", "室內", 300, 35, true, "🎭", "偶戲色彩鮮明、館舍不大，低齡參觀負擔小"],
  ["郵政博物館", "中正區", "室內", 300, 25, true, "📮", "郵筒、郵票與互動展示是有趣的雨天備案"],
  ["道南河濱公園", "文山區", "戶外", 100, 45, false, "🚲", "河濱草地平坦，能與動物園周邊彈性搭配"],
  ["士林官邸公園", "士林區", "戶外", 200, 45, false, "🌹", "花園與林蔭步道好走，四季都有不同景色"],
  ["二二八和平公園", "中正區", "戶外", 100, 25, true, "🕊️", "鄰近博物館與捷運，臨時更換行程很方便"],
  ["大湖公園", "內湖區", "戶外", 200, 50, false, "🌉", "湖景、草地與拱橋讓推車散步很有景致"],
  ["天母運動公園", "士林區", "戶外", 100, 50, false, "⚾", "特色遊戲場與開放綠地適合家庭放風"],
  ["南興公園", "南港區", "戶外", 100, 45, false, "🚄", "高鐵主題遊戲場能吸引喜歡交通工具的孩子"],
  ["內湖復育園區", "內湖區", "戶外", 100, 50, false, "🦋", "草坡與城市景觀開闊，適合避開熱門人潮"],
  ["富民生態公園", "松山區", "戶外", 100, 40, false, "🐞", "小型生態公園適合觀察植物與昆蟲"],

  // 桃園市：較遠但適合排成半日至一日遊
  ["Xpark", "桃園青埔", "室內", 1800, 55, true, "🐠", "魚群、燈光與室內環境對幼兒很有吸引力"],
  ["桃園市兒童美術館", "桃園青埔", "室內", 500, 55, true, "🎨", "兒童導向展覽與綠地建築適合藝術初體驗"],
  ["桃園軌道願景館", "桃園區", "室內", 200, 55, true, "🚆", "免費軌道互動展示讓小火車迷看得開心"],
  ["桃園市立圖書館總館", "桃園區", "室內", 200, 50, true, "📚", "寬敞閱讀空間與周邊餐飲讓照顧者更從容"],
  ["奧爾森林學堂", "桃園區", "戶外", 100, 55, false, "🦉", "樹屋、森林步道與生態觀察充滿自然感"],
  ["風禾公園", "桃園區", "戶外", 100, 55, false, "🛝", "大草地、沙坑與特色滑梯適合親子野餐"],
  ["台茂公園", "蘆竹", "戶外", 300, 50, true, "🛝", "遊戲場緊鄰商場，放電、換尿布和用餐都方便"],
  ["新勢公園", "平鎮", "戶外", 100, 65, false, "🐳", "海洋主題共融遊戲場與沙坑內容豐富"],
  ["八德埤塘自然生態公園", "八德", "戶外", 200, 60, true, "🦆", "埤塘、步道與水鳥能安排溫和自然觀察"],
  ["桃園防災教育館", "八德", "室內", 200, 60, true, "🚒", "消防車與救護主題展示色彩鮮明又有教育性"],
  ["南崁兒童藝術村", "蘆竹", "戶外", 200, 50, false, "🎨", "兒童藝術、沙坑與戶外空間融合，節奏輕鬆"],
  ["虎頭山公園", "桃園區", "戶外", 100, 55, false, "🌳", "森林步道與草地選擇多，可依體力挑短路線"],
  ["大溪埔頂公園", "大溪", "戶外", 200, 70, false, "🌲", "萬坪綠地與多元遊戲設施適合安排長一點的放風"],
  ["華興池生態埤塘公園", "大園", "戶外", 100, 60, false, "✈️", "埤塘景觀與飛機元素兼具，鄰近機捷路線"],
  ["橫山書法藝術館", "桃園青埔", "室內", 300, 55, true, "✒️", "現代建築與水景安靜，適合親子慢慢看"],
  ["桃園市土地公文化館", "桃園區", "室內", 100, 55, true, "🏮", "免費文化展示與市區位置適合輕量半日遊"],
  ["桃園機場第二航廈觀景台", "大園", "室內", 500, 65, true, "✈️", "可近距離看飛機，室內餐飲與親子設施完整"],
  ["巧虎夢想樂園", "桃園青埔", "室內", 1800, 55, true, "🐯", "專為幼兒設計的室內互動體驗不受天候影響"],
  ["中原文創園區", "中壢", "戶外", 300, 60, true, "🏭", "歷史建築、展覽與開放空間可彈性停留"],
  ["龍潭大池", "龍潭", "戶外", 300, 75, true, "🌊", "湖畔步道、吊橋與大片景觀適合排成悠閒半日"],
];

const tones = ["peach", "sage", "blue", "green", "yellow", "aqua"];
const startingPoint = "新埔捷運站";
const mrtFriendlyPlaceNames = new Set([
  "板橋放送所", "林本源園邸", "新北市民廣場", "板橋萬坪都會公園", "新北市藝文中心",
  "四號公園", "國立臺灣圖書館", "碧潭風景區", "新北大都會公園", "熊猴森樂園",
  "臺北市立動物園", "國立臺灣博物館本館", "國立臺灣博物館鐵道部園區", "國立臺灣博物館南門館",
  "國立歷史博物館", "臺北植物園", "中正紀念堂園區", "華山 1914 文化創意產業園區",
  "松山文創園區", "大安森林公園", "榮星花園公園", "北投溫泉博物館",
  "臺北市立圖書館北投分館", "臺北市立美術館", "臺北探索館", "臺北市客家文化主題公園",
  "自來水博物館園區", "台北偶戲館", "郵政博物館", "士林官邸公園", "二二八和平公園",
  "大湖公園", "南興公園", "Xpark", "桃園市兒童美術館", "華興池生態埤塘公園",
  "橫山書法藝術館", "桃園機場第二航廈觀景台", "巧虎夢想樂園",
]);
const places: Place[] = placeSeeds.map(([name, area, type, budget, travel, chair, emoji, feature], index) => ({
  name, area, type, budget, travel, chair, emoji, tone: tones[index % tones.length],
  mrtFriendly: mrtFriendlyPlaceNames.has(name),
  tags: [feature.split("，")[0].slice(0, 6), mrtFriendlyPlaceNames.has(name) ? "捷運方便" : type === "室內" ? "雨天可選" : "戶外散步"],
  reason: `${feature}。適合依寶寶當天精神彈性調整停留時間。`,
  duration: travel >= 55 ? "3–5 小時" : type === "室內" ? "1.5–3 小時" : "2–3 小時",
  supplies: type === "室內" ? ["輕便推車", "薄外套", "寶寶水杯", "安撫小物"] : ["遮陽帽", "防蚊用品", "水與點心", "替換衣物"],
}));

const budgetOptions = [
  { label: "免費為主", value: 0 },
  { label: "$500 內", value: 500 },
  { label: "$1,000 內", value: 1000 },
  { label: "都可以", value: 3000 },
];

function getTravelMinutes(place: Place, transport: "開車" | "捷運") {
  return transport === "捷運"
    ? Math.min(75, place.travel + (place.area === "板橋" ? 5 : 10))
    : place.travel;
}

export default function Home() {
  const [kind, setKind] = useState<"都可以" | "室內" | "戶外">("都可以");
  const [transport, setTransport] = useState<"開車" | "捷運">("開車");
  const [budget, setBudget] = useState(1000);
  const [travel, setTravel] = useState(45);
  const [chair, setChair] = useState(false);
  const [napStart, setNapStart] = useState("13:00");
  const [napEnd, setNapEnd] = useState("15:00");
  const [result, setResult] = useState<Place | null>(null);
  const [lastName, setLastName] = useState("");

  const transportPlaces = useMemo(
    () => places.filter((place) => transport === "開車" || place.mrtFriendly),
    [transport],
  );

  const matches = useMemo(() => transportPlaces.filter((p) =>
    (kind === "都可以" || p.type === kind) && p.budget <= budget && getTravelMinutes(p, transport) <= travel && (!chair || p.chair)
  ), [kind, budget, travel, chair, transportPlaces, transport]);

  function pickPlace() {
    const pool = matches.length ? matches : transportPlaces.filter((p) => getTravelMinutes(p, transport) <= Math.max(travel, 30));
    const fresh = pool.filter((p) => p.name !== lastName);
    const choices = fresh.length ? fresh : pool;
    const picked = choices[Math.floor(Math.random() * choices.length)] || transportPlaces[0] || places[0];
    setResult(picked);
    setLastName(picked.name);
    requestAnimationFrame(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const leaveTime = useMemo(() => {
    if (!result) return "";
    const [h, m] = napEnd.split(":").map(Number);
    const date = new Date(2026, 0, 1, h, m + 25);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }, [result, napEnd]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到首頁"><span className="brand-mark">小</span><span>週末小隊</span></a>
        <span className="location">⌖ {startingPoint}</span>
      </header>

      <section className="hero" id="top">
        <div className="doodle sun">☀</div><div className="doodle cloud">☁</div>
        <p className="eyebrow">FOR OUR LITTLE FAMILY</p>
        <h1>這個週末，<br /><em>去哪裡好呢？</em></h1>
        <p className="intro">不用再滑手機討論半小時。告訴我們今天的條件，讓小週末隊長幫你們選一個剛剛好的去處。</p>
        <div className="family-pill"><span>👨‍👩‍👧</span><span><b>2 位大人＋1 位寶寶</b><small>寶寶 1 歲 3 個月</small></span></div>
      </section>

      <section className="planner" aria-labelledby="planner-title">
        <div className="section-heading"><span>01</span><div><p>今天想怎麼玩？</p><h2 id="planner-title">設定你們的週末條件</h2></div></div>

        <div className="field">
          <label>想待在室內還是戶外？</label>
          <div className="segmented">{(["都可以", "室內", "戶外"] as const).map((item) => <button key={item} className={kind === item ? "active" : ""} onClick={() => setKind(item)}><span>{item === "都可以" ? "✨" : item === "室內" ? "🏠" : "🌳"}</span>{item}</button>)}</div>
        </div>

        <div className="field">
          <label>今天的預算</label>
          <div className="chips">{budgetOptions.map((item) => <button key={item.value} className={budget === item.value ? "active" : ""} onClick={() => setBudget(item.value)}>{item.label}</button>)}</div>
          <small className="hint">以全家三人的門票與餐費估算</small>
        </div>

        <div className="field">
          <label>今天怎麼出發？</label>
          <div className="segmented transport-choice">{(["開車", "捷運"] as const).map((item) => <button key={item} className={transport === item ? "active" : ""} onClick={() => { setTransport(item); setResult(null); }}><span>{item === "開車" ? "🚗" : "🚇"}</span>{item}</button>)}</div>
          <small className="hint">選捷運時，只推薦步行或短程轉乘方便抵達的地點</small>
        </div>

        <div className="field range-field">
          <div className="label-row"><label htmlFor="travel">單程最遠交通時間</label><output>{travel} 分鐘</output></div>
          <input id="travel" type="range" min="15" max="75" step="5" value={travel} onChange={(e) => setTravel(Number(e.target.value))} style={{ "--range": `${((travel - 15) / 60) * 100}%` } as React.CSSProperties} />
          <div className="range-labels"><span>15 分</span><span>75 分</span></div>
          <small className="hint">從{startingPoint}出發估算</small>
        </div>

        <div className="field switch-row">
          <div><label htmlFor="chair">需要有兒童椅</label><small>餐廳或休息區有寶寶椅更安心</small></div>
          <button id="chair" role="switch" aria-checked={chair} className={`toggle ${chair ? "on" : ""}`} onClick={() => setChair(!chair)}><span /></button>
        </div>

        <div className="field">
          <label>寶寶的午睡時間</label>
          <div className="time-row"><div><small>開始</small><input type="time" value={napStart} onChange={(e) => setNapStart(e.target.value)} /></div><span>—</span><div><small>結束</small><input type="time" value={napEnd} onChange={(e) => setNapEnd(e.target.value)} /></div></div>
          <small className="hint">我們會避開午睡，安排舒服的出門時間</small>
        </div>

        <button className="decide" onClick={pickPlace}><span>幫我決定！</span><i>→</i></button>
        <p className="match-count">地點庫共 {places.length} 個・目前有 {matches.length} 個符合條件</p>
      </section>

      {result && <section className="result-wrap" id="result" aria-live="polite">
        <div className="result-label"><span>02</span><div><p>小隊長選好了！</p><h2>今天就去這裡吧</h2></div></div>
        <article className={`result-card ${result.tone}`}>
          <div className="place-visual"><span>{result.emoji}</span><p>{result.area} · {result.type} · {transport}</p></div>
          <div className="place-content">
            <div className="tags">{result.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <h3>{result.name}</h3>
            <p className="why">{result.reason}以{startingPoint}出發，{transport}估計約 {getTravelMinutes(result, transport)} 分鐘。</p>
            <div className="stats"><div><small>單程{transport}</small><b>{getTravelMinutes(result, transport)} 分鐘</b></div><div><small>建議停留</small><b>{result.duration}</b></div><div><small>預估花費</small><b>{result.budget === 0 ? "免費" : `$${result.budget} 內`}</b></div></div>
          </div>
        </article>

        <div className="plan-grid">
          <article className="mini-card time-card"><span className="mini-icon">◷</span><div><small>建議出門時間</small><h3>{leaveTime}</h3><p>寶寶 {napEnd} 睡醒後，留 25 分鐘整理再出發。</p></div></article>
          <article className="mini-card"><span className="mini-icon">⌑</span><div><small>今天記得帶</small><ul>{result.supplies.map((item) => <li key={item}>✓ {item}</li>)}</ul></div></article>
        </div>
        <button className="retry" onClick={pickPlace}>↻ 換一個看看</button>
        <p className="note">交通、轉乘、預算與兒童椅為規劃估算；出發前請確認即時路況、官方開放資訊、預約規則與天氣。</p>
      </section>}

      <footer><span>週末不用完美，<b>一家人在一起就很好。</b></span><i>♡</i></footer>
    </main>
  );
}
