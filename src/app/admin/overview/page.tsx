import type { Metadata } from 'next';
import { yen } from '@/components/site/format';
import { FreqAdmin, AdminHead, FreqCard } from '../../_admin';
import {
  CAPACITY,
  ENTERED,
  ENTRY_LABEL,
  EVENT,
  SOLD,
  TICKETS,
  payable,
  receiptNumber,
  remaining,
  salesAmount,
  soldPercent,
} from '../../_data';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * 公演一覧 `/admin/overview`。
 *
 * ■ 当日いちばん見られるのは、売れた枚数と入場の数
 *   だから最初の面をその2つに使い切る。ほかの指標は足していない。
 *
 * ■ 販売額に手数料を入れない
 *   ¥6,000 × 382枚 = ¥2,292,000。システム手数料 ¥400 は決済事業者に渡る
 *   お金で、公演の売上ではない。混ぜると精算のときに困る。
 *   数字は `_data.ts` の salesAmount() から出していて、定数で書いていない
 *   （料金を変えたときに**この画面だけ古いまま**にならないようにするため）。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '公演一覧 — FREQ. 公演管理',
    description:
      'FREQ. NIGHT 01 の販売状況。販売枚数・販売額・残り枚数・入場済みと、直近のチケット。',
    alternates: { canonical: '/admin/overview' },
    robots: { index: false, follow: false },
  };
}

export default async function OverviewPage() {

  const pct = soldPercent();

  return (
    <FreqAdmin current="overview">
      <AdminHead
        title={EVENT.name}
        lead={`2026.11.28 / ${EVENT.venue} / 販売中`}
        trailing={
          <a
            href="/admin/event"
            className="inline-flex min-h-[48px] items-center justify-between gap-6 bg-[var(--green)] px-5 text-[14px] font-semibold text-[var(--cream)] transition duration-150 hover:bg-[var(--green-deep)]"
          >
            公演を編集
            <span aria-hidden="true">&#8599;</span>
          </a>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <FreqCard className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="text-[22px] font-bold text-[var(--green)] md:text-[26px]">
              チケット販売
            </span>
            <span className="freq-num text-[30px] font-bold text-[var(--green)] md:text-[36px]">
              {SOLD} / {CAPACITY}枚
            </span>
          </p>
          <p className="freq-num mt-2 text-[13px] text-[var(--sub)]">
            販売額 {yen(salesAmount())} / 残り{remaining()}枚
          </p>

          {/* 進みぐあい。色だけで伝えないよう、上に数字を出したうえで添える。 */}
          <div
            role="img"
            aria-label={`販売の進みぐあい ${pct}%`}
            className="mt-5 h-[6px] w-full bg-[var(--line)]"
          >
            <div
              className="h-[6px] bg-[var(--green)]"
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="freq-num mt-5 border-t border-[var(--line)] pt-4 text-[15px] font-semibold text-[var(--ink)]">
            入場済み {ENTERED}名 / 購入者数 {SOLD}名
          </p>
          <p className="mt-2 text-[12px] text-[var(--sub)]">
            すべて一般1枚のお申し込みのため、枚数と人数が一致します。
          </p>
        </FreqCard>

        <SitePhoto
          src="freq/stage"
          width={1200}
          height={675}
          eager
          className="freq-stage min-h-[200px] w-full"
        />
      </div>

      <FreqCard
        className="mt-4"
        title="チケット一覧"
        trailing={
          <p className="freq-num text-[12px] text-[var(--sub)]">
            最新5件 / 全{SOLD}件
          </p>
        }
      >
        <div className="site-scroll-x">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr>
                {['受付番号', '購入者', '枚数', '入場状態', '購入日時', '料金'].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="whitespace-nowrap border-b border-[var(--line)] bg-[var(--soft)] px-3 py-2 text-[12px] font-semibold text-[var(--soft-ink)]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {TICKETS.map((t) => (
                <tr key={t.id}>
                  <th
                    scope="row"
                    className="freq-num whitespace-nowrap border-b border-[var(--line)] px-3 py-4 text-left text-[13px] font-semibold text-[var(--ink)]"
                  >
                    {receiptNumber(t.id)}
                  </th>
                  <td className="whitespace-nowrap border-b border-[var(--line)] px-3 py-4 text-[13px] text-[var(--ink)]">
                    {t.buyer}
                  </td>
                  <td className="freq-num whitespace-nowrap border-b border-[var(--line)] px-3 py-4 text-[13px] text-[var(--ink)]">
                    {t.count}
                  </td>
                  <td className="whitespace-nowrap border-b border-[var(--line)] px-3 py-4 text-[13px]">
                    <span
                      className={
                        t.state === 'entered'
                          ? 'text-[var(--green)]'
                          : 'text-[var(--sub)]'
                      }
                    >
                      {ENTRY_LABEL[t.state]}
                    </span>
                  </td>
                  <td className="freq-num whitespace-nowrap border-b border-[var(--line)] px-3 py-4 text-[13px] text-[var(--sub)]">
                    {t.boughtAt}
                  </td>
                  <td className="freq-num whitespace-nowrap border-b border-[var(--line)] px-3 py-4 text-[13px] text-[var(--ink)]">
                    {yen(payable(t.count))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12px] leading-[1.8] text-[var(--sub)]">
          料金は前売 ¥6,000 とシステム手数料 ¥400 を合わせた、お支払い済みの
          金額です。上の販売額は前売のぶんだけを数えています。
        </p>
      </FreqCard>
    </FreqAdmin>
  );
}
