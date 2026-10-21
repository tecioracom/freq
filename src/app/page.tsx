import type { Metadata } from 'next';
import { SITE_SHELL } from '@/components/site/styles';
import { yen } from '@/components/site/format';
import { formatLongJa } from '@/components/site/calendar';
import { FreqShell } from './_ui';
import { ADVANCE, DRINK, EVENT, SYSTEM_FEE, TIMETABLE } from './_data';
import { SitePhoto } from '@/components/site/SitePhoto';

/* ============================================================================
 * FREQ. トップ `/`。
 * 書き出した 1440×2839 の1ページを、そのまま1ルートに実装したもの。
 *
 * ■ 1ページに畳む
 *   イベントのページで人が探すのは、日時・場所・出演者・値段の4つしかない。
 *   下層を作らず、上から順にこの4つだけを置く。タイムテーブルは
 *   時刻とアクト名の2列（ジャンルは欧文1行の添え物）。
 *
 * ■ 数字は1か所から
 *   料金・手数料・ドリンク代・時刻は `_data.ts`。申し込み画面・管理画面と
 *   同じ定数を見ている。片方だけ直すことができない形にしてある。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'FREQ. NIGHT 01 — 2026.11.28 / EAST DOCK HALL',
    description:
      '2026年11月28日（土）、TOKYO・EAST DOCK HALL で開く1日かぎりの音楽イベント FREQ. NIGHT 01。出演・タイムテーブル・チケット。Teciora が制作したサンプルサイトで、FREQ. は架空のイベントです。',
    alternates: { canonical: '/' },
    robots: { index: false, follow: false },
  };
}

export default async function FreqTopPage() {

  return (
    <FreqShell>
      <main id="main">
        {/* §hero */}
        <section className={`${SITE_SHELL} pb-14 pt-10 md:pb-20 md:pt-16`}>
          <p className="freq-label text-[11px] text-[var(--sub)]">
            LIVE MUSIC / INDEPENDENT SOUNDS
          </p>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
            <div>
              <h1 className="freq-display text-[36px] text-[var(--ink)] min-[340px]:text-[64px] sm:text-[88px] md:text-[112px]">
                FREQ.
                <br />
                NIGHT 01
              </h1>
              <p className="mt-6 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)] md:text-[28px]">
                土曜の夜はライブへ。
              </p>
            </div>

            {/* 蛍光ブロック。日付と申し込みを1つの面にまとめる。 */}
            <div className="bg-[var(--green)] p-[16px] text-[var(--cream)] min-[340px]:p-6 md:p-7">
              <p className="freq-wordmark text-[15px] font-bold">{EVENT.name}</p>
              <p className="freq-display mt-3 text-[40px] min-[340px]:text-[64px] md:text-[76px]">
                {EVENT.dateShort}
              </p>
              <p className="freq-label mt-4 text-[12px]">
                2026 SAT / OPEN {EVENT.open}
              </p>
              <p className="freq-label mt-1 text-[12px]">
                {EVENT.city} &middot; {EVENT.venue}
              </p>
              <a
                href="/apply"
                className="mt-6 flex min-h-[52px] items-center justify-between gap-4 bg-[var(--cream)] px-5 text-[14px] font-semibold text-[var(--green)] transition duration-150 hover:bg-[var(--paper)]"
              >
                チケットを申し込む
                <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>
        </section>

        {/* ステージの帯（写真の代わり） */}
        <div className={SITE_SHELL}>
          {/* このページで先読みする唯一の1枚（ステージの帯）。 */}
          <SitePhoto
            src="freq/stage"
            width={1200}
            height={675}
            eager
            className="freq-stage h-[220px] w-full sm:h-[300px] md:h-[380px]"
          />
          <p className="freq-label mt-4 pb-14 text-[11px] text-[var(--sub)] md:pb-20">
            4 ACTS. ONE FLOOR. &nbsp;/&nbsp; LIVE &times; ELECTRONIC &times; DJ
          </p>
        </div>

        {/* §lineup — 濃い紫の面 */}
        <section id="lineup" className="bg-[var(--soft)] py-16 md:py-24">
          <div className={SITE_SHELL}>
            <h2 className="freq-display text-[34px] text-[var(--soft-ink)] min-[340px]:text-[46px] md:text-[68px]">
              LINEUP / TIME
            </h2>
            <p className="freq-label mt-4 text-[12px] text-[var(--green)]">
              {EVENT.open} OPEN &nbsp;&middot;&nbsp; {EVENT.start} START
            </p>

            <ul role="list" className="mt-10 border-t border-[var(--on-dark-line)]">
              {TIMETABLE.map((t) => (
                <li
                  key={t.time}
                  className="flex flex-wrap items-baseline gap-x-8 gap-y-1 border-b border-[var(--on-dark-line)] py-6"
                >
                  <span className="freq-num w-[72px] shrink-0 text-[17px] font-semibold text-[var(--green)]">
                    {t.time}
                  </span>
                  <span className="min-w-0">
                    <span className="freq-display block text-[26px] text-[var(--soft-ink)] min-[340px]:text-[34px] md:text-[42px]">
                      {t.act}
                    </span>
                    <span className="freq-label mt-1 block text-[11px] text-[var(--on-dark-faint)]">
                      {t.kind}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* §tickets */}
        <section id="tickets" className="py-16 md:py-24">
          <div className={SITE_SHELL}>
            <h2 className="freq-display text-[34px] text-[var(--green)] min-[340px]:text-[56px] md:text-[80px]">
              TICKETS
            </h2>
            <p className="mt-5 text-[24px] font-semibold tracking-[-0.01em] text-[var(--ink)] md:text-[30px]">
              前売 {yen(ADVANCE)} / オールスタンディング
            </p>
            <p className="mt-4 text-[13px] leading-[1.9] text-[var(--sub)]">
              別途システム手数料 {yen(SYSTEM_FEE)} / 当日ドリンク代 {yen(DRINK)}
              <br />
              電子チケットを受付で提示してください。
            </p>
            <a
              href="/apply"
              className="mt-7 inline-flex min-h-[52px] w-full items-center justify-between gap-6 bg-[var(--green)] px-6 text-[15px] font-semibold text-[var(--cream)] transition duration-150 hover:bg-[var(--green-deep)] sm:w-auto sm:min-w-[300px]"
            >
              チケットを申し込む
              <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </section>

        {/* §access */}
        <section id="access" className="pb-4">
          <div className={SITE_SHELL}>
            <div className="border-t border-[var(--line)] pt-10">
              <h2 className="freq-display text-[28px] text-[var(--ink)] md:text-[34px]">
                {EVENT.venue} / {EVENT.city}
              </h2>
              <p className="mt-4 text-[13px] leading-[1.9] text-[var(--sub)]">
                {formatLongJa(EVENT.date)}
                <br />
                開場 {EVENT.open}・開演 {EVENT.start}・終演予定 {EVENT.close}
              </p>
              <p className="mt-3 text-[13px] leading-[1.9] text-[var(--sub)]">
                会場・出演者を含む架空のイベントです。地図や所在地は置いていません。
              </p>
            </div>
          </div>
        </section>
      </main>
    </FreqShell>
  );
}
