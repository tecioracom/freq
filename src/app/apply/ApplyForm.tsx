'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import {
  CheckField,
  ErrorSummary,
  SelectField,
  TextField,
} from '@/components/site/fields';
import { StepBar } from '@/components/site/StepBar';
import { SITE_SHELL } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { formatLongJa } from '@/components/site/calendar';
import {
  agreed,
  email as vEmail,
  listErrors,
  required,
  trim,
  type FieldError,
} from '@/components/site/validate';
import {
  ADVANCE,
  DRINK,
  EVENT,
  MAX_PER_ORDER,
  SYSTEM_FEE,
  feeTotal,
  payable,
  remaining,
  ticketSubtotal,
} from '../_data';
import { FREQ_BTN, FREQ_BTN_LINE } from '../_ui';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * チケットの申し込み。**この画面の終点は「確認」**。
 *
 * ■ 送らない・保存しない
 *   ボタンは「¥6,400で申し込む」。押すと入力チェックが走り、通れば同じルートの
 *   まま確認表示に切り替わる。「購入が完了しました」とは出さない——購入は
 *   成立していないので、それは事実と違う。押せないボタンを置いて
 *   「押せません」と書く形も採らない。**押せて、押した結果がちゃんと出る**
 *   ほうが、何ができるかが伝わる。
 *
 * ■ `<form>` を使わない
 *   `<form>` はハイドレート前に Enter を押されると、現在の URL へ GET する。
 *   氏名・メールが**そのままクエリ文字列に載る**。URL は履歴にもリファラにも
 *   ログにも残るので、起こせない形にしておく。
 *   `div role="group"` + `type="button"` だけで組む。
 *
 * ■ カード番号の入力欄を置かない
 *   書き出しには「クレジットカード / 下4桁 4242」という**選択済みの表示**が
 *   あるが、実装では番号に触れる形を一切置かない。公開されるページに決済の
 *   形をした欄があると、本物だと思った人が本物の番号を打つ。
 *   支払いは**方法の選択まで**。
 *
 * ■ 手数料は枚数ぶん動く
 *   ボタンの「¥6,400で申し込む」は `(前売 + 手数料) × 枚数`。2枚なら
 *   ¥12,800 になり、右の内訳も同時に動く。ドリンク代は当日受付で払うお金
 *   なので、**合計には足さない**（足すと当日また払うことになる）。
 * ==========================================================================*/

const PAYMENTS = [
  {
    value: 'card',
    label: 'クレジットカード',
    note: 'お手続きのご案内をメールでお送りします。この画面では番号を承りません。',
  },
  {
    value: 'conveni',
    label: 'コンビニ払い',
    note: 'お支払い番号をメールでお送りします。手数料は上の ¥400 に含みます。',
  },
] as const;
type PaymentId = (typeof PAYMENTS)[number]['value'];

const FIELD_ORDER = ['count', 'name', 'email', 'agree'] as const;

const FIELD_LABELS: Record<string, string> = {
  count: 'チケット枚数',
  name: 'お名前',
  email: 'メールアドレス',
  agree: '公演内容・料金の確認',
};

export function ApplyForm() {
  const uid = useId().replace(/:/g, '');
  const id = (k: string) => `${uid}-${k}`;
  const summaryRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState('1');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [payment, setPayment] = useState<PaymentId>('card');
  const [agree, setAgree] = useState(false);

  /** 入力チェックの結果を出すのは、いちど確認を押してから。 */
  const [checked, setChecked] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const n = Number(count);
  const left = remaining();

  const errors: Record<string, FieldError> = {
    count:
      n > left
        ? `お取りできるのは残り${left}枚です。枚数を減らしてください。`
        : null,
    name: required(name, 'お名前'),
    email: vEmail(email),
    agree: agreed(agree, '公演内容・料金'),
  };

  const items = checked ? listErrors(FIELD_ORDER, errors, FIELD_LABELS) : [];
  const err = (k: string) => (checked ? (errors[k] ?? null) : null);

  function onConfirm() {
    setChecked(true);
    if (FIELD_ORDER.some((k) => errors[k])) {
      setConfirmed(false);
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setConfirmed(true);
    window.requestAnimationFrame(() => {
      document.getElementById(id('confirm-head'))?.focus();
    });
  }

  const panel = (
    <aside className="lg:sticky lg:top-[88px] lg:self-start">
      <div className="bg-[var(--paper)] p-5">
        <SitePhoto
          src="freq/stage"
          width={1200}
          height={675}
          eager
          className="freq-stage h-[150px] w-full"
        />
        <p className="freq-wordmark mt-5 text-[22px] font-bold text-[var(--ink)]">
          {EVENT.name}
        </p>
        <div className="mt-4 border-t border-[var(--line)] pt-4 text-[13px] leading-[1.9] text-[var(--sub)]">
          <p className="freq-num">
            2026.11.28 / OPEN {EVENT.open}
          </p>
          <p>{EVENT.venue}</p>
        </div>
        <dl className="mt-4 space-y-2 text-[13px]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[var(--sub)]">一般 {n}枚</dt>
            <dd className="freq-num text-[var(--ink)]">{yen(ticketSubtotal(n))}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[var(--sub)]">システム手数料</dt>
            <dd className="freq-num text-[var(--ink)]">{yen(feeTotal(n))}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-[var(--line)] pt-3">
            <dt className="font-semibold text-[var(--ink)]">お支払い合計</dt>
            <dd className="freq-num text-[20px] font-bold text-[var(--green)]">
              {yen(payable(n))}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-[12px] leading-[1.8] text-[var(--sub)]">
          当日受付でドリンク代 {yen(DRINK)} をお支払いください。上の合計には
          含まれていません。
        </p>
      </div>
    </aside>
  );

  /* ---------------------------------------------------------------- 確認 */
  if (confirmed) {
    return (
      <div className={`${SITE_SHELL} pb-24 pt-8 md:pt-12`}>
        <StepBar
          steps={['申し込み内容・連絡先', '入力内容の確認']}
          current={2}
          className="mb-10"
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
          <div>
            <h2
              id={id('confirm-head')}
              tabIndex={-1}
              className="text-[30px] leading-[1.3] text-[var(--ink)] md:text-[38px]"
            >
              入力内容の確認
            </h2>

            <div className="mt-6 border border-[var(--green)] bg-[var(--soft)] px-5 py-4">
              <p className="text-[14px] font-bold leading-[1.8] text-[var(--green)]">
                ここまでが確認です。お申し込みはまだ確定していません。
              </p>
              <p className="mt-2 text-[13px] leading-[1.9] text-[var(--soft-ink)]">
                入力した内容は送信も保存もされません。ブラウザを閉じれば残りません。
                受付番号は、申し込みが確定したときに発行されます。
              </p>
            </div>

            <dl className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              <Row label="公演">
                {EVENT.name}
                <br />
                {formatLongJa(EVENT.date)} / 開場 {EVENT.open}・開演 {EVENT.start}
              </Row>
              <Row label="会場">
                {EVENT.venue}（{EVENT.city}）
              </Row>
              <Row label="チケット">一般 {n}枚 / オールスタンディング</Row>
              <Row label="お名前">{trim(name)}</Row>
              <Row label="メールアドレス">{trim(email)}</Row>
              <Row label="お支払い方法">
                {PAYMENTS.find((p) => p.value === payment)?.label}
              </Row>
              <Row label="お支払い合計">
                <span className="freq-num text-[22px] font-bold">
                  {yen(payable(n))}
                </span>
                <br />
                <span className="text-[12px] text-[var(--sub)]">
                  前売 {yen(ADVANCE)} &times; {n}枚 + システム手数料 {yen(SYSTEM_FEE)}{' '}
                  &times; {n}枚
                </span>
              </Row>
              <Row label="当日のお支払い">
                ドリンク代 {yen(DRINK)}（受付でお支払いください）
              </Row>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmed(false)}
                className={FREQ_BTN_LINE}
              >
                入力内容を修正する
                <span aria-hidden="true">&#8598;</span>
              </button>
              <a href="/" className={FREQ_BTN_LINE}>
                トップページへ戻る
                <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>

          {panel}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- 入力 */
  return (
    <div className={`${SITE_SHELL} pb-24 pt-8 md:pt-12`}>
      <StepBar
        steps={['申し込み内容・連絡先', '入力内容の確認']}
        current={1}
        className="mb-10"
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <div role="group" aria-label="チケット申し込みの入力">
          {items.length > 0 && (
            <div ref={summaryRef} className="mb-8">
              <ErrorSummary
                id={id('summary')}
                title={`入力を確認してください（${items.length}件）`}
                items={items}
                fieldId={(k) => id(k)}
              />
            </div>
          )}

          <p className="text-[12px] text-[var(--sub)]">
            <span aria-hidden="true">*</span> は必須項目です
          </p>

          <div className="mt-5 space-y-5">
            <SelectField
              id={id('count')}
              label="チケット枚数"
              value={count}
              onChange={setCount}
              options={Array.from({ length: MAX_PER_ORDER }, (_, i) => ({
                value: String(i + 1),
                label: `一般 ${i + 1}枚`,
              }))}
              error={err('count')}
              hint={`1回のお申し込みは${MAX_PER_ORDER}枚までです。残り${left}枚。`}
            />
            <TextField
              id={id('name')}
              label="お名前"
              value={name}
              onChange={setName}
              placeholder="例：小林 蓮"
              autoComplete="name"
              requiredMark
              error={err('name')}
            />
            <TextField
              id={id('email')}
              label="メールアドレス"
              type="email"
              inputMode="email"
              value={email}
              onChange={setEmail}
              placeholder="例：ren@example.com"
              autoComplete="email"
              requiredMark
              error={err('email')}
              hint="電子チケットのご案内をお送りする宛先です。"
            />

            {/*
              支払いは**方法の選択まで**。カード番号・有効期限・
              セキュリティコードの欄は1つも置かない。
              ラジオは <fieldset> ではなく role="radiogroup" で組む
              （@tailwindcss/forms が fieldset の余白を潰すため）。
            */}
            <div role="radiogroup" aria-labelledby={id('payment-label')}>
              <p
                id={id('payment-label')}
                className="block text-[13px] font-semibold leading-[1.5] text-[var(--ink)]"
              >
                お支払い方法
              </p>
              <div className="mt-2 space-y-2">
                {PAYMENTS.map((p) => (
                  <label
                    key={p.value}
                    className="flex min-h-[44px] items-start gap-3 border border-[var(--line-strong)] bg-[var(--paper)] px-4 py-3 text-[14px] leading-[1.6] text-[var(--ink)]"
                  >
                    <input
                      type="radio"
                      checked={payment === p.value}
                      onChange={() => setPayment(p.value)}
                      className="mt-[3px] h-[16px] w-[16px] shrink-0 border-[var(--line-strong)] text-[var(--green)] focus:ring-0"
                    />
                    <span>
                      {p.label}
                      <span className="mt-1 block text-[12px] text-[var(--sub)]">
                        {p.note}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[var(--line)] pt-6">
            <p className="text-[13px] leading-[1.9] text-[var(--sub)]">
              当日受付でドリンク代 {yen(DRINK)} をお支払いください。
              <br />
              チケットの内容によるお取り消し・ご返金は承っておりません。
            </p>

            <CheckField
              id={id('agree')}
              className="mt-5"
              checked={agree}
              onChange={setAgree}
              error={err('agree')}
              label="公演内容・料金を確認しました。"
            />

            <button
              type="button"
              onClick={onConfirm}
              className={`${FREQ_BTN} mt-6`}
            >
              {yen(payable(n))}で申し込む
              <span aria-hidden="true">&#8599;</span>
            </button>
            <p className="mt-3 text-[12px] leading-[1.8] text-[var(--sub)]">
              押すと入力内容の確認に進みます。ここでお申し込みは確定しません。
            </p>
          </div>
        </div>

        {panel}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
      <dt className="text-[13px] font-semibold text-[var(--sub)]">{label}</dt>
      <dd className="text-[14px] leading-[1.9] text-[var(--ink)]">{children}</dd>
    </div>
  );
}
