var concat = roka.core.oop.concat;
var clone = roka.core.oop.clone;
var extend = roka.core.oop.extend;
var superproto = roka.core.oop.superproto;
var is_instance = roka.core.oop.is_instance;
var is_subclass = roka.core.oop.is_subclass;

var test_clone = function(){
  var foo = { 'x':true };
  var cln = clone(foo);
  cln.y = true;
  assert(foo.x&&!foo.y&&cln.x&&cln.y);
}

var test_extend = function(){
  
  var Plant = function(){}
  Plant.prototype.height = 1;
  Plant.prototype.family = 'Tree';
  Plant.prototype.grow = function(h){
    this.height += h;
  }

  var Flower = function(){}
  extend( Flower, Plant );
  assert( Flower.prototype.family=='Tree' );
  Flower.prototype.family = 'Flower';
  Flower.prototype.colors = 'green,brown';
  Flower.prototype.height = 7;

  var f = new Flower();
  f.grow(5);
  assert( f.height==12 );
  assert( f.family=='Flower' );
  assert( f.colors == 'green,brown');
}

var test_extend_mro = function(){

  return false;
  var A = function(){}
  var B = function(){}
  var C = function(){}
  var D = function(){}
  var E = function(){}

  extend(B,A);
  extend(C,B);
  extend(E,D,C,B);

  assert( C._mro_[0] == C );
  assert( C._mro_[1] == B );
  assert( C._mro_[2] == A );
  assert( E._mro_[0] == E );
  assert( E._mro_[1] == D );
  assert( E._mro_[2] == C );
  assert( E._mro_[3] == B );
  assert( E._mro_[4] == A );
}

var test_isinstance = function(){
  
  var C1 = function(){}

  var C2 = function(){}
  C2.prototype = new C1();

  var C3 = function(){}
  C3.prototype = new C2();

  var c1 = new C1();
  var c2 = new C2();
  var c3 = new C3();

  assert( is_instance( c1, C1 ) );
  assert( is_instance( c2, C1 ) );
  assert( is_instance( c2, C2 ) );
  assert( is_instance( c3, C1 ) );
  assert( is_instance( c3, C2 ) );
  assert( is_instance( c3, C3 ) );

}

var test_issubclass = function(){
  var C1 = function(){}
  var C2 = function(){}
  C2.prototype = new C1();
  var C3 = function(){}
  C3.prototype = new C2();

  assert( is_subclass( C2, C1 ) );
  assert( is_subclass( C3, C2 ) );
  assert( is_subclass( C3, C1 ) );
  assert( !is_subclass( C1, C2 ) );
  assert( !is_subclass( C1, C3 ) );
  assert( !is_subclass( C2, C3 ) );

}

var test_concat = function(){

  var bra1 = {
    'a':1,
    'b':function(){
      return 'B';
    },
    get c(){
      return 'C'
    },
    'd':null
  };

  var bra2 = { '_x':17 };
  bra2.__defineGetter__('x',function(){ return this._x*100 });
  bra2.__defineSetter__('x',function(){ this._x = arguments[0]  });

  var bra3 = {
    get roka(){
      return null;
    }
  };

  var obj = concat(bra1,bra2,bra3);

  compare(obj.a,1);
  compare(obj.b(),'B');
  compare(obj.c,'C');
  compare(obj.d,null);

  compare(obj._x,17);
  compare(obj.x,1700);
  
  obj.x = 19;
  compare(obj._x,19);
  compare(obj.x,1900);

  compare(obj.roka,null);

  try {
    obj.roka = 11;
    assert(false);
  } catch(e){}

}

var test_super = function(){

  var A = function(){
    this.name = 'A';
    this.value = 1;
  }
  A.prototype.inc = function(){
    this.value+=10;
  }
  A.prototype.do_sth = function(){
    return this.name+'::do_sth';
  }

  var B = function(){
    superproto(B,this).constructor.call(this);
    this.name = 'B';
    this.value += 1;
  }
  extend(B,A);
  B.prototype.do_sth = function(){
    return '_'+superproto(B,this).do_sth.call(this);
  }

  var C = function(){
    superproto(C,this).constructor.call(this);
    this.name = 'C';
  }
  extend(C,B);
  C.prototype.do_sth = function(){
    return '_'+superproto(C,this).do_sth.call(this);
  }

  var b = new B();
  assert( superproto(B,b)==A.prototype );
  assert( b.do_sth()=='_B::do_sth' );

  var c = new C();
  assert( superproto(C,c)==B.prototype );
  assert( c.do_sth()=='__C::do_sth' );
} 

