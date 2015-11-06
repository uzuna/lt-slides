## ES6でCallbackを隠ぺいする
2015/11/07 LTDD#20

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

10月のお勧め図書

<img class="img" src="image/201510_book.jpg" width="120px">

* 最古の料理
* 発刊 2003年12月5日
* 著者 ジャン・ボテロ

--

食事ってとっても身近です
おそらく日本なら一日三食+お菓子の食事をしているぐらい

--

でもそれはとても高度なこと。

周囲に存在する何が食べれるもので  
どのように調理すればおいしいのかという知識  
また加工する技術体系が必要  

--

現代ならかなり整った状態で材料が手に入るけど  
昔はどうだったのだろうか。

--

__もっとも古いレシピ:__

* 紀元前80-後40年ごろのローマ時代のレシピ
* アピキウスのレシピ帖
* 4,5世紀ぐらいに再編纂。14世紀ごろに印刷で広まる
* 総集編で一人の著者ではないとの見解

--

__日本語訳は?__

日本語訳だけではなく作ってしまった人までいたようです（いいね!）  
[古代ローマ「アピキウスの料理書」の料理を作ってみた企画](http://www.geocities.co.jp/Technopolis/2736/folklore/api/api_tukutta.htm)(風見猫さん)

--

という状態だったのですが。

さらに古いもの、ローマからさらに1600年さかのぼる
メソポタミア時代のものが見つかりました。

アッシリア学の第一人者で料理愛好家の著者が
その詳細を追うのが本書の中身。

--

イエール大学のバビロニア文書集のタブレットの中から  
3枚、350行からなる楔形文字タブレットが見つかり  
25のレシピと加工、下ごしらえ手順の解説が得られた

--

ここでレシピの例

--

__牡羊の煮込み__

>これにはほかの肉は必要ない。お前は水を用意する。そこに脂肪、[(欠損)]、  
十分な量のねなし葛、塩を適量、玉葱とサミドゥ、[(欠損)]

--

(続き)  
>コリアンダー、ポロネギとにんにくを加える。お前は胴張り大鍋をかまにかける。  
火から下ろした後、お前はキシンム(kisimmu)を砕いて入れる。これで供する準備は整った。

--

なんだか詩みたいですね。  

出汁のレシピ、36種の香辛料や香料  
この時代から美食は追及されていた。

--

>生きる糧が生をもたらす

おいしく食べよう

---

というわけで本題

---

__ES6でCallbackを隠ぺいする__

---

## 前提.1 ES6とは

* ES6->[ECMA International](http://www.ecma-international.org/)によるスクリプトの標準化規格
* 現行はES5

--
<section data-background="img.jpg">
## 前提.2 Callback地獄

いたずらに処理を追加するものがこの地獄に落ちる。
一つ処理を増やすごとにネストを下らねばならない

```
express.router("/hoge", function (res, req){
	validation(req.body, function (err, result){
		fs.readFile("path", function (err, doc){
			fs.readFile("path2", function (err, doc2){
				parse([result, doc, doc2], function (err, stream){
					res.pipe(stream); // ( >д<)ﾄﾃﾓﾌｶｲ
				})
			})
		})	
	})
})
```

</section>

--

ところでES6ってECMA2015という呼び名になっているのですね  
年度ごとに標準化部分を確定させていくようです。

--

ES5との比較は以下がとても参考になります
[ECMAScript比較](http://es6-features.org/#Constants)

---

## おさらい

javascriptには非同期関数というものが存在し。
下のコードの場合の出力は`A->C->B`という順番になります

```
function (){
	console.log('A')
	asyncFunction(function(){
		console.log('B');	// あとに実行される
	});
	console.log('C');
}
```

--

処理をロックしないためであるが、
どうしても非同期は必要な場面が出てくる。 =>地獄が顔を出す

---

##　対策その1

`function`にまとめてを並べる

```javascript
function A(param){ B(param) }
function B(param){ C(param) }
function C(param){ end(); }

A();	// Chein start
```

--

* もとの関数見ないと行き先がわからない
* ↑のせいで分岐がスパゲッティ
* throwが取れない

--

## 対策その2

`stream`にまとめてを並べる

```javascript

var dataStream = through("data")

dataStream
	.pipe(A)
	.pipe(B)
	.pipe(C)
	.on('finish', done)

```

--

throw...

---

## コールバックの難しいところ

* throwをキャッチしずらい
* フローが書きおろしにくい

--

下の例はキャッチできない

```javascript
try{
	function err(){
		throw new Error("throw");
	}
	setTimeout(err, 100)
}catch(e){
	console.log("catch", e)
}
```

--

これならできるが...

```javascript
function err(){
	try{
		throw new Error("throw");
	}catch(e){
		console.log("catch")
		done();
	}
}
setTimeout(err, 100)
```

--

暗黙の了解`cb(err, data)`

```javascript
function err(cb){
	cb(err);
}
setTimeout(function(err, data){
	if(err)
		// error処理
}, 100)
```

---

## Promise

暗黙の了解`(err, data)`をデザインとして規定したものです

```
promise
	.then(function(result){
		// data
		return true; // これが次のthenに渡される
	})
	.catch(function(err){
		// err
	})
```

--

* 成功時は`then`を実行し
* 失敗時は`catch`を実行する
* `then`でチェーンできる

この辺りは[JavaScript Promiseの本](http://azu.github.io/promises-book/#what-is-promise)
が詳しい(auther:Azuさん)

--

非同期の場合は`new Promise((resolve, reject))`を使います
成功時には`resolve`を失敗時には`reject`を呼びます

```javascript
promise
	.then(function(result){
		return new Promise(function (res, rej){
			Async(function(err, data){
				if(err) return rej(err)
				res(data);
			})
		});
	})
	.catch(function(err){
		// err
	})
```

---

では書き直してみましょう
これで完璧ですね(1)

```javascript
promise.resolve(req.data)
	.then(function(val){
		return new Promise(function(res, rej){
			A(val,function (err, data){
				if(err)
					return rej(err)
				res(data)
			})
		});
	})
	...
```

--

...(2)

```javascript
	...
	.then(function(val){
		return new Promise(function(res, rej){
			B("path1",function (err, data1){
				if(err)
					return rej(err)
				res([val, data1])
			})
		});
	})
	...
```

--

...ナガイ!!(3)

```javascript
	...
	.then(function(values){
		return new Promise(function(res, rej){
			C("path2",function (err, data2){
				if(err)
					return rej(err)
				values.push(data2)
				res([values])
			})
		});
	})
	.then(function(stream){
		return res.pipe(stream)
	})
```

--

ネストがなくなりPromise地獄が...　　
ですが同期も非同期も`then`でつなぐことができるので
`Array.reduce`でまとめましょう。

--

すっきりしてきました!
しかしこれでは前の関数の値をそのまま入れるしかできません...そこで

```
[A,B,C].reduce(function(a, b){
	return a.then(b);
},Promise.resolve()).then(function(){
	// done()!
})
```

---

## Generator(co)

--

`function*(){}`
`yield`で関数を途中で止めることができるようになります


```javascript
function* three(){
  yield 1;
  return "end"
}
var t = three();	// 生成
console.log(t.next().value); // "1"
console.log(t.next().value); // "end"
console.log(t.next().value); // "なにもなし"
```

--

```javascript
function* getquery(){
  var result = yield async("hoge");
  result = result.join(",")
  var rows = yield myquery(result);
  return row;
}

```



---

直近のnodejs

* version 5.0.0(先月はじめは4.1だったとゆーのに)

これに伴いV8が4.6.85になりました

