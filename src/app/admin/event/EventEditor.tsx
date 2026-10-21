'use client';

import { useId, useRef, useState } from 'react';
import {
  ErrorSummary,
  SelectField,
  TextField,
} from '@/components/site/fields';
import { signedYen, yen } from '@/components/site/format';
import { formatLongJa } from '@/components/site/calendar';
import {
  listErrors,
  required,
  trim,
  type FieldError,
} from '@/components/site/validate';
import {
  ADVANCE,
  BUYER_NOTE,
  CAPACITY,
  CAPACITY_OPTIONS,
  EDIT_NOTE,
  EVENT,
  PRICE_OPTIONS,
  SALE_STATE,
  SOLD,
  saleState,
  salesAmount,
  type SaleState,
} from '../../_data';
import { FreqCard } from '../../_admin';
import { FREQ_BTN, FREQ_BTN_LINE } from '../../_ui';

/* ============================================================================
 * 公演を編集。**保存はしない。終点は「変更内容の確認」。**
 *
 * ■ 変更の影響は、押す前から見えていること
 *   料金を変えると右の「チケット売上」がその場で変わり、差額が出る。
 *   販売枚数を変えると残り枚数が変わる。**保存を押してから気づく**形に
 *   しないために、同じ画面の中に効き先を置いている。
 *
 * ■ 販売済みを下回る枚数は止める
 *   382枚売れている公演の上限を 300枚にはできない。ここで止めないと、
 *   入場できない人が生まれる。**編集画面で止められる事故は、編集画面で
 *   止めるしかない。**同じ理由で、日時・会場の欄には
 *   「購入者への案内もあわせて行ってください」と書いてある。
 *
 * ■ `<form>` を使わない／`action` という語を使わない
 *   前者はハイドレート前の Enter で値が URL に載るため。後者は検査が
 *   `action=` を送信系の印として文字列で探すため（JSX の prop 名でも当たる）。
 * ==========================================================================*/

const FIELD_ORDER = ['name', 'schedule', 'venue', 'capacity'] as const;

const FIELD_LABELS: Record<string, string> = {
  name: '公演名',
  schedule: '開催日時',
  venue: '会場',
  capacity: '販売枚数',
};

const SAVED_SCHEDULE = `${formatLongJa(EVENT.date)} / 開場${EVENT.open}・開演${EVENT.start}`;

export function EventEditor() {
  const uid = useId().replace(/:/g, '');
  const id = (k: string) => `${uid}-${k}`;
  const summaryRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState<string>(EVENT.name);
  const [schedule, setSchedule] = useState(SAVED_SCHEDULE);
  const [venue, setVenue] = useState<string>(EVENT.venue);
  const [price, setPrice] = useState(String(ADVANCE));
  const [capacity, setCapacity] = useState(String(CAPACITY));
  const [state, setState] = useState<SaleState>('onsale');

  const [checked, setChecked] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const priceNum = Number(price);
  const capacityNum = Number(capacity);
  const savedSales = salesAmount(ADVANCE, SOLD);
  const nextSales = salesAmount(priceNum, SOLD);
  const diff = nextSales - savedSales;
  const left = capacityNum - SOLD;

  const errors: Record<string, FieldError> = {
    name: required(name, '公演名'),
    schedule: required(schedule, '開催日時'),
    venue: required(venue, '会場'),
    capacity:
      capacityNum < SOLD
        ? `すでに${SOLD}枚が売れています。販売枚数は${SOLD}枚以上にしてください。`
        : null,
  };

  const items = checked ? listErrors(FIELD_ORDER, errors, FIELD_LABELS) : [];
  const err = (k: string) => (checked ? (errors[k] ?? null) : null);

  const changes: string[] = [];
  if (trim(name) !== EVENT.name) changes.push(`公演名：${EVENT.name} → ${trim(name)}`);
  if (trim(schedule) !== SAVED_SCHEDULE) {
    changes.push(`開催日時：${SAVED_SCHEDULE} → ${trim(schedule)}`);
  }
  if (trim(venue) !== EVENT.venue) changes.push(`会場：${EVENT.venue} → ${trim(venue)}`);
  if (priceNum !== ADVANCE) {
    changes.push(
      `一般チケット：${yen(ADVANCE)} → ${yen(priceNum)}（売上 ${yen(savedSales)} → ${yen(nextSales)} / 差額 ${signedYen(diff)}）`,
    );
  }
  if (capacityNum !== CAPACITY) {
    changes.push(
      `販売枚数：${CAPACITY}枚 → ${capacityNum}枚（残り ${CAPACITY - SOLD}枚 → ${left}枚）`,
    );
  }
  if (state !== 'onsale') {
    changes.push(`公開・販売状態：${saleState('onsale').label} → ${saleState(state).label}`);
  }

  const touchesBuyers =
    trim(schedule) !== SAVED_SCHEDULE || trim(venue) !== EVENT.venue;

  function onReview() {
    setChecked(true);
    if (FIELD_ORDER.some((k) => errors[k])) {
      setReviewing(false);
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setReviewing(true);
    window.requestAnimationFrame(() => {
      document.getElementById(id('review-head'))?.focus();
    });
  }

  /* --------------------------------------------------------- 変更内容の確認 */
  if (reviewing) {
    return (
      <FreqCard>
        <h2
          id={id('review-head')}
          tabIndex={-1}
          className="text-[24px] font-bold text-[var(--ink)]"
        >
          変更内容の確認
        </h2>

        {changes.length === 0 ? (
          <p className="mt-4 text-[14px] leading-[1.9] text-[var(--sub)]">
            変更されている項目はありません。{EVENT.name} / {SAVED_SCHEDULE} /{' '}
            {EVENT.venue} / {yen(ADVANCE)} / {CAPACITY}枚 のままです。
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {changes.map((c) => (
              <li
                key={c}
                className="border-l-2 border-[var(--green)] pl-4 text-[14px] leading-[1.9] text-[var(--ink)]"
              >
                {c}
              </li>
            ))}
          </ul>
        )}

        {touchesBuyers && (
          <p className="mt-5 border border-[var(--alert)] px-4 py-3 text-[13px] font-semibold leading-[1.8] text-[var(--alert)]">
            日時または会場を変えています。{EDIT_NOTE}
          </p>
        )}

        <p className="mt-6 border-t border-[var(--line)] pt-5 text-[13px] leading-[1.9] text-[var(--sub)]">
          ここまでが確認です。変更は保存されていません。この画面は見本なので、
          入力はどこにも送られず、ブラウザを閉じれば残りません。
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setReviewing(false)}
            className={FREQ_BTN_LINE}
          >
            編集に戻る
            <span aria-hidden="true">&#8598;</span>
          </button>
          <a
            href="/admin/overview"
            className={FREQ_BTN_LINE}
          >
            公演一覧を開く
            <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
      </FreqCard>
    );
  }

  /* ------------------------------------------------------------------ 編集 */
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <FreqCard>
        <div role="group" aria-label="公演情報の編集">
          {items.length > 0 && (
            <div ref={summaryRef} className="mb-6">
              <ErrorSummary
                id={id('summary')}
                title={`入力を確認してください（${items.length}件）`}
                items={items}
                fieldId={(k) => id(k)}
              />
            </div>
          )}

          <h2 className="text-[19px] font-bold text-[var(--ink)]">公演情報</h2>

          <div className="mt-5 space-y-5">
            <TextField
              id={id('name')}
              label="公演名"
              value={name}
              onChange={setName}
              error={err('name')}
            />
            <TextField
              id={id('schedule')}
              label="開催日時"
              value={schedule}
              onChange={setSchedule}
              error={err('schedule')}
              hint={EDIT_NOTE}
            />
            <TextField
              id={id('venue')}
              label="会場"
              value={venue}
              onChange={setVenue}
              error={err('venue')}
            />

            {/*
              料金と販売枚数は**1つの欄として扱う**。
              片方だけ直すと、残り枚数と売上のどちらかが必ずずれるため。
            */}
            <div
              role="group"
              aria-labelledby={id('ticket-label')}
              className="border border-[var(--line-strong)] p-4"
            >
              <p
                id={id('ticket-label')}
                className="text-[13px] font-semibold leading-[1.5] text-[var(--ink)]"
              >
                一般チケット / 販売枚数
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id={id('price')}
                  label="料金"
                  value={price}
                  onChange={setPrice}
                  options={PRICE_OPTIONS.map((p) => ({
                    value: String(p),
                    label: yen(p),
                  }))}
                />
                <SelectField
                  id={id('capacity')}
                  label="販売枚数"
                  value={capacity}
                  onChange={setCapacity}
                  options={CAPACITY_OPTIONS.map((c) => ({
                    value: String(c),
                    label: `${c}枚`,
                  }))}
                  error={err('capacity')}
                />
              </div>
              <p className="freq-num mt-3 text-[12px] text-[var(--sub)]">
                現在の設定：{yen(priceNum)} / {capacityNum}枚（販売済み {SOLD}枚 /
                残り {left}枚）
              </p>
            </div>

            <SelectField
              id={id('state')}
              label="公開・販売状態"
              value={state}
              onChange={(v) => setState(v as SaleState)}
              options={SALE_STATE.map((s) => ({ value: s.id, label: s.label }))}
              hint={saleState(state).note}
            />
          </div>

          <p className="mt-6 text-[12px] leading-[1.8] text-[var(--sub)]">
            内容を確認してから保存してください。
          </p>
          <button type="button" onClick={onReview} className={`${FREQ_BTN} mt-4`}>
            変更を保存する
            <span aria-hidden="true">&#8599;</span>
          </button>
          <p className="mt-3 text-[12px] leading-[1.8] text-[var(--sub)]">
            押すと変更内容の確認に進みます。この画面では保存されません。
          </p>
        </div>
      </FreqCard>

      <FreqCard title="販売中のチケット">
        <p className="text-[17px] font-semibold text-[var(--ink)]">
          一般 / スタンディング
        </p>
        <p className="freq-num mt-3 text-[13px] leading-[1.9] text-[var(--sub)]">
          販売済み {SOLD}枚 / 残り {left}枚
          <br />
          チケット売上 {yen(nextSales)}
          {priceNum !== ADVANCE && (
            <>
              <br />
              <span className="text-[var(--green)]">
                変更後の売上（差額 {signedYen(diff)}）
              </span>
            </>
          )}
        </p>

        <div className="mt-5 border-t border-[var(--line)] pt-5">
          <p className="text-[14px] font-semibold text-[var(--ink)]">
            購入者へのご案内
          </p>
          {BUYER_NOTE.map((line) => (
            <p key={line} className="mt-2 text-[13px] leading-[1.9] text-[var(--sub)]">
              {line}
            </p>
          ))}
        </div>

        <p className="mt-5 border-t border-[var(--line)] pt-5 text-[12px] leading-[1.9] text-[var(--sub)]">
          {EDIT_NOTE}
        </p>
      </FreqCard>
    </div>
  );
}
