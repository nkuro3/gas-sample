# GAS PROJECT

[Google Cloud](https://console.cloud.google.com/home/dashboard?hl=ja&project=gas-project-421509)

## ローカル開発

### 手順（更新のみ）

1. `npm i @google/clasp -g`
2. `clasp login`
3. copy ScriptID
   script.google.com/home/projects/{ScriptID}/edit
4. `clasp clone {ScriptID}`
5. `clasp push`

### 手順（ローカル実行）

1. 手順（更新のみ）
2. `clasp setting projectId {ProjectID}`
3. 「OAuth同意画面」の作成（必須項目のみでよい）
4. `clasp open` (Google Cloudのトップページを開く)
5. Google Cloud > Setting > GCPプロジェクト番号の変更
6. `clasp open --creds` （Google Cloudの認証ページを開く）
7. OAuth 2 client IDを作る（デスクトップアプリ）
8. jsonをダウンロードして、ローカルのGASプロジェクトのルートに配置。ファイル名をcreds.jsonにリネーム
9. `clasp login --creds creds.json`（OAuthでのログイン）
10. （OAuth同意画面を外部で作成した場合は、テストユーザーに登録が必要）
11. appsscript.jsonに追加

    ```json
    "executionApi": {
     "access": "ANYONE"
    }
    ```

12. App Script API を有効化
13. App Script > Setting > Google App Script API オンに変更
14. `clasp push`
15. `clasp run`

### 参考

[Google App Script(GAS)をローカルで快適に編集して同期しよう！](https://qiita.com/fruitriin/items/62120f102d50dce5c51a)
[Run](https://github.com/google/clasp/blob/master/docs/run.md#run)

## ライブラリインポート

### 手順

1. ルートディレクトリ（GASにpushするディレクトリ）をビルドの成果物に変更

    ```json
    // .clasp.json
    {
      "rootDir": "./dist"
    }
    ```

2. `mkdir dist`
3. `mv appsscript.json dist`
4. 環境に必要なライブラリをインポート

    ```bash
    pnpm add -D typescript @types/google-apps-script
    pnpm add -D webpack webpack-cli
    pnpm add -D @babel/core @babel/preset-typescript babel-loader
    pnpm add -D gas-webpack-plugin
    pnpm add -D eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-loader
    ```

5. tsconfig.json

    ```json
    {
      "compilerOptions": {
        "target": "es5",
        "lib": ["es5", "es6", "es7"],
        "outDir": "./dist",
        "rootDir": "./src",
        "module": "esnext",
        "downlevelIteration": true,
        "strict": true,
        "noUnusedLocals": true,
        "esModuleInterop": true,
        "moduleResolution": "node"
      },
      "include": ["./src/**/*"]
    }
    ```

6. .eslintrcds

    ```json
    {
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint"
      ],
      "plugins": ["@typescript-eslint"],
      "parser": "@typescript-eslint/parser",
      "env": {
        "node": true,
        "es6": true
      },
      "parserOptions": {
        "sourceType": "module"
      },
      "rules": {}
    }
    ```

7. src/\* にテストファイルを用意
8. webpack.config.js

    ```js
    const path = require('path');
    const GasPlugin = require('gas-webpack-plugin');
    module.exports = {
      mode: 'development',
      devtool: false,
      context: __dirname,
      entry: './src/index.ts',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js',
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.[tj]s$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
          },
          {
            enforce: 'pre',
            test: /\.[tj]s$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
          },
        ],
      },
      plugins: [new GasPlugin()],
    };
    ```

9. .babelrc

    ```json
    {
      "presets": ["@babel/preset-typescript"]
    }
    ```

10. scriptを追加

    ```json
    {
      "scripts": {
        "build": "webpack",
        "deploy": "pnpm build && clasp push"
      }
    }
    ```

11. .claspignore

    ```md
    # ignore all files…
    **/**

    # except the extensions…
    !dist/**/*.js
    !appsscript.json

    # ignore even valid files if in…
    .git/**
    node_modules/**
    ```

### Errors

#### Cannot read properties of undefined (reading 'getFormatter')

1. `pnpm run deploy`
2. error

    ```bash
    TypeError: Cannot read properties of undefined (reading 'getFormatter')
    ```

3. `pnpm remove eslint-loader`
4. `pnpm add -D eslint-webpack-plugin`
5. webpack.config.js

    ```js
    const GasPlugin = require('gas-webpack-plugin');
    const ESLintPlugin = require('eslint-webpack-plugin');

    module.exports = {
      // ...
      module: {
        rules: [
          // ...
          // ↓ remove
          // {
          //   enforce: 'pre',
          //   test: /\.[tj]s$/,
          //   exclude: /node_modules/,
          //   loader: 'eslint-loader',
          // },
        ],
      },
      plugins: [new GasPlugin(), new ESLintPlugin({
        context: 'src',
        exclude: 'node_modules',
      })],
      // ...
    };
    ```

6. eslint-webpack-plugin@latest(4.1.0)とeslint(9.1.1)の依存関係が合わないためエラーになっていた。

   ```bash
    WARN  Issues with peer dependencies found
    .
    └─┬ eslint-webpack-plugin 4.1.0
      └── ✕ unmet peer eslint@^8.0.0: found 9.1.1
   ```

7. `pnpm add -D slint@8`
8. `pnpm run deploy`

   ```bash
   webpack 5.91.0 compiled successfully in 779 ms
   └─ dist/appsscript.json
   ```

#### clasp run -> No function
1. wrong setting in .claspignore

   ```txt
   // NG
   !dist/index.js
   // OK
   !index.js
   ```

2. although in official github, [ES Modules](https://github.com/google/clasp/blob/master/docs/esmodules.md)

   ```txt
   # and our transpiled code
   !build/*.js
   ```

### 参考

[GAS でも npm のライブラリを使いたい](https://www.ykicchan.dev/posts/2020-07-12)
[いちばんやさしい webpack 入門](https://zenn.dev/sprout2000/articles/9d026d3d9e0e8f)
[webpack、babel、esbuildをちゃんと理解したい。](https://zenn.dev/crsc1206/articles/0b0960fa306d71)
[ESLintのバージョンをv6.8.0からv8.4.1に上げる](https://techblog.lclco.com/entry/2021/12/17/100022)
[eslint-webpack-plugin](https://github.com/webpack-contrib/eslint-webpack-plugin)
