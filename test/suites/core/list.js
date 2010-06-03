var List = roka.core.List;
var bind = roka.core.list.bind;

var test_basic = function()
{

  var l = new List();

  l.append( 1 );
  l.append( 2 );
  l.append( 3 );
  
  assert( l.length == 3 );
  assert( l._getItem_(0) == 1 );
  assert( l._getItem_(2) == 3 );

  l.remove(2);

  assert( l._getItem_(1) == 3 );
}

var test_duplication = function()
{
  var l = new List();
  l.append(101);
  l.append( 102 );
  l.append( 101 );
  l._setItem_(3,101);

  l = new List();
  l.allow_duplication = false;
  l.append(101);

  try 
  {
    l.append(101);
  }
  catch(exc)
  {
    catched = exc.name = 'DuplicationError';
    if(!catched)
      throw exc;
  }

  assert(catched);

}

var test_events = function()
{
  
  var ct = 0;
  var ap = true;
  var l = new List();
  l.events.add_listener('update',function()
  {
    if(ap)
    {
      ap = false;

      l.remove(102);
    }
    assert( l.length==2 );
  });
  l.events.add_listener('del',function(index,el)
  {
    assert(index=1);
    assert(el==102);
    assert( l.length==2  );
    assert( l._getItem_(0) == 101  );
    assert( l._getItem_(1) == 103  );
    test_events.result = true;
  });
  l.append(101);
  l.append(102);
  l.append(103);
}
test_events.async = true;

var test_override = function()
{
  
  var l = new List();
  l[0] = 101;
  
  l.events.add_listener('del',function(index,value)
  {
    assert(index==0);
    assert(value==101);
    test_override.result = true;
  });
 
  l[0] = 102;

}
test_override.async = true;

var test_type = function()
{
  
  var ln = new List(Number);
  var ls = new List(String);
  
  ln.append(5);
  ln.append(0.5);

  try
  {
    ln.append('foo');
    assert(false);
  }
  catch(exc)
  {
    if(exc.name != 'TypeError')
      throw exc;
  }

  ls.append('foo','bar');

  try
  {
    ls.append(10);
    assert(false);
  }
  catch(exc)
  {
    if(exc.name != 'TypeError')
      throw exc;
  }

}

var test_accessors = function()
{
  
  var l = new List();
  assert( l.__lookupGetter__(0) == undefined );
  assert( l.__lookupSetter__(0) );

  l.append(101);
  assert( l[0] == 101 ); 

  l[0] = l[0]*10;
  assert( l[0] == 1010 ); 

  assert( l.__lookupGetter__(1) == undefined );
  assert( l.__lookupSetter__(1) );

  assert( l[2] == undefined );

  l.append( 102 );
  l.append( 103 );
  l.append( 104 );
  l.append( 105 );

  l.remove(103);
  l.remove(104);

  assert(l[0] == 1010);
  assert(l[1] == 102);
  assert(l[2] == 105);

  try {
    assert( l[4] == undefined );
  }
  catch(e)
  {
    if(e.constructor!=roka.errors.IndexError)
      throw e;
  }

  l = new List();

  for(var i = -1; ++i < 10; ) 
  {
    l[i] = i*10;
    assert(l.items[i] == i*10);
  };

  l.remove( l[9] );

}

var test_every= function()
{
  var l = new List();
  l.append( 101 );
  l.append( 102 );
  l.append( 103 );
  assert(l.every(function(el){ return el>100; }));
  assert(!l.every(function(el){ return el>101 }));
}

var test_filter = function()
{
  var l = new List();
  l.append( 101 );
  l.append( 102 );
  l.append( 103 );

  var lf = l.filter(function(el){ return el>101 });
  assert( roka.core.oop.is_instance( lf, List ) );
  assert( lf.length == 2 );
  assert( lf[0] == 102 );
  assert( lf[1] == 103 );
}

var test_bind = function()
{
  
  var LC = function()
  {
    roka.core.oop.superproto( LC, this ).constructor.call( this );
  }

  roka.core.oop.extend( LC, List );

  //
  var increase = function(obj,value)
  {
    if( roka.core.oop.is_instance(obj,LC) )
    {
      obj = obj[0];
    }
    obj.value+=value;
  }

  //
  var create_item = window.parent.create_item = function(val)
  {
    var res = new LC();
    res.append({ 'value':val });
    return res;
  }

  //
  var lc = window.parent.list = new LC();
  lc.append( create_item( 10 )[0] );
  lc.append(create_item( 20 )[0] );
  lc.append(create_item( 30 )[0] );

  lc.for_each(function(el,ind){
    increase( el , 1 );
  });

  compare( lc[0].value , 11 );
  compare( lc[1].value , 21 );
  compare( lc[2].value , 31 );

  lc.append( create_item(40) );

  increase( lc[3], 1 );

  compare( lc[3][0].value , 41 );
}
