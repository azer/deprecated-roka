var I18N = roka.dom.i18n.I18N;
var query = roka.dom.utils.query;
var parse = roka.dom.utils.parse;
var localize = roka.dom.i18n.localize;

var test_get_text = function()
{
  var i18n = new I18N();
  i18n.append('../misc/lc_messages/en.xml');
  i18n.append('../misc/lc_messages/tr.xml');
  i18n.events.add_listener('load',function()
  {
    try
    {
      i18n.default_language = 'en';
      assert( i18n.get_text('hworld') == 'Hello World' );
      assert( i18n.get_text('mfest') == 'Of you the tale is told.' );
      
      i18n.default_language = 'tr';
      assert( i18n.get_text('hworld') == 'Merhaba Dunya' );
      assert( i18n.get_text('mfest') == 'Anlatilan senin hikayendir.' );

      test_get_text.result = true;
    } catch(e){
      log('\nERROR: '+e.message,'\n====\n',e.stack,'====');
      test_get_text.result = false;
    }
    
  });
  i18n.load();
}
test_get_text.async = true;

var test_localize = function()
{
   var xmldoc = parse('<?xml version="1.0" encoding="UTF-8"?>\
   <html xmlns:i18n="http://xml.rokajs.org/ns/i18n">\
     <head>\
       <title i18n:msgid="hworld"></title>\
     </head>\
     <body>\
       <h1 i18n:msgid="island"></h1>\
       <h2 i18n:msgid="mfest"></h2>\
     </body>\
   </html>');

  var lcset1 = new I18N();
  lcset1.append('../misc/lc_messages/en.xml');
  lcset1.append('../misc/lc_messages/tr.xml');
  lcset1.default_language = 'en';
 
  var lcset2 = new I18N();
  lcset2.append('../misc/lc_messages/tr_2.xml');
  lcset2.default_language = 'tr';
 
  var loadtask = new roka.async.taskset.TaskSet();
  loadtask.set('obs:lcset1',new roka.async.tasks.ObservationTask( lcset1.events.subjects.load ));
  loadtask.set('obs:lcset2',new roka.async.tasks.ObservationTask( lcset2.events.subjects.load ));
 
  loadtask.events.add_listener('success',function()
  {
    localize( xmldoc.querySelector('body'), lcset1, lcset2 );
    try {
      compare( query(xmldoc,'//title')[0].textContent , '' );
      compare( query(xmldoc,'//h1')[0].textContent , 'Ada' );
      compare( query(xmldoc,'//h2')[0].textContent , 'Of you the tale is told.' );
      test_localize.result = true;
    } catch(e){
      log('\n\nERROR: ',e.message,'\n',e.stack);
    }
  });
 
  lcset1.load();
  lcset2.load();
}

test_localize.async = true;