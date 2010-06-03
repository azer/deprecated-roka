var logging = roka.core.logging;

var test_api = function(){
  assert( logging.Logger );
  assert( logging.Level );
  assert( logging.Record );
  assert( logging.levels );
  assert( logging.levels.NOTSET );
  assert( logging.levels.DEBUG );
  assert( logging.levels.INFO );
  assert( logging.levels.WARN);
  assert( logging.levels.WARNING );
  assert( logging.levels.ERROR );
  assert( logging.levels.CRITICAL );
  assert( logging.levels.FATAL );
}

var test_basic = function(){
  var logger = new logging.Logger('main');
  logger.log('super','tramp'); 
  compare(logger.records[0].message, 'super, tramp');
  assert(logger.records[0].level,logging.levels.INFO);
  
  logger.fatal('de te fabula narratur'); 
  compare(logger.records[1].message, 'de te fabula narratur');
  assert(logger.records[1].level,logging.levels.CRITICAL);
  
  logger.warning('roka'); 
  compare(logger.records[2].message, 'roka');
  assert(logger.records[2].level,logging.levels.WARN);
  
  logger.debug('supertramp'); 
  compare(logger.records[3].message, 'supertramp');
  assert(logger.records[3].level,logging.levels.DEBUG);
  
  logger.error('supertramp'); 
  compare(logger.records[4].message, 'supertramp');
  assert(logger.records[4].level,logging.levels.ERROR);
}

var test_formatting = function(){
  var logger = new logging.Logger('main');
  logger.log('de te fabula narratur'); 
  var rec = logger.records[0];
  
  compare( 
    rec.format(), 
    rec.datetime.format( logger.datetime_format )+' - '+logger.name+' - '+rec.level.name+' - '+rec.message
  );
}

var test_eventhandling = function(){
  var captcount = 0;
  var logger = new logging.Logger('main'); 
  logger.level = logging.levels.ERROR;
  logger.events.add_listener('new-record',function(rec){
    if(!rec.level.value>=logger.level.value||++captcount>2){
      throw new Error('Invalid level['+logger.level.value+'/'+rec.level.value+'] or captcount:'+captcount);
    } else if(captcount==2){
      test_eventhandling.result = true;
    }
  });

  logger.error('roka');
  logger.debug('foobar');
  logger.fatal('critical');
  logger.log('info');
}
test_eventhandling.async = true;

var test_children = function()
{
  var captcount = 0;

  var main_logger = new logging.Logger('main');
  var frontend_logger = new logging.Logger('frontend');
  var backend_logger = new logging.Logger('backend');
  var foo = new logging.Logger('foo');

  frontend_logger.add_sublogger( foo );
  
  main_logger.add_sublogger( frontend_logger, backend_logger );
  
  assert( foo.parent_logger == frontend_logger );
  assert( frontend_logger.parent_logger == main_logger );
  assert( backend_logger.parent_logger == main_logger );
  assert( main_logger.parent_logger == null );

  assert( main_logger.name == 'main' );
  assert( frontend_logger.name == 'main.frontend' );
  assert( backend_logger.name == 'main.backend' );
  assert( foo.name == 'main.frontend.foo' );

  main_logger.events.add_listener('new-record',function(record){
  
    log('new log',captcount,record.message);

    switch(captcount)
    {
      case 0:
        assert(record.logger.name=='main');
        break;
      case 1:
        assert(record.logger.name=='main.frontend');
        break;
      case 2:
        assert(record.logger.name=='main.backend');
        break;
      case 3:
        assert(record.logger.name=='main.frontend.foo');
    }

    if(++captcount==4)
    {
      test_children.result = true;
    }
  });
  
  main_logger.log('main-test'); 
  frontend_logger.log('frontend-test'); 
  backend_logger.log('backnd-test');
  foo.log('foo-test');

}
test_children.async = true;

var test_console = function()
{
  var captcount = 0;
  var console = {
    count:function(){
      if(++captcount==3)
        test_console.result = true;
    },
    log:function(msg){
      switch(captcount)
      {
        case 0:
        case 2: break;
        default: throw Error('[log]captcount='+captcount);
      }

      console.count();
    },
    debug:function(){
      switch(captcount)
      {
        case 1: break;
        default: throw Error('[info]captcount='+captcount);
      }
      console.count();
    }
  }

  var logger = new logging.Logger('foo');
  logger.add_console( console );

  logger.log('hello world');
  logger.debug('hello world');
  logger.warn('hello world');

}
test_console.async = true;

