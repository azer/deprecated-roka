var css = roka.dom.css;
var query = roka.dom.utils.query;

var test_outline = function()
{
  assert( css.apply );
  assert( css.add_class );
  assert( css.get_class );
  assert( css.has_class );
  assert( css.remove_class );
  assert( css.replace_class );
  assert( css.toggle_class );
  assert( css.set_class );
  assert( css.get );
  assert( css.set );
}

var test_apply = function()
{ 
  var el = document.body;
  css.apply( el, { 'background-color':'rgb(255,180,220)' });
  compare( el.style.backgroundColor,'rgb(255, 180, 220)' );
}

var test_add_class = function()
{
  var el = document.body;
  el.className = '';
  css.add_class( el, 'Foo' );
  assert( el.className=='Foo' );
  el.className='';
}

var test_has_class = function()
{
  var el = document.body;
  el.className = 'Ab Abc Xyz Z';
  assert( !css.has_class( el, 'Foo' ) ); 
  assert( css.has_class( el, 'Ab' ) ); 
  assert( css.has_class( el, 'Abc' ) ); 
  assert( css.has_class( el, 'Xyz' ) ); 
  assert( css.has_class( el, 'Z' ) ); 
  assert( !css.has_class( el, 'yz' ) ); 
  el.className = '';
}

var test_remove_class = function()
{
  var el = document.body;
  el.className = 'Ab Abc Xyz Z';
  css.remove_class(el,'Abc');
  assert( !css.has_class(el,'Abc') );
  el.className = '';
}

var test_replace_class = function()
{
  var el = document.body;
  el.className = 'Ab Abc Xyz Z';
  css.replace_class(el,'Abc','Foo');
  assert( !css.has_class(el,'Abc') );
  assert( css.has_class(el,'Foo') );
  el.className = '';
}

var test_set_class = function()
{
  var el = document.body;
  css.set_class(el,'    Foo Xyz Abc   ');
  assert( el.className == 'Foo Xyz Abc' );
}

var test_get_class = function()
{
  var el = document.body;
  el.className = 'Foo Xyz Abc';
  assert( css.get_class( el ) == 'Foo Xyz Abc' );
  el.className='';
}

var test_get = function()
{
  var el = document.body;
  el.style.backgroundColor = 'rgb(154,205,34)';
  compare( css.get( el, 'background-color' ), 'rgb(154, 205, 34)');
}

var test_set = function()
{
  var el = document.body;
  css.set( el, 'background-color', 'rgb(255,190,230)' );
  compare( el.style.backgroundColor,'rgb(255, 190, 230)' );
}
