var ExcType = roka.core.exctype.ExcType;
var IndexError;

var init = function(){
  IndexError = new ExcType('IndexError');
}

var test_exc_classification = function(){

  var catch_ind = false;

  try {
    var colors = ['yellow','red'];
    if(!colors[3])
      throw new IndexError( 'Invalid index' );
  } catch(exc){
    
    assert(/suites\/core\/exctype\.js/.test(exc.filename));
    compare( exc.lineno, 15 );
    compare( exc.message, 'Invalid index');
    assert(exc.constructor==IndexError);

    catch_ind = true;

  }

  assert( catch_ind  );

}

init();
