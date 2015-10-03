## nodejsで画像生成してみる
2015/10/02 LTDD#19

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

9月のお勧め図書

<img class="img" src="image/201510_book.jpg" width="120px">

* 愛するということ
* 発刊 1956年
* 著者 エーリッヒフロム

--

＿人人人人人人＿  
＞　突然の愛　＜  
￣Y^Y^Y^Y^Y￣  

--

愛とは一つの能動で愛によって  
相手の中に愛を生み出し、  
それによって何か新しいもの、  
今まで無かったものを世界にもたらすと言うこと。

---

というわけで本題

---

__nodejsで画像生成してみる__

---

__nodejs__はもう皆さんご存じですよね?

--

V8エンジンを利用したサーバーサイドのjavascriptインタプリタ

---

いつの間にかiojsと統合されてver4.0になってました  
ES6の一部に対応

--

* Arrow function
* Class
* Generator
* Template strings
* Object literals
など

---

そもそもjavascriptで画像を扱う手段は?

--

そうcanvasがあります!

--

(ただしブラウザ上に限る)

--

つらい

---

そこで

--

__node-canvas__

--

```
var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(200, 200)
  , ctx = canvas.getContext('2d');
```

--

あとはCreatejsを使うなりなんなりで

---

ところでインストールがやや面倒  

--

特にnative-moduleのため、  
windowsだとVSのインストールが必要になる  
->社内には持ち込みしては使えない(困った)

--

native-moduleはどう移植するのか

--

buildで出来る`*.node`があれば動く

--

`*.node`は  
nodejsとOSのバージョンがあっていれば動きました

