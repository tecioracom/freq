import type { Metadata } from 'next';
import { SITE_SHELL } from '@/components/site/styles';
import { FreqShell, PageHead } from '../_ui';
import { ApplyForm } from './ApplyForm';

/* ============================================================================
 * チケットの申し込み `/apply`。
 *
 * 書き出しでは「申し込みフォーム」と「購入完了」の2画面（それぞれ PC と
 * スマートフォンの2枚）だったが、実装では **1ルートの2つの状態**にしてある。
 * 購入は成立しないので、完了の画面を別ルートで持つと、直リンクで
 * 「購入が完了しました」だけが開けてしまう。終点は同じルートの
 * 「入力内容の確認」。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'チケットのお申し込み — FREQ. NIGHT 01',
    description:
      'FREQ. NIGHT 01 のチケット申し込み。枚数を変えると前売とシステム手数料の内訳が同時に変わります。入力内容の確認までで、送信も保存もされません。',
    alternates: { canonical: '/apply' },
    robots: { index: false, follow: false },
  };
}

export default async function ApplyPage() {

  return (
    <FreqShell header="back">
      <main id="main">
        <div className={`${SITE_SHELL} pt-12 md:pt-16`}>
          <PageHead
            ja="チケットのお申し込み"
            lead="公演・枚数と連絡先をご確認ください。枚数を変えると、右の内訳と申し込みボタンの金額がその場で変わります。"
          />
        </div>
        <ApplyForm />
      </main>
    </FreqShell>
  );
}
