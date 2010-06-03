var apply = roka.core.functional.apply;
var call = roka.core.functional.call;
var fluentwith = roka.core.functional.fluentwith;
var each = roka.core.functional.each;
var curry = roka.core.functional.curry;
var loop = roka.core.functional.loop;
var partial = roka.core.functional.partial;
var returnfrom  = roka.core.functional.returnfrom;

var sum = function()
{
  var res = 0;
  Array.prototype.forEach.call(arguments,function(el){ return res+=el; });
  return res;
}

curry(call, alert, "hello world")

var test_apply = function()
{
  compare( apply(sum,[1,2,3]), 6);
}

var test_call = function()
{
  compare( call(sum, 1,2,3), 6);
}

var test_fluentwith = function()
{
  var fl = 0;

  fluentwith(314)
    (function(ctx){ fl=1; compare(ctx,314); compare(arguments.length,1); })
    (function(ctx){ compare(fl,1); fl=2; compare(ctx,314); compare(arguments.length,1); })
    (function(ctx){ compare(fl,2); fl=3; compare(ctx,314); compare(arguments.length,1); })
  
  compare(fl,3);

  fl = 0;
  // custom middleware
  fluentwith(314,function(obj,fn,args){ args.splice(0,0,obj,17); fn.apply(null, args);  })
    (function(obj,k,l,m){ fl=1; compare(obj,314); compare(k,17); compare(l,108); compare(m,209);  }, 108, 209)
    (function(obj,k,l,m){ compare(fl,1); fl=2; compare(obj,314); compare(k,17); compare(l,209); compare(m,108);  }, 209, 108)

  // arguments and flags with default middleware
  fluentwith(314)
    (function(p1,c,p3){ compare(p1,"p1"); compare(c,314); compare(p3,"p3"); }, "p1", fluentwith.CONTEXT, "p3");

  // return
  compare(fluentwith(314)
            (returnfrom),314);
}

var test_returnfrom = function()
{
  try
  {
    returnfrom(108);
  }
  catch(exc)
  {
    assert( exc.constructor == roka.core.functional.ReturnFrom );
    compare( exc.object, 108 );
  }
}

var test_partial = function()
{

  var retscope = function()
  {
    return this
  }

  compare( partial(sum,[1,2,3])() , 6 );
  compare( partial(sum,[1,2])(3) , 6 );
  compare( partial(retscope,[],document)(),document );
}

var test_each = function()
{
  var i = 0;
  var foolist = [1,2,3];
  each(foolist)(function(x,y,el)
  {
    compare( el, foolist[i++] );
    compare( x, 108 );
    compare( y, 314 );
  }, 108, 314)(function(x,el,y,ctx,z,ind)
  {
    compare( x, 314 );
    compare( y, 108 );
    compare( z, 17 );
    compare( el, foolist[i++%3] );
    compare( ctx, foolist );
    compare( ind, foolist.indexOf(el) );
  }, 314, each.ITEM, 108, each.CONTEXT, 17, each.INDEX );

  i=0;
  var foodict = { 'a':1, 'b':2 };
  var keys = ['a','b'];
  var values = [1,2];
  each(foodict)(function(key,value){
    compare(key,keys[i]);
    compare(value,values[i++]);
  })(function(x,key,y,value,z,ctx)
  {
    compare( key,keys[i%2] );
    compare( value,values[i++%2] );
    compare( ctx, foodict );
    compare( x, 108 );
    compare( y, 314 );
    compare( z, 17 );
  },108,each.KEY,314,each.VALUE,17,each.CONTEXT);


}

var test_loop = function()
{
  var ct = 0;
  loop(0,20)(function(i){
    compare( i, ct );
    ct++;
  });
  compare( ct, 20 );

  var ct = 0;
  loop(20)(function(){
    ct++;
  });
  compare( ct, 20 );

  var ct = 0;
  loop(10,20)(function(){
    ct++;
  });
  compare( ct, 10 );
  
  var ct = 0;
  loop(10,20)(function(){
    ct++;
  })(function(){ ct++; });
  compare( ct, 20 );

  loop(1)
    (function(x,i){ compare(x,314); compare(i,0) },314)(function(i,x){ compare(x,314); compare(i,0); },loop.INDEX,314);
  

}

var test_curry = function(){
  var sum_ = function(a,b,c)
  {
    return a+b+c;
  }

  compare( curry(sum_,null,1,2,3)(), 6 );
  compare( curry(sum_,null,1)(2,3), 6);
  compare( curry(sum_,null,1,2,3)(4,5,6), 6 );

  compare( curry(sum)(), 0 );
  compare( curry(sum)(1,2,3)(), 6 );
  compare( curry(sum)(1,2)(3,4)(), 10 );
  
}
