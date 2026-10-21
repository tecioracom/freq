import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SITE_SHELL } from '@/components/site/styles';

/* ============================================================================
 * FREQ. の共通パーツ（ワードマーク・ヘッダー・主催のフッター・ページの器）。
 *
 * ■ 器の入れ子
 *     <FreqShell>                       ← .sample-body.sample-freq（配色スコープ）
 *       <FreqHeader /> … <main> …       ← 告知の画面
 *       <FreqFooter />                  ← 主催のフッター（蛍光の面）
 *     </FreqShell>
 *     <SiteFooter />                    ← Teciora の帯（スコープの**外**）
 *
 *   Teciora の帯をスコープの中に入れると、黒と蛍光のパレットを継承して
 *   「主催のフッターが2つある」ように見える。必ず外に出すこと。
 *
 * ■ ボタンの塗りは共有部品に任せない
 *   BTN_PRIMARY は `bg-[var(--green)] text-[var(--cream)]` なので、この本では
 *   「蛍光の面に黒い文字」になる。**それが書き出しと同じ**なので、
 *   主ボタンは共有部品をそのまま使い、幅と角だけこの器で揃える。
 *
 * ■ ここにも overflow / transform / filter を付けない（sticky が死ぬ）。
 * ==========================================================================*/

/** 蛍光の面に黒、という FREQ. の押せるものの基本形。 */
export const FREQ_BTN =
  'inline-flex min-h-[48px] w-full items-center justify-between gap-4 bg-[var(--green)] px-5 text-[15px] font-semibold text-[var(--cream)] transition duration-150 hover:bg-[var(--green-deep)] sm:w-auto sm:min-w-[260px]';

/** 線だけのボタン（戻る・やり直す）。暗い地の上なので線は明るい側に振る。 */
export const FREQ_BTN_LINE =
  'inline-flex min-h-[48px] w-full items-center justify-between gap-4 border border-[var(--line-strong)] bg-[var(--paper)] px-5 text-[15px] font-semibold text-[var(--ink)] transition duration-150 hover:border-[var(--ink)] sm:w-auto sm:min-w-[200px]';

export function Wordmark({
  size = 'md',
  tone = 'neon',
}: {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'neon' | 'ink';
}) {
  const px =
    size === 'lg' ? 'text-[44px]' : size === 'sm' ? 'text-[18px]' : 'text-[24px]';
  const color = tone === 'ink' ? 'text-[var(--cream)]' : 'text-[var(--green)]';
  return (
    <span className={`freq-wordmark block ${px} ${color}`} aria-hidden="true">
      FREQ.
    </span>
  );
}

export function WordmarkLink({
  tone = 'neon',
  size = 'md',
}: {
  tone?: 'neon' | 'ink';
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <a
      href="/"
      className="inline-flex min-h-[44px] items-center"
    >
      <Wordmark size={size} tone={tone} />
      <span className="sr-only">FREQ. ホーム</span>
    </a>
  );
}

const NAV: readonly { label: string; hash: string }[] = [
  { label: 'LINEUP', hash: '#lineup' },
  { label: 'TICKETS', hash: '#tickets' },
  { label: 'ACCESS', hash: '#access' },
];

/**
 * 告知のヘッダー。
 * `full` … トップ。欧文のメニューを並べる。
 * `back` … 申し込み画面。右は「戻る」だけ（迷わせない）。
 */
export function FreqHeader({
  mode = 'full',
}: {
  mode?: 'full' | 'back';
}) {
  return (
    <header className="site-on-dark sticky top-0 z-20 bg-[var(--cream)]">
      <div
        className={`${SITE_SHELL} flex min-h-[var(--site-header-h)] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3`}
      >
        <WordmarkLink />

        {mode === 'full' ? (
          <nav
            aria-label="FREQ. のメニュー"
            className="flex flex-wrap items-center gap-x-5 gap-y-1"
          >
            {NAV.map((n) => (
              <a
                key={n.hash}
                href={n.hash}
                className="freq-label inline-flex min-h-[44px] items-center text-[12px] text-[var(--on-dark-soft)] hover:text-[var(--ink)]"
              >
                {n.label}
              </a>
            ))}
            <a
              href="/apply"
              className="freq-label inline-flex min-h-[44px] items-center gap-1 text-[12px] font-semibold text-[var(--green)]"
            >
              TICKETS
              <span aria-hidden="true">&#8599;</span>
            </a>
          </nav>
        ) : (
          <a
            href="/"
            className="inline-flex min-h-[44px] items-center text-[13px] text-[var(--on-dark-soft)] underline underline-offset-4 hover:text-[var(--ink)]"
          >
            戻る
          </a>
        )}
      </div>
    </header>
  );
}

/** 主催のフッター（蛍光の面）。8本の中でここだけは FREQ. の言葉で書く。 */
export function FreqFooter() {
  return (
    <div className="mt-24 bg-[var(--green)] py-14 text-[var(--cream)] md:py-16">
      <div className={SITE_SHELL}>
        <p
          className="freq-display text-[40px] text-[var(--cream)] min-[340px]:text-[52px] md:text-[72px]"
          aria-hidden="true"
        >
          FREQ.
        </p>
        <p className="freq-label mt-5 text-[12px] text-[var(--cream)]">
          LIVE MUSIC / TOKYO / 2026
        </p>

        <nav aria-label="FREQ. のページ" className="mt-6">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[13px] font-semibold">
            <li>
              <a
                href="/#lineup"
                className="inline-flex min-h-[44px] items-center hover:underline"
              >
                出演・タイムテーブル
              </a>
            </li>
            <li>
              <a
                href="/#tickets"
                className="inline-flex min-h-[44px] items-center hover:underline"
              >
                チケット
              </a>
            </li>
            <li>
              <a
                href="/apply"
                className="inline-flex min-h-[44px] items-center hover:underline"
              >
                申し込み
              </a>
            </li>
            <li>
              <a
                href="/admin"
                className="inline-flex min-h-[44px] items-center hover:underline"
              >
                公演担当の方
              </a>
            </li>
          </ul>
        </nav>

        <p className="mt-8 text-[12px] leading-[1.8]">
          &copy; FREQ. / 架空のイベントです。会場も出演者も実在しません。
        </p>
      </div>
    </div>
  );
}

/**
 * 1ページぶんの器。
 * `main` の id は本体サイトと同じ `main`（スキップリンクの行き先）。
 */
export function FreqShell({
  children,
  header = 'full',
  hideFooter = false,
}: {
  children: ReactNode;
  header?: 'full' | 'back' | 'none';
  hideFooter?: boolean;
}) {
  return (
    <>
      <div className="sample-body sample-freq site-on-dark min-h-screen bg-[var(--cream)] text-[var(--ink)]">
        {header !== 'none' && <FreqHeader mode={header} />}
        {children}
        {!hideFooter && <FreqFooter />}
      </div>
      <SiteFooter />
    </>
  );
}

/** 申し込み画面の見出しの塊。 */
export function PageHead({ ja, lead }: { ja: string; lead: string }) {
  return (
    <div>
      <h1 className="text-[34px] leading-[1.25] text-[var(--ink)] md:text-[44px]">
        {ja}
      </h1>
      <p className="mt-3 max-w-[34em] text-[14px] leading-[1.9] text-[var(--sub)]">
        {lead}
      </p>
    </div>
  );
}
