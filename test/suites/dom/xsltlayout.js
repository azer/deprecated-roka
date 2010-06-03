var XSLTLayout = roka.dom.xsltlayout.XSLTLayout;
var is_instance = roka.core.oop.is_instance;

var path = roka.core.utils.get_dir( roka.core.utils.get_url(1) );

var test_api = function()
{
  var xl = new XSLTLayout();
  assert( is_instance(xl.subresources,roka.async.requestset.RequestSet) );
  assert( xl.subresources.length == 2);
  assert( xl.subresources.has('template') && xl.subresources.has('content') );
  compare( xl.path, path );
}

var test_transform = function()
{
  var l = new XSLTLayout();
  
  l.subresources.get('template').url = '../misc/layout/picture.xsl';
  l.subresources.get('content').url = '../misc/layout/picture.xml';

  l.subresources.send();

  l.events.add_listener('ready',function()
  {
    assert( l.output.query('..//img/@src')[0].nodeValue == 'http://google.com/images/logo.gif' );
    test_transform.result = true;
  });

}
test_transform.async = true;

var test_refresh = function()
{
  var l = window.parent.l = new XSLTLayout();
  l.subresources.get('template').url = '../misc/layout/picture.xsl';
  l.subresources.get('content').url = '../misc/layout/picture.xml';

  l.subresources.send();

  l.events.add_listener('ready',function()
  {
    
    l.events.add_listener('transform',function()
    {
      compare( l.output.query('..//img/@src')[0].nodeValue, 'http://kodfabrik.com/logo.png' );
      test_refresh.result = true;
    });

    l.content = roka.dom.utils.parse("<picture url='http://kodfabrik.com/logo.png' />");

    l.refresh();

  });
}

test_refresh.async = true;

var test_path = function()
{
  var L = function()
  {
    XSLTLayout.prototype.constructor.call(this);
    compare(this.path, path);
  }
  roka.core.oop.extend( L, XSLTLayout );

}
