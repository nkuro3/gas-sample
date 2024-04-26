# GAS PROJECT

[Google Cloud](https://console.cloud.google.com/home/dashboard?hl=ja&project=gas-project-421509)

## 手順（更新のみ）
1. `npm i @google/clasp -g`
2. `clasp login`
3. copy ScriptID
  https://script.google.com/home/projects/{ScriptID}/edit
4. `clasp clone {ScriptID}`
5. `clasp push`

## 手順（ローカル実行）
1. 手順（更新のみ）
2. `clasp setting projectId {ProjectID}`
3. 「OAuth同意画面」の作成（必須項目のみでよい）
4. `clasp open` (Google Cloudのトップページを開く)
6. Google Cloud > Setting > GCPプロジェクト番号の変更
7. `clasp open --creds` （Google Cloudの認証ページを開く）
8. OAuth 2 client IDを作る（デスクトップアプリ）
9. jsonをダウンロードして、ローカルのGASプロジェクトのルートに配置。ファイル名をcreds.jsonにリネーム
10. `clasp login --creds creds.json`（OAuthでのログイン）
11. （OAuth同意画面を外部で作成した場合は、テストユーザーに登録が必要）
12. appsscript.jsonに追加
    ```json
    "executionApi": {
      "access": "ANYONE"
    }
    ```
13. App Script API を有効化
14. App Script > Setting > Google App Script API オンに変更
15. `clasp push`
16. `clasp run`

## 参考
[Google App Script(GAS)をローカルで快適に編集して同期しよう！](https://qiita.com/fruitriin/items/62120f102d50dce5c51a)
[Run](https://github.com/google/clasp/blob/master/docs/run.md#run)