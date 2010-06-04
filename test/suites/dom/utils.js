var add = roka.dom.utils.add;
var add_after = roka.dom.utils.add_after;
var add_before = roka.dom.utils.add_before;
var add_event_listener = roka.dom.utils.add_event_listener;
var create = roka.dom.utils.create;
var empty_xml_doc = roka.dom.utils.empty_xml_doc;
var getattr = roka.dom.utils.getattr;
var get_child = roka.dom.utils.get_child;
var insert = roka.dom.utils.insert;
var insert_after = roka.dom.utils.insert_after;
var insert_before = roka.dom.utils.insert_before;
var query = roka.dom.utils.query;
var remove_event_listener = roka.dom.utils.remove_event_listener;
var select = roka.dom.utils.select;
var setattr = roka.dom.utils.setattr;
var parse = roka.dom.utils.parse;
var apply_stylesheet = roka.dom.utils.apply_stylesheet;

var each = roka.core.functional.each;
var chain = roka.core.functional.chain;

var creation_counter = 0;

var init = function()
{
  xmldoc = parse("<messages><message from='future'>Hello World</message></messages>");
  compare( xmldoc.childNodes[0].textContent, 'Hello World' );
}

init();

window.__defineGetter__('tagname',function()
{
  return 'CEL'+(++creation_counter);
});                     

var test_add = function()
{
  var tag = window.tagname;
  xmldoc.querySelector('messages').appendChild( xmldoc.createElement(tag) );
  assert( xmldoc.querySelector(tag) );
}

var test_add_after = function()
{
  var tag = window.tagname;
  add_after( xmldoc.querySelector('messages'), document.createElement( tag ), xmldoc.querySelector('message') );
  assert( xmldoc.querySelector('message').nextSibling.tagName, tag);
}

var test_add_before = function()
{
  var tag = window.tagname;
  add_before( xmldoc.querySelector('messages'), document.createElement( tag ), xmldoc.querySelector('message') );
  assert( xmldoc.querySelector('message').previousSibling.tagName, tag);
}

var test_eventhandlers = function()
{
  return
  var t = true;
  var callback = function()
  {
    test_eventhandlers.result = t;
    t = false;
    remove_event_listener(window, 'focus', callback);
    window.focus();
  }

  add_event_listener(window, 'focus', callback);
  window.focus();
}

//test_eventhandlers.async = true;

var test_create = function()
{
  var tag = window.tagname;
  assert( create( xmldoc, tag ).tagName, tag);
}

var test_empty_xml_doc = function()
{
  var ed = roka.dom.utils.empty_xml_document;
  assert(ed.childNodes.length==1);
  assert(ed.childNodes[0].nodeName=='EmptyDocument')
}

var test_getattr = function()
{
  assert( getattr( xmldoc.querySelector('message[from=future]'), 'from') == 'future' );
};

var test_getchild = function()
{
  assert( get_child( xmldoc, 0).nodeName == 'messages' );
};

var test_insert = function()
{
  var tag = window.tagname;
  insert( xmldoc.createElement( tag ), xmldoc.firstChild );
  compare( xmldoc.firstChild.childNodes[ xmldoc.firstChild.childNodes.length-1 ].tagName, tag );
}

var test_insert_after = function()
{
  var tag = window.tagname;
  insert_after( xmldoc.createElement( tag ), xmldoc.querySelector('message') );
  compare( xmldoc.querySelector('message').nextSibling.tagName, tag );
} 

var test_insert_before = function()
{
  var tag = window.tagname;
  insert_before( xmldoc.createElement( tag ), xmldoc.querySelector('message') );
  compare( xmldoc.querySelector('message').previousSibling.tagName, tag );
} 

var test_query = function()
{
  assert( query( document, '//body' )[0]==document.body );
}

var test_select = function()
{
  assert( select(xmldoc,'messages')[0] == xmldoc.querySelector('messages') );

}

var test_setattr = function()
{
  var el = xmldoc.createElement('foo');
  setattr( el, 'foo', 'bar' );
  assert( el.hasAttribute('foo','bar') );
}

var test_applystylesheet = function()
{

  var stylesheet = parse('<?xml version="1.0" encoding="UTF-8"?>\
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">\
  <xsl:template match="/">\
    <div class="messages">\
      <xsl:for-each select="messages/message">\
        <div class="message">\
          <xsl:value-of select="text()" />\
        </div>\
      </xsl:for-each>\
    </div>\
  </xsl:template>\
</xsl:stylesheet>');

  var l = apply_stylesheet( stylesheet, xmldoc );

  compare( l.className, 'messages' );
  compare( l.childNodes.length, 1 );
  compare( l.firstChild.textContent, 'Hello World' );

  var le = apply_stylesheet( stylesheet );
  compare( le.className, 'messages' );
  compare( le.childNodes.length, 0 );


}
