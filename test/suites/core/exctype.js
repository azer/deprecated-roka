var ExcType = roka.core.exctype.ExcType;
var IndexError;

var init = function(){
  IndexError = new ExcType('IndexError');
}

var test_exc_classification = function(){

  var catchfl = false;

  try {
    var colors = ['yellow','red'];
    if(!colors[3])
      throw new IndexError( 'Invalid index' );
  } catch(exc){
    if( exc.stack==null  )
    {
      log('browser doesn\'t provide stack information');
    }
    else
    {
      assert(/suites\/core\/exctype\.js/.test(exc.filename));
      compare( exc.lineno, 15 );
      compare( exc.message, 'Invalid index');
      assert(exc.constructor==IndexError);
    }
    catchfl = true;
  }

  assert( catchfl );

}

init();
