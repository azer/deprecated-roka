var DependencySet = roka.dom.dependencyset.DependencySet;
var partial = roka.core.utils.partial;

var test_import = function()
{
  var dpset = new DependencySet();
  dpset.events.add_listener('import-document',function()
  {
    try
    {
      compare( dpset.modules.length, 1);
      compare( dpset.modules[0], '/projects/roka/test/suites/dom/../../misc/foobar.js');
      compare( dpset.stylesheets.length, 1);
      compare( dpset.stylesheets[0], '/projects/roka/test/suites/dom/../../misc/foobar.css');
      compare( dpset.children.length, 3);
      compare( dpset.children[0], '/projects/roka/test/suites/dom/../../misc/../../helloworld/foo/bar/config.xml');
      compare( dpset.children[1], '/projects/roka/test/suites/dom/../../misc/../../helloworld/foo/config.xml');
      compare( dpset.children[2], '/projects/roka/test/suites/dom/../../misc/../../helloworld/config.xml');
      test_import.result = true;
    }
    catch(excinfo)
    {
      log('ERROR: ',excinfo.stack,'\n\n');
    }
  });
  dpset.import_document('../../misc/dpset_foo.xml');
}
test_import.async = true;

var test_load = function()
{
  var dpset = new DependencySet();
  dpset.events.add_listener('load',function()
  {
    var ctid = Number( dpset.id.match(/\d+$/)[0] ); 
    var ct = document.querySelector('#dependencyset_'+ctid); // container
    compare( ct.childNodes.length, 2);
    assert( ct.childNodes[0].src.indexOf('misc/foobar.js')>-1 );
    assert( ct.childNodes[1].href.indexOf('misc/foobar.css')>-1 );

    test_load.result = true;
  });

  dpset.import_document('../../misc/dpset.xml');
}
test_load.async = true;

var test_shortcut = function()
{
  var dpset = roka.dom.load("../../misc/dpset.xml", function(){
    var ctid = Number( dpset.id.match(/\d+$/)[0] ); 
    var ct = document.querySelector('#dependencyset_'+ctid); // container
    compare( ct.childNodes.length, 2);
    assert( ct.childNodes[0].src.indexOf('misc/foobar.js')>-1 );
    assert( ct.childNodes[1].href.indexOf('misc/foobar.css')>-1 );

    test_shortcut.result = true;
  });
}
test_shortcut.async = true;
