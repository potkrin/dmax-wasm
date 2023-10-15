# TODO
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
