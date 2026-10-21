import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SITE_SHELL } from '@/components/site/styles';
import { Wordmark } from './_ui';
import { STAFF_ON_DUTY, STAFF_ROLE } from './_data';

/* ============================================================================
 * FREQ. の管理画面の器。
 *
 * ■ 共有の AdminShell（左サイドバー）を使っていない
 *   共有の器は「一日じゅう開く業務画面」の形で、縦に長いメニューを持つ。
 *   この公演の管理は**当日の数時間**しか開かれず、画面は3つしかない。
 *   書き出しも横1本の帯になっている。**項目が3つしかないメニューに
 *   画面幅の 220px を取られるほうが損**なので、この本だけ上帯にした。
 *   共有部品を書き換えずに、この器をサイト側に置いている
 *   （8本が同時に走っているので、共有側の変更は他の本に波及する）。
 *
 * ■ 表側と同じ配色スコープを使う
 *   黒と蛍光は主催の持ち物で、裏側だけ白い汎用ダッシュボードにすると
 *   別のサービスに見える。面の割り方だけを裏側の作法（余白を詰める・
 *   カードに割る）に寄せている。
 *
 * ■ 上帯は sticky。**祖先に overflow / transform を付けないこと。**
 * ==========================================================================*/

export type AdminPage = 'overview' | 'event';

export function FreqAdmin({
  current,
  children,
}: {
  current: AdminPage;
  children: ReactNode;
}) {
  const base = `/admin`;
  const nav: readonly { label: string; href: string; id: AdminPage }[] = [
    { label: '公演一覧', href: `${base}/overview`, id: 'overview' },
    { label: '公演を編集', href: `${base}/event`, id: 'event' },
  ];

  return (
    <>
      <div className="sample-body sample-freq site-on-dark min-h-screen bg-[var(--cream)] text-[var(--ink)]">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]">
          <div
            className={`${SITE_SHELL} flex min-h-[var(--site-header-h)] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3`}
          >
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <a
                href={`${base}/overview`}
                className="inline-flex min-h-[44px] items-center"
              >
                <Wordmark size="sm" />
                <span className="sr-only">FREQ. 公演管理</span>
              </a>
              <nav aria-label="管理画面のメニュー">
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
                  {nav.map((n) => (
                    <li key={n.href}>
                      <a
                        href={n.href}
                        {...(n.id === current
                          ? { 'aria-current': 'page' as const }
                          : {})}
                        className={`inline-flex min-h-[44px] items-center text-[13px] ${
                          n.id === current
                            ? 'font-bold text-[var(--green)] underline underline-offset-[6px]'
                            : 'font-medium text-[var(--on-dark-soft)] hover:text-[var(--ink)]'
                        }`}
                      >
                        {n.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <p className="text-[12px] text-[var(--sub)]">
              {STAFF_ON_DUTY} / {STAFF_ROLE}
            </p>
          </div>
        </header>

        <main id="main" className={`${SITE_SHELL} py-8 md:py-10`}>
          {children}
        </main>

        <div className={`${SITE_SHELL} pb-12`}>
          <p className="border-t border-[var(--line)] pt-6 text-[12px] text-[var(--sub)]">
            <a
              href="/"
              className="inline-flex min-h-[44px] items-center underline underline-offset-4"
            >
              告知ページを開く
            </a>
          </p>
        </div>
      </div>
      {/* Teciora の帯。**配色スコープの外**に置く（[8] が全ページで見ている）。 */}
      <SiteFooter />
    </>
  );
}

/**
 * 管理画面のカード。共有の AdminCard は角を 6px 丸めるが、この本は
 * 表側も裏側も直角で通しているので、器だけ差し替えている。
 *
 * `min-w-0` は飾りではない。このカードはグリッドの子になることがあり、
 * グリッドの子は既定で `min-width: auto`（＝中身の min-content より縮まない）。
 * 中に最小幅を持つ表が入ると、**列がその幅まで広がってページ全体に
 * 横スクロールが出る**（`.site-scroll-x` は自分の中しかスクロールさせない）。
 */
export function FreqCard({
  title,
  trailing,
  children,
  className = '',
}: {
  title?: string;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`min-w-0 bg-[var(--paper)] p-5 md:p-6 ${className}`}>
      {(title || trailing) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && (
            <h2 className="text-[17px] font-bold text-[var(--ink)]">{title}</h2>
          )}
          {trailing}
        </div>
      )}
      {children}
    </section>
  );
}

/** 画面の見出し（管理側）。 */
export function AdminHead({
  title,
  lead,
  trailing,
}: {
  title: string;
  lead: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-bold text-[var(--ink)] md:text-[30px]">
          {title}
        </h1>
        <p className="mt-2 text-[13px] text-[var(--sub)]">{lead}</p>
      </div>
      {trailing}
    </div>
  );
}
