# DAIMON SHU

ダイモン シュウの個人サイト（https://daimon-s.party）。記事は microCMS で管理しています。

- React Router v7（Remix v2 の後継）+ Cloudflare Workers
- Tailwind CSS v4
- microCMS（`blogs` エンドポイント）

## ローカル開発

```sh
cp .dev.vars.example .dev.vars   # microCMS のサービスID と APIキーを書く
npm install
npm run dev                      # http://localhost:5173
```

## デプロイ

GitHub の main ブランチに push すると Cloudflare Workers Builds が自動でビルド・デプロイします。
手元から出す場合は `npx wrangler login` のあと `npm run deploy`。

本番の環境変数（Cloudflare ダッシュボード → Workers & Pages → daimon-s → Settings → Variables and Secrets）:

| 名前 | 種類 | 内容 |
| --- | --- | --- |
| MICROCMS_SERVICE_DOMAIN | Secret | microCMS のサービスID（`xxxx.microcms.io` の `xxxx`） |
| MICROCMS_API_KEY | Secret | microCMS の APIキー（GET権限のみで可） |
| GA_TRACKING_ID | Secret（任意） | Google Analytics の測定ID（Textで登録するとデプロイのたびに消えるのでSecretで） |

## カテゴリの追加

microCMS でカテゴリを作ったら、`app/site.ts` の `CATEGORIES` に ID・名前・説明・スラッグを追加します。
