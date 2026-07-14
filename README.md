# 週末小隊｜家庭週末去哪裡

一個替小家庭快速決定週末行程的推薦網站。設定想找景點或餐廳、交通方式、預算、交通時間與親子需求後，網站會從資料庫中隨機挑出符合條件的去處。

以「新埔捷運站」為交通時間起點，主要涵蓋臺北、新北與桃園地區。

## 線上版本

[https://zhoumo-family-planner.nate-4am.chatgpt.site](https://zhoumo-family-planner.nate-4am.chatgpt.site)

## 功能特色

- 景點、餐廳或兩者皆可
- 室內、戶外或不限
- 開車與捷運兩種交通模式
- 全家三人的預算區間篩選
- 15～75 分鐘的開車交通時間
- 捷運模式限制於 60 分鐘內可抵達
- 可指定捷運站，或搜尋全部合格車站
- 捷運結果只保留出站步行 10 分鐘內的地點
- 可篩選需要兒童椅的地點
- 依寶寶午睡結束時間提供建議出發時間
- 景點與餐廳結果皆附 Google Maps 搜尋連結
- 可重抽下一個符合條件的推薦

## 資料規模

目前共有 717 個不重複選項：

- 200 個親子景點
- 517 間親子友善餐廳
- 73 個有合格結果的捷運、機捷或輕軌車站

資料包含預估交通時間、預算、室內外類型、兒童椅、捷運站、步行時間與推薦理由。交通、價格、營業時間及親子設備可能變動，出發前請查看官方資訊或 Google Maps。

## 捷運篩選方式

捷運模式以新埔捷運站為起點，推薦結果需同時符合：

1. 大眾運輸時間不超過 60 分鐘。
2. 地點距離指定車站步行不超過 10 分鐘。
3. 符合使用者選擇的景點／餐廳、預算與兒童椅條件。

車站選單只顯示目前資料庫中至少有一個合格景點或餐廳的車站。

## 技術架構

- React 19
- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- [vinext](https://github.com/cloudflare/vinext)
- Vite 8
- Cloudflare Workers / OpenAI Sites

## 本機開發

### 環境需求

- Node.js `>= 22.13.0`
- npm

### 安裝與啟動

```bash
npm install
npm run dev
```

開發伺服器預設網址：

```text
http://localhost:3000
```

## 常用指令

```bash
# 啟動開發模式
npm run dev

# ESLint 檢查
npm run lint

# 建立正式版本
npm run build

# 啟動已建立的正式版本
npm run start
```

> `tests/rendered-html.test.mjs` 是初始 starter 留下的載入畫面測試，目前未對應現有首頁內容。現階段請以 `npm run lint` 與 `npm run build` 作為主要驗證。

## 專案結構

```text
app/
├── globals.css       # 全站樣式與響應式版面
├── layout.tsx        # 網站 metadata 與根版型
├── page.tsx          # 地點資料、篩選邏輯與主要 UI
└── chatgpt-auth.ts   # Sites 可選登入輔助函式

build/
└── sites-vite-plugin.ts

db/                   # 選用的 Drizzle / D1 結構
drizzle/              # 資料庫 migration metadata
public/               # favicon 與靜態檔案
worker/               # Cloudflare Worker 入口
.openai/hosting.json  # OpenAI Sites 專案設定
```

## 更新地點資料

目前資料維護在 `app/page.tsx`：

- `placeSeeds`：原始景點資料
- `restaurantSeeds`：原始餐廳資料
- `extraAttractionSeeds`：擴充景點資料
- `extraRestaurantSeeds`：擴充餐廳資料
- `metroRestaurantSeeds`：附車站、步行時間與捷運時間的餐廳資料
- `metroAccessByName`：既有地點的捷運站與步行資訊

新增資料時請避免重複名稱，並確認交通時間不超過網站設定的範圍。景點與餐廳都應保留完整名稱與地區，網站會用這些資訊產生 Google Maps 搜尋連結。

## 部署

專案已設定 OpenAI Sites，正式建置輸出會產生於 `dist/`：

```bash
npm run build
```

`.openai/hosting.json` 保存 Sites 專案 ID，以及選用的 D1、R2 綁定名稱。請勿把密碼、API Key 或其他敏感資料寫入此檔案；正式環境變數應透過部署平台管理。

## 注意事項

- 網站內的交通時間與預算為家庭行程規劃估算。
- 捷運步行分鐘數可能因出口、推車路線與電梯位置而不同。
- 餐廳營業時間、價格、訂位規則及兒童椅供應可能隨時調整。
- 戶外景點出發前請確認天氣與官方開放資訊。
