## atom/Electron
2015/05/02 LTDD#14

---

### 自己紹介

|||
|:---|:---|
|名前|uzuna|
|仕事|製造系:製品解析|
|趣味|読書|
|twitter|@Uzundk|
|読書メーター|同上|

---

4月のお勧め図書

<img class="img" src="image/motwd.jpeg" width="120px">

* 申し訳ない、御社を潰したのは私です。
* 発刊: 2014/03/26

--

__だいたいの内容__

コンサルタント会社で働いている著者が  
コンサルティング手法の__導入によって失敗した__事例を語る本

__管理者の無理解で起こる事故例__がいっぱい載っている

--

__さくっと要約__

* "手法"だけを取り入れても上手くいかない
* 解決する手段は現場がすでに持っている事が多い
* ただ、解決策を実現するための人間関係が不足している

--

>「人間こそ問題の原因であり、  
解決の手立てなのだ。」

--

手法の導入が思ったよりも効果が無いとか  
そもそも導入が上手くいかないという場合の参考に

---

というわけで本題

---

__Atom-shell__あらため
## <span style="color:#44CCAA">__Electron__</span>

---

### What is this?

--

      これを( ＾ω＾)   
⊃) <img class="img" src="image/iojs.png" width="70px">　<img class="img" src="image/customLogo.png" width="70px"> (⊂

--

( ＾ω＾)   
≡⊃⊂≡ 

--

こうじゃ

( ＾ω＾)  
 ⊃ <img class="img" src="image/electron.svg" width="350px"> ⊂ 　  

--

||||
|:----|:----|:----|
|<img class="img" src="image/iojs.png" width="70px">|io.js|ほぼnodejs|
|<img class="img" src="image/customLogo.png" width="70px">|Chromium|オープンソースのウェブブラウザ|

--

要するにjavascript + HTML + CSSでつくれる

__Desktop Applicationのプラットフォーム__

--

余談  

0. 類似のものにnode-webkit(略記nw)がある
1. Github製のAtomというエディタはこれをベースにしている
2. 最近Atom-shellからElectronに改称した


---

__事の発端__

--

<span style="color:#4499cc">Dev< エクセル台帳に手作業とかあり得ない...  
Dev< なのでWebApp作ったよ</span>

<span style="color:#cc4477">動かないんだけど >user</span>

<span style="color:#4499cc">Dev< え</span>

--

### Log
>Mozilla/4.0 (compatible; MSIE 8.0; 
Windows NT 6.1; Trident/4.0; ...)

Oh...

--

WebAppは便利だがブラウザの問題がある  
便利なライブラリ無しでのDOM開発はしたくない

~~(そもそもjavascriptは楽しいがDOMを扱うのは楽しくない)~~

ならば__Client側も作るしかない__


---

### 何ができてどこが嬉しいのか

--

__Browser Window__

ローカルの機能を持つ__Main Process__と  
ブラウザ側の制御をする__Renderer Process__に分かれている

サーバーとブラウザと同じ感覚で機能を分けて作れば良い
機能と範囲が分かれていて抽象化と制御がしやすい

--

__Tray / Notification__  

タスクトレイ上での制御とOS毎の通知機能が使える  
データをモニターする事が多いので通知系があるのはとても嬉しい

--

__File / ChildProcess__

ユーザーのローカルリソースが扱える  
ローカルのデータ加工や別のappを起動するコマンドが使える

--

__Canvas / WebGL__

ここはまだ期待の段階  
データの可視化に興味があるのでその内実装したいと思っている

--


__アップデートとリリースが簡単__

App自体はインストール無しでも動作する  
リソースの配置だけでリリースできる  

---

__作り方とリリース方法__

--

1.[electron/releases](https://github.com/atom/electron/releases)の実行ファイルをダウンロードします  

<img class="img" src="image/Electron_Release.png" width="720px">

--

2.package.jsonを書きます

~~~JSON
// package.json
{
  "name"    : "your-app",
  "version" : "0.1.0",
  "main"    : "main.js" // startup script
}
~~~

--

3.main processを書きます

~~~javascript
// main.js
var app = require('app');
var BrowserWindow = require('browser-window');
// bwインスタンス。 グローバルにないとGCで消えるため
var mainWindow = null;

app.on('ready', function() {
  // windowを作成して index.htmlを開く
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // fileプロトコルを指定しないとOSによっては開かない
  mainWindow.loadUrl('file://' + __dirname + './index.html');

  // close後にインスタンスを入れていた変数をnullにする
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
~~~

--

4.index.htmlを書きます


~~~html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using Electron!
  </body>
</html>
~~~

--

5. 実行ファイルのあるフォルダに配置すれば使えます

On OS X

```
electron/Electron.app/Contents/Resources/app/
├── package.json
├── main.js
└── index.html
```

On Windows and Linux

```
electron/resources/app
├── package.json
├── main.js
└── index.html
```

--

* デバッグ時はpathを通して呼び出すほうが楽

~~~
cd /myapp/

Electron .
~~~

* [asar](https://github.com/atom/asar)というパッケージにする方法もあります

---

作りやすくするための周辺環境

--

|||
|:---|:---|
|API|メインはhttp。socket.ioを仕込み中|
|html生成|jade + lessで生成|
|GUI control|いまはVuejsをお試し中|
|処理系|gulpにならってvinylでストリーム化を試験中|

--

このあたり何が楽しいかというと

--

<span style="color:#CC6747">__必要なものを自分ですぐに作れる__</span>

---

まだ知らない部分も多いので今後もキャッチアップしていく予定
Auto-updateとか...

是非情報交換しましょう

---

to be Continued...?

---