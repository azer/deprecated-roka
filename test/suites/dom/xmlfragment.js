var XMLFragment = roka.dom.xmlfragment.XMLFragment;
var parse = roka.dom.utils.parse;

var doc = parse('<foobar></foobar>');

var test_select = function()
{
  var f = new XMLFragment();
  f.content = doc;

  assert( f.select('foobar')[0] == doc.firstChild );
}

var test_query = function()
{
  var f = new XMLFragment();
  f.content = doc;

  assert( f.query('foobar')[0] == doc.firstChild );
}
