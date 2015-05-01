## Stream API on nodejs

---

みんな大好きなAtreamAPIですが  
なぜか実装の解説が少ない...

---

しかたない、作るか。

---

Streamは5種類

* Readable
* Writable
* Duplex
* Transform
* PassThrough

---

実際使うのはだいたい3種類

* Readable -> ストリーム生成
* Writable -> ストリーム終端
* Transform -> ストリームを加工

---

### readable

~~~javascript
function ReadableStream){
	Stream.Readable.call(this);  
}
util.inherits(ReadableStream, Stream.Readable);

// 実装すべきメソッド
ReadableStream.prototype._read = function(){
	this.push(null);
}
~~~

---

### readable flow

1. event: pipe / resume
2. loop: 
  21. event: read()
  3. call: _read()
  4. call: stream.push(chunk)
3. call: stream.push(null)
4. emit: end 

---

### writable

~~~javascript
function WritableStream){
	Stream.Writable.call(this);
}
util.inherits(WritableStream, Stream.Writable);

// 実装すべきメソッド
WritableStream.prototype._write = function(chunk, encode, cb){
	cb();
}
~~~

---

|util|method|
|:-:|:-:|
|usercall|write()|
|callback|_write()|
|loop function|cb()|

---

### writable flow


1. loop: 
  2. event: write()
  3. call: _write()
  4. call: callback()
3. call: end()

---

### transform

~~~javascript
function Transform){
	Stream.Transform.call(this);
}
util.inherits(Transform, Stream.Transform);

Transform.prototype._transform = function(chunk, encode, cb){
	this.push(chunk)
	cb();
}

Transform.prototype._flush = function(cb){
	this.push(bull)
	cb();
}
~~~

---

|util|method|
|:-:|:-:|
|usercall|transform()|
|callback|_transform()|
|prefinish|_flush()|
|write chunk|stream.push()|
|loop function|callback()|

---

### transform flow

1. event: pipe / resume
2. event: write
3. call: _transform
4. event: prefinish [chunk === null]
5. call: _flush
6. event: finish
6. emit: end

---

### で?

---

Streamを使う事でどう変わるのか?

---

* 先ずはTransformを拡張
  初期化,_transform,finish時に実行する各関数を与られるようにする

~~~javascript
function AssertStream(initStatus, assertFunction, callback){
  var self = this;
  Object.keys(initStatus).forEach(function(d){
    self[d] = initStatus[d];
  })
  option = {};
  option.objectMode = true;
  Stream.Transform.call(this, option);
  this._asserts = assertFunction;

  this.on('finish', function(){
    callback(self);
  })
}
util.inherits(AssertStream, Stream.Transform);

AssertStream.prototype._transform = function (chunk, state, cb) {
  if(!option.objectMode) chunk = chunk.toString();
  this._asserts(this, chunk, state, cb)
}
~~~

---

* 比較コード
  csvファイルを読んで特定のレコードを取り出す
  データは郵便局の住所データ(16MB/csv)

---

* streamを使わない場合

~~~
// メモリに乗っけて
var obj = fs.readFileSync('./data/KEN_ALL.CSV');
// 変換して
obj = iconv.decode(obj, "shift_jis")
// 数数えて
var counter = obj.split('\r\n').length;
// 対象だけを切り出して
var listup = obj.split('\r\n').filter(function (d){
  return /広島県/.test(d);
});
// 結果をコールバックする
finish(listup);
~~~

---

とくになんてことは無いが
`obj`に全部乗っているのでメモリを食う

---

* streamの場合

~~~
// ストリーム生成
var rs = fs.createReadStream('./data/KEN_ALL.CSV');
// ストリーム終端
var as = new Sample.AssertStream({listup:[]},{},function (stream, chunk, enc ,cb){
  // 先と同じ処理を _transform に適用
  chunk = iconv.decode(chunk, "shift_jis");
  chunk = stream._cache + chunk;
  chunk = chunk.split(/\r\n/);
  this._cache = chunk.pop();
  chunk.forEach(function (d) {
    if(/広島県/.test(d)) stream.listup.push(d);
  })
  counter++;
  cb();
},function(stream){
  // 上からend()が呼ばれたら結果をコールバック
  finish(stream.listup);
}}

rs.pipe(as);
~~~

---

* さっきより長い
* chunkの数だけ処理をするので、呼び出しコストを考える必要がある
* 得がないように見えるけど...
  ->実際にメモリの使用量と時間を比べてみました

---



---


---

制御系

* option: highWaterMark
* call: pause()
* event: drain

---


* 注意点1

~~~javascript
// [node/lib/_stream_readable.js]

Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (util.isString(chunk) && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }
  return readableAddChunk(this, state, chunk, encoding, false);
};
~~~


---

* 今回気が付いたこと

---

stringは勝手にbufferにされるので  
shift-jisなどの場合はObjectModeで


---

iconv-liteが重い  
2回エンコードされてたのを除外 4000ms > 600ms

---

streamは怖くない

---

+ これから  
  ストリームから情報を切り出したり
  データの流れを視覚化したい

---



[公式APIDocs](https://nodejs.org/api/stream.html)