# FREQ. NIGHT 01

1日かぎりの音楽イベントのウェブサイト。2026年11月28日、EAST DOCK HALL。出演4組。

公開先: https://freq.sample.teciora.com

## 画面

| ルート | |
|---|---|
| `/` | FREQ. トップ |
| `/admin` | 公演担当のログイン |
| `/admin/event` | 公演を編集 |
| `/admin/overview` | 公演一覧 |
| `/apply` | チケットの申し込み |

## 作りで決めたこと

### 黒地に蛍光色ひとつ

日時・場所・出演者だけで1ページを組む。情報が少ないので、色数も減らす。

### 申し込みは確定の手前で止める

枚数と合計を出して、入力内容を確認する画面まで。

## 入力を扱う画面について

入力欄のある画面はあるが、`<form>` 要素を1つも置いていない。`action` の無い
form は、ハイドレートが終わる前に Enter を押すと現在の URL へ GET する。
氏名・電話・メールがクエリ文字列に乗り、履歴・リファラ・アクセスログに残る。
送信先を持たない画面にその穴を残す理由がないので、form ごと置いていない。

同じ理由で、`fetch` も Server Actions も `localStorage` も持たせていない。
ボタンの文字も実際に起きることに合わせてある（「送信する」ではなく
「入力内容を確認する」）。

`scripts/check.sh` がこれを機械で確かめる。15群あり、27通りの違反を注入して
全部赤くなることを確認してある。

```bash
bash scripts/check.sh
```

## 動かす

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # 本番と同じ静的書き出し
npm run typecheck
```

Next.js 15 の App Router。全5ルートを静的に書き出す。欧文の見出しに Archivo を1書体だけ読む。和文は端末の書体に任せる。

main に push すると GitHub Actions が Vercel へ出す（`.github/workflows/deploy.yml`）。

## 素材

写真は AI 生成（Higgsfield 経由の `gpt_image_2`）。人体は写していない。
出所と条件は [docs/credits.md](docs/credits.md) に1ファイル1行で書いてある。
`public/samples/freq/` に2ファイル、AVIF と WebP の2系統で置いてある。

## 書いてあることについて

この事業者は架空。社名・人名・住所・電話番号・金額・在庫数はこの画面のために
用意したもので、実在の事業者とは関係ない。全ページ noindex にしてある。

---

制作: [Teciora](https://www.teciora.com/)
