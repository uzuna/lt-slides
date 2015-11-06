'use strict';

describe("ES6", ()=>{
	it("test",function(done){
		function err(){
			throw new Error("throw");
		}
		try{
			setTimeout(err, 100)
		}catch(e){
			console.log("catch")
			done();
		}
	})

	it("test",function(done){
		try{
			function err(){
				throw new Error("throw");
			}
			setTimeout(err, 100)
		}catch(e){
			console.log("catch")
			done();
		}
	})

	it("test",function(done){
		
		function err(){
			try{
				throw new Error("throw");
			}catch(e){
				console.log("catch")
				done();
			}
		}
		setTimeout(err, 100)
		
	})

	it("test", function(){

		function delay(ms){
		  return setTimeout(()=>{return (ms+1);}, 200);
		}

		function* gene(){
			yield delay(10)
			yield delay(20)
			yield delay(30)
		}
		var g = gene();
		while(true){
			let rs = g.next();
			if(rs.done) break;

			console.log(rs.value)
		}
	})

	it("test", function(done){

		//
		// async function
		//
		function delay(ms){
		  return function(){
		  	console.log("then", ms)
		  	return new Promise((res,rej)=>{
		  		console.log("time")
			  	setTimeout(()=>{return res(ms+1);}, 500);
			  });
		  }
		}

		//
		// loop1 then Chein
		//
		function* loopChein(ms){
			ms = yield delay(ms)
		  console.log("ms",ms)
			ms = yield delay(ms)
			console.log("ms",ms)
		}

		var g = loopChein(10);
		loopblock(g)
		function loopblock(gen){
			var ctx = Promise.resolve();

			loop(0)
			function loop(g){
				console.log("loop", g);
				var c= gen.next(g);
				if(c.done) return done();
				ctx = ctx.then(c.value).then(loop)
			}
			function reject(){
				console.log("rej")
			}
		}
		


		function toPromise(fn = 'sdunf'){
			return 
		}


	})
})