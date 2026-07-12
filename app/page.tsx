"use client";

import { useMemo, useState } from "react";

type Place = {
  name: string;
  area: string;
  category: "景點" | "餐廳";
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
  mapUrl?: string;
};

type PlaceSeed = [string, string, "室內" | "戶外", number, number, boolean, string, string];
type ExtendedPlaceSeed = [...PlaceSeed, boolean];

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

const restaurantSeeds: PlaceSeed[] = [
  ["I'M 親子餐廳", "板橋", "室內", 1200, 15, true, "🍝", "遊戲空間、兒童餐具與高腳椅齊全，適合低齡孩子用餐"],
  ["我們的家休閒小棧", "板橋", "室內", 1200, 10, true, "🏠", "鄰近江子翠站，有童書、積木與家家酒可讓孩子玩"],
  ["一二三丸桐趣吧", "板橋", "室內", 1500, 20, true, "🎠", "親子遊戲區與餐飲結合，適合安排輕鬆家庭聚餐"],
  ["50樓Café 自助餐廳", "板橋", "室內", 3200, 15, true, "🍽️", "高樓景觀與多樣自助餐點，大人小孩都容易找到喜歡的菜"],
  ["望月樓", "板橋", "室內", 3600, 15, true, "🥟", "粵菜與港點適合多人分食，高樓景觀也能吸引孩子注意"],
  ["悅・市集 新板希爾頓", "板橋", "室內", 3500, 15, true, "🧁", "寬敞自助餐空間與多元菜色，帶推車入座較從容"],
  ["青雅中餐廳 新板希爾頓", "板橋", "室內", 3000, 15, true, "🥢", "中式合菜與舒適座位適合全家共享，也方便安排慶生"],
  ["Mo-Mo-Paradise 板橋大遠百牧場", "板橋", "室內", 1800, 15, true, "🍲", "親子友善的壽喜燒選擇，訂位時可備註兒童椅"],
  ["The Chips 美式餐廳 誠品板橋店", "板橋", "室內", 1500, 15, true, "🍔", "漢堡、義大利麵與早午餐選擇多，適合家庭分食"],
  ["品鼎殿日式壽喜燒 板橋店", "板橋", "室內", 1600, 15, true, "🍲", "座位舒適、餐點選擇直覺，適合帶孩子一起吃鍋"],
  ["猴子燒肉 Monkey Yakiniku 板橋店", "板橋", "室內", 1800, 15, true, "🥩", "可事先備註兒童座椅與餐具，家庭用餐準備較方便"],
  ["食藝鍋 板橋文化店", "板橋", "室內", 1200, 10, true, "🥘", "嬰兒椅充足、個人鍋好分配，距離新埔出發也近"],
  ["IKEA 新莊店瑞典餐廳", "新莊", "室內", 800, 25, true, "🧆", "有兒童餐、嬰兒食品、高腳椅、溫奶與親子設施"],
  ["IKEA 新店店瑞典餐廳", "新店", "室內", 800, 35, true, "🧆", "供應兒童餐與副食品，並備有高腳椅和親子廁所"],
  ["IKEA 桃園店瑞典餐廳", "桃園青埔", "室內", 800, 60, true, "🧆", "親子用餐區、兒童餐具與高腳椅完整，孩子也有遊戲空間"],
  ["饗食天堂 板橋店", "板橋", "室內", 3200, 15, true, "🍣", "自助餐種類多，幼兒與大人都容易挑到合適餐點"],
  ["開飯川食堂 板橋店", "板橋", "室內", 1800, 15, true, "🍚", "中式菜色適合共享，可彈性選擇不辣料理給孩子"],
  ["涓豆腐 板橋環球店", "板橋", "室內", 1500, 15, true, "🍲", "豆腐煲與韓式小菜適合共享，車站商場內親子設施方便"],
  ["真珠 台灣佳味 板橋店", "板橋", "室內", 1800, 15, true, "🍚", "熟悉的台灣家常菜適合全家分食，商場動線也方便推車"],
  ["Garden Kitchen 台北萬豪", "中山區", "室內", 3600, 45, true, "🥗", "家庭友善自助餐與寬敞空間，適合較長時間的家庭聚餐"],
  ["十二廚 台北喜來登", "中正區", "室內", 4200, 30, true, "🍤", "多國料理自助餐與開放式廚房，餐點選擇適合不同年齡"],
  ["栢麗廳 台北晶華", "中山區", "室內", 4500, 35, true, "🍰", "空間寬敞、甜點與熟食豐富，適合特殊節日家庭聚餐"],
  ["敘日全日餐廳 台北六福萬怡", "南港區", "室內", 3500, 50, true, "🍛", "車站共構、菜色多元，推車與大眾運輸動線都方便"],
  ["MJ Kitchen 台北國泰萬怡", "中山區", "室內", 3600, 40, true, "🍽️", "開放式廚房與自助餐選擇充足，適合家庭共享"],
  ["饗饗 微風信義店", "信義區", "室內", 4200, 40, true, "🍣", "景觀自助餐與多樣料理適合慶祝，捷運抵達也方便"],
  ["旭集 和食集錦 信義店", "信義區", "室內", 3800, 40, true, "🍱", "日式自助餐選擇多，訂位可註明需要娃娃椅"],
  ["豐FOOD 海陸百匯", "中山區", "室內", 3200, 45, true, "🦐", "菜色種類多、座位寬敞，適合多人與孩子一起聚餐"],
  ["故宮晶華", "士林區", "室內", 3500, 55, true, "🏮", "中華料理與故宮行程可一起安排，家庭合菜方便共享"],
  ["義饗食堂", "北投區", "室內", 2800, 55, true, "🍕", "義式自助料理與甜點選擇豐富，適合北投親子一日遊"],
  ["漢來海港餐廳 桃園台茂店", "蘆竹", "室內", 3200, 50, true, "🦀", "商場內親子設施完整，自助餐可滿足不同年齡口味"],
];

const extraAttractionSeeds: ExtendedPlaceSeed[] = [
  ["新店裕隆城", "新店", "室內", 500, 30, true, "🛍️", "商場、書店、影城與親子設施集中，雨天也能輕鬆逛", true],
  ["文山農場", "新店", "戶外", 800, 45, false, "🌿", "大片草地、茶園與自然體驗適合安排半日戶外行程", false],
  ["烏來老街", "烏來", "戶外", 600, 60, true, "♨️", "山城街道、溪谷與原民小吃能組成輕鬆散步路線", false],
  ["烏來瀑布", "烏來", "戶外", 600, 70, true, "💦", "瀑布景觀與台車體驗鮮明，適合孩子第一次看大瀑布", false],
  ["三峽老街", "三峽", "戶外", 500, 50, true, "🏘️", "紅磚街屋、傳統小吃與短程散步適合家庭慢遊", false],
  ["新北市客家文化園區", "三峽", "室內", 300, 45, true, "🌸", "文化展覽、親子體驗與戶外庭園可彈性搭配", false],
  ["大板根森林遊樂區", "三峽", "戶外", 1500, 65, true, "🌲", "低海拔原始森林與環狀步道適合親子親近自然", false],
  ["斬龍山遺址文化公園", "土城", "戶外", 0, 30, false, "🐉", "地景遊戲場與草坡空間適合孩子奔跑放電", true],
  ["員和公園", "土城", "戶外", 0, 25, false, "🛝", "捷運站旁特色遊戲場，短時間放風也很好安排", true],
  ["永和仁愛公園", "永和", "戶外", 0, 25, false, "🌳", "大片綠地與多座兒童遊具，適合日常型親子散步", true],
  ["新莊宏匯廣場", "新莊", "室內", 600, 30, true, "🎡", "機捷旁商場有餐飲、影城與親子娛樂，雨天方便", true],
  ["國家電影及視聽文化中心", "新莊", "室內", 300, 30, true, "🎬", "影像展覽與放映空間能安排安靜的親子文化行程", true],
  ["新北市眷村文化園區 空軍三重一村", "三重", "戶外", 100, 25, false, "🏠", "老眷村房舍與展覽空間適合孩子探索生活歷史", true],
  ["辰光橋天空猴探險樂園", "三重", "戶外", 0, 25, false, "🐒", "高架橋下特色遊戲場不怕小雨，遊具種類豐富", true],
  ["微風運河", "蘆洲", "戶外", 0, 35, false, "🚲", "河濱草地與自行車道視野開闊，適合野餐散步", false],
  ["淡水紅毛城", "淡水", "戶外", 200, 60, true, "🏰", "古蹟建築、草地與河景能組成有變化的親子路線", true],
  ["雲門劇場", "淡水", "戶外", 400, 65, true, "🎭", "綠意園區與藝術空間安靜，適合親子慢慢散步", false],
  ["淡水漁人碼頭", "淡水", "戶外", 500, 70, true, "🌅", "木棧道、情人橋與夕陽景觀讓孩子看船看海", true],
  ["野柳地質公園", "萬里", "戶外", 700, 75, true, "🪨", "奇岩地景像天然教室，適合孩子觀察海岸與岩石", false],
  ["金山中山溫泉公園", "金山", "戶外", 500, 75, true, "♨️", "溫泉街區與公園可安排短程散步和泡腳休息", false],
  ["新北市立黃金博物館", "瑞芳", "室內", 500, 75, true, "⛏️", "礦業歷史、山城建築與戶外園區內容豐富", false],
  ["猴硐貓村", "瑞芳", "戶外", 400, 75, false, "🐈", "山城步道與貓咪元素吸引孩子，但需留意階梯", false],
  ["深澳鐵道自行車", "瑞芳", "戶外", 1200, 75, true, "🚂", "沿海軌道與隧道燈光體驗有鮮明交通主題", false],
  ["龍門露營渡假基地", "貢寮", "戶外", 1500, 75, true, "⛺", "草地、河岸與戶外活動適合安排一整天自然體驗", false],
  ["MITSUI OUTLET PARK 林口", "林口", "室內", 800, 45, true, "🛍️", "機捷旁購物、餐飲與戶外廣場兼具，親子動線完整", true],
  ["林口樂活公園", "林口", "戶外", 0, 45, false, "🛝", "共融遊戲場與大片草地適合不同年齡孩子活動", false],
  ["貴子兒童公園", "泰山", "戶外", 0, 35, false, "✈️", "機捷附近特色遊具與開放空間適合短程放電", true],
  ["準園生態莊園", "五股", "戶外", 800, 40, true, "🦆", "生態池、草地與小動物觀察適合低齡親子", false],
  ["汐止星光橋", "汐止", "戶外", 0, 55, false, "🌉", "造型橋梁與河濱步道平坦，傍晚散步很舒服", false],
  ["夢想社區", "汐止", "戶外", 200, 55, false, "🎪", "色彩繽紛的藝術造景與社區空間適合拍照走走", false],
  ["臺北流行音樂中心文化館", "南港區", "室內", 600, 45, true, "🎵", "互動音樂展覽與大型舞台空間能吸引孩子感官", true],
  ["國立臺灣藝術教育館", "中正區", "室內", 200, 30, true, "🎨", "小型展覽與周邊植物園可組成輕量文化行程", true],
  ["臺北市中山堂", "中正區", "室內", 200, 30, true, "🏛️", "歷史建築與藝文展演適合安排短時間參觀", true],
  ["台北當代藝術館", "大同區", "室內", 300, 35, true, "🖼️", "紅磚建築與當代展覽帶來不同視覺刺激", true],
  ["袖珍博物館", "中山區", "室內", 500, 35, true, "🏠", "精緻迷你屋與模型細節很適合孩子慢慢觀察", true],
  ["樹火紀念紙博物館", "中山區", "室內", 500, 30, true, "📜", "紙張展覽與手作活動能帶孩子認識生活材料", true],
  ["臺北市立圖書館總館", "大安區", "室內", 0, 30, true, "📚", "兒童閱讀資源豐富，雨天可安排安靜半日", true],
  ["大稻埕碼頭", "大同區", "戶外", 300, 40, true, "⛵", "河岸、市集與自行車道適合傍晚親子散步", true],
  ["迪化街", "大同區", "戶外", 500, 40, true, "🏮", "老街建築、乾貨店與甜點小吃讓散步很有變化", true],
  ["剝皮寮歷史街區", "萬華區", "戶外", 0, 30, true, "🧱", "紅磚街屋和免費展覽適合孩子認識老臺北", true],
  ["臺北記憶倉庫", "中正區", "室內", 0, 30, true, "🚉", "車站旁小型歷史展館，適合和北門行程串聯", true],
  ["MAJI 集食行樂", "中山區", "戶外", 600, 35, true, "🎪", "圓山站旁有餐飲、市集與開放空間，推車方便", true],
  ["臺北典藏植物園", "中山區", "室內", 0, 35, true, "🌱", "室內植物展示與花博園區適合雨天自然觀察", true],
  ["圓山花博公園", "中山區", "戶外", 0, 35, true, "🌼", "大片草地、展館與市集活動讓行程很好伸縮", true],
  ["內湖運動公園", "內湖區", "戶外", 0, 50, false, "🛝", "大型遊戲場與運動空間適合孩子充分放電", true],
  ["碧湖公園", "內湖區", "戶外", 0, 50, false, "🦆", "湖景與環湖步道平緩，適合推車散步看水鳥", true],
  ["南港公園", "南港區", "戶外", 0, 50, false, "🌲", "湖泊、林蔭與遊戲區兼具，是安靜的社區綠地", true],
  ["成美左岸河濱公園", "南港區", "戶外", 0, 45, false, "🚲", "河岸草地與平坦步道適合推車和自行車", true],
  ["彩虹河濱公園", "松山區", "戶外", 0, 45, false, "🌈", "彩虹橋下的河濱景觀適合傍晚散步與野餐", true],
  ["松山機場觀景台", "松山區", "室內", 300, 40, true, "✈️", "近距離看飛機起降，室內外空間都容易停留", true],
  ["寶藏巖國際藝術村", "中正區", "戶外", 100, 35, false, "🎨", "山坡聚落與藝術裝置能安排短程探索，但需留意階梯", true],
  ["貓空纜車", "文山區", "戶外", 600, 60, true, "🚠", "纜車、山景與茶園對孩子是鮮明的交通體驗", true],
  ["指南宮", "文山區", "戶外", 200, 65, false, "⛩️", "纜車可達的山腰廟宇有開闊景觀與短程步道", true],
  ["新北投車站", "北投區", "戶外", 0, 55, true, "🚉", "木造車站與周邊公園適合搭配溫泉博物館", true],
  ["七星公園", "北投區", "戶外", 0, 55, false, "🌳", "新北投站旁草地平坦，適合孩子簡單放風", true],
  ["地熱谷", "北投區", "戶外", 0, 60, true, "♨️", "蒸氣瀰漫的溫泉地景新奇，但需牽好孩子注意安全", true],
  ["關渡碼頭貨櫃市集", "北投區", "戶外", 600, 60, true, "🌅", "河岸、夕陽與餐飲座位集中，傍晚行程方便", true],
  ["芝山文化生態綠園", "士林區", "戶外", 300, 45, false, "🦎", "自然步道與生態展示適合孩子觀察昆蟲植物", true],
  ["芝山岩步道", "士林區", "戶外", 0, 45, false, "🌿", "短程林蔭步道有歷史與自然景觀，適合親子健走", true],
  ["迎風河濱公園", "松山區", "戶外", 0, 45, false, "🛩️", "大草地可看飛機、跑跳與放風箏，視野很開闊", false],
];

const extraRestaurantSeeds: ExtendedPlaceSeed[] = [
  ["鼎泰豐 板橋店", "板橋", "室內", 1800, 15, true, "🥟", "小籠包、炒飯與麵食容易分食，商場親子設施完整", true],
  ["NARA Thai Cuisine 板橋大遠百店", "板橋", "室內", 2200, 15, true, "🍛", "泰式合菜可選不辣品項，適合多人共享", true],
  ["金色三麥 板橋大遠百店", "板橋", "室內", 2200, 15, true, "🍗", "空間寬敞、披薩與烤物選擇多，適合家庭聚餐", true],
  ["瓦城泰國料理 板橋大遠百店", "板橋", "室內", 2200, 15, true, "🍚", "合菜份量適合全家共享，也能挑選兒童可吃的不辣料理", true],
  ["涮乃葉 板橋遠百中山店", "板橋", "室內", 1800, 15, true, "🍲", "蔬菜吧與個人鍋選擇多，孩子餐點容易安排", true],
  ["大戶屋 板橋環球店", "板橋", "室內", 1200, 15, true, "🍱", "日式定食口味熟悉、份量清楚，適合家庭快速用餐", true],
  ["丰禾 台味風格料理 板橋環球店", "板橋", "室內", 1800, 15, true, "🍚", "台式家常菜方便共享，車站商場內推車動線平順", true],
  ["海底撈火鍋 板橋店", "板橋", "室內", 2500, 15, true, "🍲", "服務與兒童用品準備完整，可彈性選擇清淡鍋底", true],
  ["乾杯燒肉居酒屋 板橋大遠百店", "板橋", "室內", 2600, 15, true, "🥩", "商場店交通方便，燒肉與飯食適合家庭共享", true],
  ["胖肚肚燒肉 板橋店", "板橋", "室內", 2000, 15, true, "🥩", "燒肉吃到飽選擇多，適合食量不同的家庭成員", true],
  ["千兵衛日式燒肉鍋物 中和店", "中和", "室內", 1800, 25, true, "🍖", "有兒童遊戲區與多元燒肉鍋物，適合親子聚餐", true],
  ["BabyWonderland 童話世界親子空間", "永和", "室內", 1500, 25, true, "🧸", "親子遊戲空間與餐飲結合，低齡孩子也容易活動", true],
  ["FuNny MaMa 放了媽媽", "蘆洲", "室內", 1600, 35, true, "🎠", "遊戲設施與家庭餐點集中，適合孩子放電與慶生", false],
  ["象園咖啡 內湖店", "內湖區", "室內", 1800, 50, true, "🐘", "鄰近公園、空間適合家庭聚餐，餐點對孩子友善", true],
  ["貳樓餐廳 南港車站店", "南港區", "室內", 1800, 50, true, "🥞", "車站共構、早午餐選擇多，推車與兒童座椅方便", true],
  ["農人餐桌 親子餐廳", "中正區", "室內", 1800, 30, true, "🥕", "以親子家庭為主的用餐空間，餐點與遊戲區兼具", true],
  ["TGI FRIDAYS 信義餐廳", "信義區", "室內", 2200, 40, true, "🍔", "美式餐點適合共享，寬敞座位方便家庭聚餐", true],
  ["Lady nara 台北統一時代店", "信義區", "室內", 2200, 40, true, "🍛", "泰式與甜點選擇豐富，商場親子設施完整", true],
  ["蘇杭餐廳 濟南店", "中正區", "室內", 2200, 30, true, "🥟", "江浙點心與合菜適合全家分食，口味選擇多", true],
  ["欣葉台菜 南西店", "中山區", "室內", 2800, 35, true, "🍚", "經典台菜適合長幼共享，捷運與百貨設施方便", true],
  ["欣葉日本料理 館前店", "中正區", "室內", 3200, 30, true, "🍣", "台北車站旁自助餐選擇多，家庭聚餐交通省力", true],
  ["欣葉日本料理 健康店", "松山區", "室內", 3200, 40, true, "🍣", "日式自助餐與熟食選擇多，適合不同年齡口味", true],
  ["凱菲屋 台北君悅", "信義區", "室內", 4600, 40, true, "🍽️", "飯店自助餐空間寬敞，菜色多元適合節日聚餐", true],
  ["探索廚房 台北寒舍艾美", "信義區", "室內", 4800, 40, true, "🦞", "高級自助餐與舒適座位適合家庭慶祝場合", true],
  ["彩匯自助餐廳 台北美福", "中山區", "室內", 4500, 45, true, "🍰", "寬敞自助餐廳與多國料理能滿足全家口味", true],
  ["遠東Café 台北遠東香格里拉", "大安區", "室內", 4500, 35, true, "🍤", "多國料理與飯店服務完整，適合重要家庭聚餐", true],
  ["百宴自助餐廳 台北凱達", "萬華區", "室內", 3200, 30, true, "🍽️", "車站旁自助餐選擇多，交通與推車動線方便", true],
  ["饗聚廚房 台北花園大酒店", "中正區", "室內", 3000, 30, true, "🥗", "飯店餐廳空間舒適，鄰近西門與小南門站", true],
  ["海霸王 長安甲天下", "中山區", "室內", 2500, 35, true, "🦐", "大型合菜餐廳座位寬敞，適合多人親子聚餐", true],
  ["鼎泰豐 信義店", "大安區", "室內", 1800, 35, true, "🥟", "經典麵點與炒飯容易讓孩子接受，捷運可達", true],
  ["果然匯 台北新光站前店", "中正區", "室內", 2600, 30, true, "🥗", "蔬食自助餐菜色多元，能增加孩子蔬菜選擇", true],
  ["小小樹食 大安本店", "大安區", "室內", 2200, 35, true, "🥑", "蔬食料理色彩豐富，適合想嘗試清爽餐點的家庭", true],
  ["COZZI Blu 逸薈軒", "桃園青埔", "室內", 3500, 55, true, "🐋", "海洋主題飯店餐廳可搭配Xpark，親子氛圍完整", true],
  ["饗食天堂 桃園新光店", "桃園區", "室內", 3200, 55, true, "🍣", "自助餐菜色多，百貨內親子設施與停車方便", false],
  ["NARA Thai Cuisine 桃園華泰店", "桃園青埔", "室內", 2200, 55, true, "🍛", "機捷可達、合菜方便分享，也能選擇不辣料理", true],
  ["TGI FRIDAYS 華泰餐廳", "桃園青埔", "室內", 2200, 55, true, "🍔", "美式餐點與寬敞座位適合搭配青埔親子行程", true],
  ["涓豆腐 桃園華泰店", "桃園青埔", "室內", 1600, 55, true, "🍲", "機捷旁韓式餐點選擇多，商場親子動線方便", true],
  ["明皇樓 古華花園飯店", "中壢", "室內", 2800, 65, true, "🥢", "中式合菜與包廂適合家庭聚餐和長輩同行", false],
  ["繽紛西餐廳 古華花園飯店", "中壢", "室內", 3200, 65, true, "🍰", "飯店自助餐與寬敞座位適合帶孩子慢慢吃", false],
  ["享鴨 桃園同德店", "桃園區", "室內", 2200, 60, true, "🦆", "烤鴨與中式合菜適合全家共享，餐點選擇直覺", false],
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
  "I'M 親子餐廳", "我們的家休閒小棧", "50樓Café 自助餐廳", "望月樓",
  "悅・市集 新板希爾頓", "青雅中餐廳 新板希爾頓", "Mo-Mo-Paradise 板橋大遠百牧場",
  "The Chips 美式餐廳 誠品板橋店", "品鼎殿日式壽喜燒 板橋店", "猴子燒肉 Monkey Yakiniku 板橋店",
  "食藝鍋 板橋文化店", "IKEA 新店店瑞典餐廳", "IKEA 桃園店瑞典餐廳", "饗食天堂 板橋店",
  "開飯川食堂 板橋店", "涓豆腐 板橋環球店", "真珠 台灣佳味 板橋店", "Garden Kitchen 台北萬豪",
  "十二廚 台北喜來登", "栢麗廳 台北晶華", "敘日全日餐廳 台北六福萬怡", "MJ Kitchen 台北國泰萬怡",
  "饗饗 微風信義店", "旭集 和食集錦 信義店", "豐FOOD 海陸百匯", "義饗食堂",
]);
const attractionPlaces: Place[] = placeSeeds.map(([name, area, type, budget, travel, chair, emoji, feature], index) => ({
  name, area, category: "景點", type, budget, travel, chair, emoji, tone: tones[index % tones.length],
  mrtFriendly: mrtFriendlyPlaceNames.has(name),
  tags: [feature.split("，")[0].slice(0, 6), mrtFriendlyPlaceNames.has(name) ? "捷運方便" : type === "室內" ? "雨天可選" : "戶外散步"],
  reason: `${feature}。適合依寶寶當天精神彈性調整停留時間。`,
  duration: travel >= 55 ? "3–5 小時" : type === "室內" ? "1.5–3 小時" : "2–3 小時",
  supplies: type === "室內" ? ["輕便推車", "薄外套", "寶寶水杯", "安撫小物"] : ["遮陽帽", "防蚊用品", "水與點心", "替換衣物"],
}));

const restaurantPlaces: Place[] = restaurantSeeds.map(([name, area, type, budget, travel, chair, emoji, feature], index) => ({
  name, area, category: "餐廳", type, budget, travel, chair, emoji, tone: tones[(index + 2) % tones.length],
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${area}`)}`,
  mrtFriendly: mrtFriendlyPlaceNames.has(name),
  tags: ["親子用餐", mrtFriendlyPlaceNames.has(name) ? "捷運方便" : "兒童椅"],
  reason: `${feature}。`,
  duration: "1.5–2.5 小時",
  supplies: ["寶寶圍兜", "濕紙巾", "水杯", "安撫小物"],
}));

const extraAttractionPlaces: Place[] = extraAttractionSeeds.map(([name, area, type, budget, travel, chair, emoji, feature, mrtFriendly], index) => ({
  name, area, category: "景點", type, budget, travel, chair, emoji, tone: tones[(index + 1) % tones.length],
  mrtFriendly,
  tags: [feature.split("，")[0].slice(0, 6), mrtFriendly ? "捷運方便" : type === "室內" ? "雨天可選" : "開車方便"],
  reason: `${feature}。適合依寶寶當天精神彈性調整停留時間。`,
  duration: travel >= 55 ? "3–5 小時" : type === "室內" ? "1.5–3 小時" : "2–3 小時",
  supplies: type === "室內" ? ["輕便推車", "薄外套", "寶寶水杯", "安撫小物"] : ["遮陽帽", "防蚊用品", "水與點心", "替換衣物"],
}));

const extraRestaurantPlaces: Place[] = extraRestaurantSeeds.map(([name, area, type, budget, travel, chair, emoji, feature, mrtFriendly], index) => ({
  name, area, category: "餐廳", type, budget, travel, chair, emoji, tone: tones[(index + 4) % tones.length],
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${area}`)}`,
  mrtFriendly,
  tags: ["親子用餐", mrtFriendly ? "捷運方便" : "開車方便"],
  reason: `${feature}。`,
  duration: "1.5–2.5 小時",
  supplies: ["寶寶圍兜", "濕紙巾", "水杯", "安撫小物"],
}));

const places = [...attractionPlaces, ...restaurantPlaces, ...extraAttractionPlaces, ...extraRestaurantPlaces];

const budgetOptions = [
  { label: "都可以", value: "all" },
  { label: "$1,000 內", value: "under1000" },
  { label: "$1,000–$3,000", value: "1000to3000" },
  { label: "$3,000 以上", value: "over3000" },
] as const;

type BudgetBand = (typeof budgetOptions)[number]["value"];

function matchesBudget(amount: number, budget: BudgetBand) {
  if (budget === "all") return true;
  if (budget === "under1000") return amount <= 1000;
  if (budget === "1000to3000") return amount > 1000 && amount <= 3000;
  return amount > 3000;
}

function getTravelMinutes(place: Place, transport: "開車" | "捷運") {
  return transport === "捷運"
    ? Math.min(75, place.travel + (place.area === "板橋" ? 5 : 10))
    : place.travel;
}

export default function Home() {
  const [kind, setKind] = useState<"都可以" | "室內" | "戶外">("都可以");
  const [category, setCategory] = useState<"都可以" | "景點" | "餐廳">("都可以");
  const [transport, setTransport] = useState<"開車" | "捷運">("開車");
  const [budget, setBudget] = useState<BudgetBand>("all");
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
    (category === "都可以" || p.category === category) && (kind === "都可以" || p.type === kind) && matchesBudget(p.budget, budget) && getTravelMinutes(p, transport) <= travel && (!chair || p.chair)
  ), [category, kind, budget, travel, chair, transportPlaces, transport]);

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
          <label>這次想找什麼？</label>
          <div className="segmented">{(["都可以", "景點", "餐廳"] as const).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); setKind(item === "餐廳" ? "室內" : "都可以"); setResult(null); }}><span>{item === "都可以" ? "✨" : item === "景點" ? "🎡" : "🍽️"}</span>{item}</button>)}</div>
        </div>

        {category !== "餐廳" && <div className="field">
          <label>想待在室內還是戶外？</label>
          <div className="segmented">{(["都可以", "室內", "戶外"] as const).map((item) => <button key={item} className={kind === item ? "active" : ""} onClick={() => setKind(item)}><span>{item === "都可以" ? "✨" : item === "室內" ? "🏠" : "🌳"}</span>{item}</button>)}</div>
        </div>}

        <div className="field">
          <label>今天的預算</label>
          <div className="chips">{budgetOptions.map((item) => <button key={item.value} className={budget === item.value ? "active" : ""} onClick={() => setBudget(item.value)}>{item.label}</button>)}</div>
          <small className="hint">以全家三人的門票或餐費總額估算</small>
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
          <div className="place-visual"><span>{result.emoji}</span><p>{result.area} · {result.category} · {transport}</p></div>
          <div className="place-content">
            <div className="tags">{result.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <h3>{result.name}</h3>
            <p className="why">{result.reason}以{startingPoint}出發，{transport}估計約 {getTravelMinutes(result, transport)} 分鐘。</p>
            <div className="stats"><div><small>單程{transport}</small><b>{getTravelMinutes(result, transport)} 分鐘</b></div><div><small>建議停留</small><b>{result.duration}</b></div><div><small>預估花費</small><b>{result.budget === 0 ? "免費" : `約 $${result.budget}`}</b></div></div>
            {result.mapUrl && <a className="map-link" href={result.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`在 Google Maps 查看 ${result.name}`}>⌖ 在 Google Maps 查看</a>}
          </div>
        </article>

        <div className="plan-grid">
          <article className="mini-card time-card"><span className="mini-icon">◷</span><div><small>建議出門時間</small><h3>{leaveTime}</h3><p>寶寶 {napEnd} 睡醒後，留 25 分鐘整理再出發。</p></div></article>
          <article className="mini-card"><span className="mini-icon">⌑</span><div><small>今天記得帶</small><ul>{result.supplies.map((item) => <li key={item}>✓ {item}</li>)}</ul></div></article>
        </div>
        <button className="retry" onClick={pickPlace}>↻ 換一個看看</button>
        <p className="note">交通、轉乘、預算與兒童椅為規劃估算；餐廳營業、訂位及兒童設備可能調整，出發前請向店家確認。</p>
      </section>}

      <footer><span>週末不用完美，<b>一家人在一起就很好。</b></span><i>♡</i></footer>
    </main>
  );
}
