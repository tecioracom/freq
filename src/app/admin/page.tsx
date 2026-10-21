import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Wordmark } from '../_ui';
import { LoginForm } from './LoginForm';

/* ============================================================================
 * 公演担当のログイン `/admin`。
 * 黒地の中央に1枚だけ置く（書き出しと同じ割り）。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'ログイン — FREQ. 公演管理',
    description:
      'FREQ. の公演担当用管理画面のログイン。見本のため入力は照合されず、どこにも送られません。',
    alternates: { canonical: '/admin' },
    robots: { index: false, follow: false },
  };
}

export default async function FreqAdminLoginPage() {

  return (
    <>
      <div className="sample-body sample-freq site-on-dark min-h-screen bg-[var(--cream)] text-[var(--ink)]">
        <main
          id="main"
          className="flex min-h-screen flex-col items-center justify-center px-6 py-16"
        >
          <Wordmark size="lg" />
          <span className="sr-only">FREQ. 公演管理</span>

          <div className="mt-8 w-full max-w-[420px]">
            <LoginForm />
          </div>

          <p className="mt-6 max-w-[420px] text-center text-[12px] leading-[1.8] text-[var(--sub)]">
            アカウントの発行・再設定は管理者へご連絡ください。
          </p>
          <p className="mt-2 text-center text-[11px] text-[var(--sub)]">
            デザインサンプル / 実際の認証は行われません。
          </p>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
