import type { Metadata } from 'next';
import { FreqAdmin, AdminHead } from '../../_admin';
import { EventEditor } from './EventEditor';

/* ============================================================================
 * 公演を編集 `/admin/event`。
 *
 * 書き出しでは「公演を編集」と「保存後」の2画面だったが、実装では
 * **1ルートの2つの状態**にしてある。保存はしないので、完了の画面を別ルートで
 * 持つと、直リンクで「保存しました」だけが開けてしまう。
 * 終点は同じルートの「変更内容の確認」。
 * ==========================================================================*/

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '公演を編集 — FREQ. 公演管理',
    description:
      'FREQ. NIGHT 01 の公演情報・料金・販売枚数・公開状態の編集。変更内容の確認までで、保存はされません。',
    alternates: { canonical: '/admin/event' },
    robots: { index: false, follow: false },
  };
}

export default async function EventPage() {

  return (
    <FreqAdmin current="event">
      <AdminHead
        title="公演を編集"
        lead="購入者に公開する公演情報を編集できます。"
        trailing={
          <a
            href="/admin/overview"
            className="inline-flex min-h-[44px] items-center text-[13px] text-[var(--sub)] underline underline-offset-4 hover:text-[var(--ink)]"
          >
            &larr; 一覧に戻る
          </a>
        }
      />
      <EventEditor />
    </FreqAdmin>
  );
}
