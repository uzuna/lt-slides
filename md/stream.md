## Stream API on nodejs



---

### readable

~~~javascript
function ReadableStream){
	Stream.Readable.call(this);
}
util.inherits(ReadableStream, Stream.Readable);

ReadableStream.prototype._read = function(){
	return this.push(null);
}
~~~

---

|util|method|
|:-:|:-:|
|loop function|read()|
|callback|_read()|
|write chunk|stream.push()|

---

### writable

~~~javascript
function WritableStream){
	Stream.Writable.call(this);
}
util.inherits(WritableStream, Stream.Writable);

WritableStream.prototype._write = function(chunk, encode, cb){
	cb();
}
~~~

---

|util|method|
|:-:|:-:|
|usercall|write()|
|callback|_write()|
|loop function|callback()|


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

### basic flow

1. event: pipe / resume
2. event: write
3. call: _transform
4. event: prefinish [chunk === null]
5. call: _flush
6. event: finish
6. emit: end