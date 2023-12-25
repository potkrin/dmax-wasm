# TODO
- バグ
  - スマホ向けUIが壊れている等 UI微調整
  - 読みやすい段落幅 https://www.gizmodo.jp/2023/12/google-gemini.html
  - 並列ソルバ起動 の欄 で1スレッドだけ表示されない
  - スクロールバー表示と見た目の変更
  * DONE: スマホのサイドパネル用リンクとボタン
  * DONE: ドロップダウン選択時に Fabボタン(最適化) が動いてしまう問題
  * DONE: sharedArrayBuffer is not defined をcatchして表示する仕組み
  * DONE: 水やられが計算に反映されない
  * DONE: QAテーブルに色を反映させる
  * DONE: 履歴へデータを移すタイミングが遅い (たぶん計算完了時に移行になっている)
  * DONE: カラーテーマをlocalstorageに保存
  * DONE: 計算中にタブを切り替えると処理が中断される
  * DONE: 計算中にタブを切り替えると state が消えて計算結果がわからなくなる
    * DONE: 原因不明なので contextAPI に切り替える方針
  * DONE: 最適化不可能のときのアイコンがほしい
  * DONE: 中止を押したときの表示がおかしい
  * DONE: 装備が組めなかったときに "並列ソルバ起動" がクルクル回り続ける
  * DONE: 護石で同じスキルが追加できてしまう問題 再現方法: 攻撃→見切り→攻撃削除→見切り
  * DONE: 傀異錬成防具未選択状態で登録を押すとエラー
  * DONE: 空の護石を追加出来てしまう問題
- High 最優先:
  * DONE: ヘッダ/メニュー
  - 使い方
  - ローカルビルド&コピーのスクリプト と 手順ドキュメント整備
  - ステージング環境
  - CI/CD: [デプロイやり方](https://softwarenote.info/p3789/)
- Midle 実装予定:
  - 狂竜症感染率ツールチップ
  - コンテンツの高さが足りないときに body の白色が見えてしまう (再現方法: めいっぱい縮小表示するなどしてウィンドウの高さを埋められないようにする)
  - サーバにユーザデータ保存
  - ひらがなカタカナ検索
  - 結果の欄を読みやすいUIにする
  - 水やられ時の肉質を表示
  - light/darkのカラーテーマを適切に切り替える(theme.pallet.primary.mainをそれぞれのモードに対応する色に)
    - [MUI v5 Theme ～基本の使い方からカスタマイズまで～](https://zenn.dev/longbridge/articles/c100d0311ed1be)
    - [ここで定義したcolorThemeを import して theme と入れ替えればいいのでは？](https://github.com/potkrin/dmax-wasm/blob/d167ca8702337a3e14c26e030bf0c7dafcce83f9/src/App.js#L226)
    - カラー自動決定してくれるサイト↑
    - ContextAPI 孫コンポーネントに渡せるらしい
  - タブ移動で入力中の項目が消える 再現方法: 護石タブでスキル入力→傀異錬成タブに移動→護石タブに戻る
  - 処理やデータの流れを図にしたい(特にdmax中間出力の処理)
  - プリセット
  - マイセット
  - 履歴
- いつか:
  - スキルシミュモード
  - ダメージ計算モード
  - ダメージ計算伸びグラフモード
  - scip-wasm メモリ問題, 他ライブラリ問題
  - 中間結果を表示できないか?
  - 別武器に対応
  - APIアクセス制限

# TODO
- 狂竜症感染率を NumberTextField に変更
- API取得 SnackBar: error時に close -> open にすれば snackbar は2つ→1つにできるかも
- マウスオーバーでスクロールバーが表示される
- 履歴データは indexedDB に保存
- コピペ完了時にメッセージ
- 結果表示の整形 (アイコン,文字装飾)
- 状態によって動的にUIの色を変化させる https://mui.com/material-ui/customization/how-to-customize/#dynamic-overrides
  - 0でない要素だけ色を変化させるなど
  - 選択されたチェックボックスの文字列の色を青色にする
- いろいろなUIのカスタマイズ方法 https://mui.com/material-ui/customization/how-to-customize/
  - バーを太くする、色を変えるなど
- wasm が利用可能か確認
- アニメーションを付けられる https://mui.com/material-ui/transitions/
- グラフのよいカスタム例
  - https://app.members-portalone.net/index.php?code=3eac6194b5591ce019f9a35ec8dcef27546b681a6052ffa8e85486981d68ad0a&state=c251d67c78ab22f18f795ed15335d8058b0d14b4558a7f873a7f710fff32dbb2&m=d56e0e0b7aebba00395d2848953240d802173fad61aac98bbebe168333790128
- 数値入力フィールドに -/+ ボタン追加 https://github.com/mui/material-ui/issues/19154


- 検索ボックス付きスキル入力はコンポーネント化できるかも?
  - 傀異錬成入力, 護石入力, メイン画面
- 参考になるテーマ作成サイト https://bareynol.github.io/mui-theme-creator/
  - +/- ボタン https://mui.com/material-ui/react-badge/#badge-visibility
- Tab切り替えの SwipeableView の最有効化
  - Fab の position がずれる問題のため無効化している
  - https://x.com/snowo0213/status/1713148238122066232?s=20

# これは何?
dmax シミュレータの wasm 版です。ブラウザ上で dmax を動作させることを目的とします。

# 動かし方
```sh
npm start
```

# カスタムヘッダーの利用
wasm をブラウザで利用するためのカスタムHTTPヘッダーを付与するため、craco を導入します。
```
npm install craco
```

craco.config.js に設定を記述します。

# ファイル説明
| ファイル | 説明 |
| ---- | ---- |
| public/dmax-core | wasm版 dmax のバイナリとその js グルーコード, 呼び出しのための webworker などを定義しているファイル群。public以下に配置しないと、**reactのテンプレートhtmlに上書きされてしまう**場合があるため、public以下に配置する。 |

# 動作重くない？
以下の手順によりプロダクションビルドで試してみてください。
```sh
npm run build && serve -s build
```

単一のstate (中身はオブジェクト) で全てのUIコンポーネントの状態管理しているため、ある一つのUIに入力を行うとほぼすべてのUIパーツに再レンダリングが走ります。
ユーザ入力データの管理を簡単にするためにこのような設計にしていますが、プロダクションビルドにしても重い場合は以下のような最適化を考えます。

- state の分割
- メモ化
- React ContextAPI の利用 ...

# Django デプロイ用ビルド手順
Django において cms/static/cms 以下にファイルを配置することを想定

```sh
# ベースディレクトリを変更する環境変数を付与してビルド
PUBLIC_URL=/static/cms npm run build

# ファイルコピー
cp -r build/* ~/work/mhr-speedrun/cms/static/cms/

# index.html のみ templates に配置し、view から参照できるようにする
cp build/index.html ~/work/mhr-speedrun/cms/templates/cms/

# 不要 index.html 削除
rm ~/work/mhr-speedrun/cms/static/cms/index.html
```

ディレクトリの様子
```sh
hoge@:mhr-speedrun$ tree cms/static/cms/
cms/static/cms/
├── asset-manifest.json
├── css # cms アプリケーション用にもとから配置されている css
│   ├── bootstrap.min.css
│   ├── bootstrap.min.css.map
│   ├── bootstrap.overwrite.css
│   ├── quest-card.css
│   └── toggle-switch.css
├── dmax-core
│   ├── brachistochrone.data
│   ├── brachistochrone.html
│   ├── brachistochrone.js
│   ├── brachistochrone.wasm
│   ├── brachistochrone.worker.js
│   └── worker3.js
├── favicon.ico
├── index.html # templates に配置するので消してよし
├── js # cms アプリケーション用にもとから配置されている js
│   ├── bootstrap.bundle.min.js
│   ├── bootstrap.bundle.min.js.map
│   ├── jquery-3.5.1.min.js
│   ├── jquery-3.5.1.min.map
│   └── shortcut.js
├── logo192.png
├── logo512.png
├── manifest.json
├── robots.txt
└── static
    ├── css
    │   ├── main.048ee325.css
    │   └── main.048ee325.css.map
    └── js
        ├── 787.45c42e5d.chunk.js
        ├── 787.45c42e5d.chunk.js.map
        ├── main.8e3880be.js
        ├── main.8e3880be.js.LICENSE.txt
        └── main.8e3880be.js.map
```

# アンマウントでstateが消える問題
原因
1. 自身を含む祖先の条件分岐等でレンダーされなくなるときアンマウントされる (hiddenやcssによる非表示で解決できる)
2. styled コンポーネント https://github.com/potkrin/unmount-caused-by-styled-div/tree/master
3. React.StrictMode を利用すると再マウントされる

# wasm バイナリを再コンパイルした場合, brachistochrone.js に以下を追記する
```js
if (ENVIRONMENT_IS_PTHREAD) {
  wasmMemory = Module["wasmMemory"];
} else {
  if (Module["wasmMemory"]) {
    wasmMemory = Module["wasmMemory"];
  } else {
    wasmMemory = new WebAssembly.Memory({
      "initial": INITIAL_MEMORY / 65536,
      "maximum": INITIAL_MEMORY / 65536,
      "shared": true,
    });

    // ここから追加
    if (typeof SharedArrayBuffer === "undefined") {
      throw new Error("SharedArrayBuffer is not defined");
    }
    // ここまで追加

    if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
      err(
        "requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"
      );
      if (ENVIRONMENT_IS_NODE) {
        err(
          "(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)"
        );
      }
      throw Error("bad memory");
    }
  }
}
```

# Reactのレンダリングタイミング
そもそもReactデフォルトの機能でコンポーネントの再レンダリングが走るタイミングは以下のパターンになります。

1. 親コンポーネントがレンダリングされた場合（子コンポーネントのpropsに変更があったかは関与しない）
2. stateが変更された場合
  - クラスコンポーネントのthis.setState()
  - 関数コンポーネントのuseStateのセッター
  - 関数コンポーネントのuseReducerの dispatch()
3. ContextのValueが変更された場合（ConsumerComponent限定）

※stateが変更された場合は、変更前と変更後でstateをshallow比較して差分があった時のみ再レンダリングされる

※強制レンダリングであるforceUpdateの実行は除く

参考:[React、Reduxのレンダリングとメモ化のタイミングまとめ](https://qiita.com/obake_fe/items/252b48b61df435e68fc2)

# webworker からの postmessage が途中で途切れる問題
起動した webworker を terminate するタイミングが早すぎると未送信の postmessageが受信できなくなります。
デバッグビルドでは動作が遅いため発生しづらいですが、プロダクションビルドでは高速に動作するため問題が発生しやすくなります。

```js
  useEffect(() => {
    // dmax 最適化が完了したら allDmaxOutput に全ての中間結果を渡す (出力整形は DmaxResult と DmaxHistory コンポーネントで行う)
    if (dmaxOutput.includes("SCIP Status")) {
      updateAllDmaxOutput(dmaxOutput);
      // 最適化完了をボタンに反映
      setIsOptimizing(false);
      // 終了処理が早すぎて message を受信できず終了する
      // startWasmWorker.terminate();
    }
  }, [dmaxOutput]);
```

### 対策
1. 正常系・異常系において wasm プログラムが終了する際に出力されるメッセージを固定する
2. 終了処理を行わない

# below is a README.md from Create React App

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
