/* ============================================================================
 * FREQ.（架空・1日かぎりの音楽イベント）の共有データ。
 *
 * **告知・申し込み・公演担当の管理が、ここだけを見る。**
 * 複製すると、料金や枚数を1か所だけ直したときに画面ごとに違う値が出る
 * ——という形で静かに壊れる。書き出した画面（public/works/freq/）の数字は
 * すべてこのファイルから再現できる。
 *
 * 置いてよいのは次のものだけ:
 *  - React にもブラウザ API にも依存しない定数
 *  - 引数だけで結果が決まる純粋関数（SSR と CSR で必ず同じ値になる＝
 *    ハイドレーションのずれが出ない）
 * 日付ライブラリは使わない（`@/components/site/calendar` の整数演算）。
 *
 * 「今日」を端末時計から取らない。当日券の判定も含め、日付はすべて定数。
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 * 公演
 * ------------------------------------------------------------------------- */

export const EVENT = {
  name: 'FREQ. NIGHT 01',
  /** 開催日。表示は formatLongJa で「2026年11月28日（土）」。 */
  date: '2026-11-28',
  /** 蛍光ブロックに出る短い日付。 */
  dateShort: '11.28',
  open: '17:00',
  start: '18:00',
  close: '21:30',
  venue: 'EAST DOCK HALL',
  city: 'TOKYO',
} as const;

/** 出演。時刻の早い順。書き出したタイムテーブルと同じ並び。 */
export const TIMETABLE: readonly {
  time: string;
  act: string;
  /** 欧文だけの1行。和文と混ぜない（別書体になるため）。 */
  kind: string;
}[] = [
  { time: '18:00', act: 'stillform', kind: 'ALTERNATIVE / LIVE' },
  { time: '18:50', act: 'YON', kind: 'ELECTRONIC / LIVE' },
  { time: '19:40', act: 'Cobalt Club', kind: 'INDIE DANCE / LIVE' },
  { time: '20:30', act: 'mei', kind: `DJ SET / CLOSE ${EVENT.close}` },
];

/* ---------------------------------------------------------------------------
 * チケット
 * ------------------------------------------------------------------------- */

/** 前売。オールスタンディング。 */
export const ADVANCE = 6000;
/** システム手数料。1枚ごとに掛かる。**販売額には入れない。** */
export const SYSTEM_FEE = 400;
/** 当日、受付で払うドリンク代。チケット代とは別に扱う。 */
export const DRINK = 600;

/** 申し込みボタンに出る金額。1枚なら ¥6,400。 */
export function payable(count: number): number {
  return (ADVANCE + SYSTEM_FEE) * count;
}

/** チケット代だけの小計（手数料を含まない）。 */
export function ticketSubtotal(count: number): number {
  return ADVANCE * count;
}

export function feeTotal(count: number): number {
  return SYSTEM_FEE * count;
}

/** 申し込める枚数。1人4枚まで。 */
export const MAX_PER_ORDER = 4;

/* ---------------------------------------------------------------------------
 * 販売状況
 * ------------------------------------------------------------------------- */

/** 販売枚数の上限（会場の定員）。 */
export const CAPACITY = 500;
/** 販売済み。書き出した管理画面の 382 / 500枚。 */
export const SOLD = 382;
/** 入場済み。開場後に受付でもぎった数。 */
export const ENTERED = 124;

/**
 * 販売額。**¥6,000 × 382枚 = ¥2,292,000。手数料 ¥400 は入れない。**
 * 手数料は決済事業者に渡るお金で、公演の売上ではない。混ぜると精算で困る。
 */
export function salesAmount(price: number = ADVANCE, sold: number = SOLD): number {
  return price * sold;
}

/** 残り枚数。 */
export function remaining(capacity: number = CAPACITY, sold: number = SOLD): number {
  return capacity - sold;
}

/** 販売の進み（%）。0〜100 に収める。 */
export function soldPercent(
  sold: number = SOLD,
  capacity: number = CAPACITY,
): number {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((sold / capacity) * 100)));
}

/* ---------------------------------------------------------------------------
 * チケット台帳（架空）
 * ------------------------------------------------------------------------- */

export type EntryState = 'waiting' | 'entered';

export const ENTRY_LABEL: Record<EntryState, string> = {
  waiting: '未入場',
  entered: '入場済み',
};

export type Ticket = {
  /** 受付番号の末尾4桁。表示は FQ-0382。 */
  id: string;
  buyer: string;
  count: number;
  state: EntryState;
  /** 購入日時。開催日より前の固定値。 */
  boughtAt: string;
};

/**
 * いちばん新しい5件。先頭の 0382 が、申し込み画面から続く1件。
 * 全382件のうちの直近だけを出すのは、当日の受付で見るのがこの並びだから。
 */
export const TICKETS: readonly Ticket[] = [
  { id: '0382', buyer: '小林 蓮', count: 1, state: 'waiting', boughtAt: '11/20 12:41' },
  { id: '0381', buyer: '中井 歩', count: 1, state: 'waiting', boughtAt: '11/20 12:20' },
  { id: '0380', buyer: '石川 凪', count: 1, state: 'entered', boughtAt: '11/20 11:56' },
  { id: '0379', buyer: '木村 航', count: 1, state: 'waiting', boughtAt: '11/20 11:32' },
  { id: '0378', buyer: '原田 葵', count: 1, state: 'entered', boughtAt: '11/20 11:10' },
];

/** 受付番号の表示形。 */
export function receiptNumber(id: string): string {
  return `FQ-${id}`;
}

/* ---------------------------------------------------------------------------
 * 公演を編集
 * ------------------------------------------------------------------------- */

/** 料金の候補。編集画面で選べる値。 */
export const PRICE_OPTIONS: readonly number[] = [5500, 6000, 6500];

/** 販売枚数の候補。**販売済みを下回る値も候補には出す**（選べば警告が出る）。 */
export const CAPACITY_OPTIONS: readonly number[] = [300, 400, 500, 600];

export type SaleState = 'onsale' | 'paused' | 'hidden';

export const SALE_STATE: readonly { id: SaleState; label: string; note: string }[] = [
  {
    id: 'onsale',
    label: '公開中・販売中',
    note: '告知ページが開き、申し込みも受け付けます。',
  },
  {
    id: 'paused',
    label: '公開中・販売停止',
    note: '告知ページは開きますが、申し込みは止まります。',
  },
  {
    id: 'hidden',
    label: '非公開',
    note: '告知ページも閉じます。購入済みの方へのご案内は別に必要です。',
  },
];

export function saleState(id: SaleState) {
  const s = SALE_STATE.find((x) => x.id === id);
  if (!s) throw new Error(`unknown sale state: ${id}`);
  return s;
}

/** 編集画面の注意書き。**編集画面で止められる事故は、編集画面に書くしかない。** */
export const EDIT_NOTE =
  'チケット販売後の日時・会場変更は購入者への案内もあわせて行ってください。';

/** 購入者へのご案内（編集画面の右側）。当日かかるお金を2行で。 */
export const BUYER_NOTE: readonly string[] = [
  '入場時にドリンク代 ¥600 が必要です。',
  '受付手数料は1枚 ¥400 です。',
];

/** 公演担当（管理画面の右上）。 */
export const STAFF_ON_DUTY = '小川';
export const STAFF_ROLE = '公演担当';
