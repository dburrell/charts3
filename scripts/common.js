////////////////////////////////////////////////////
//Initialisation
////////////////////////////////////////////////////
init();




////////////////////////////////////////////////////
//Visuals
////////////////////////////////////////////////////
//tooltip
function tooltip(id,classes,y,x,contents)
{    
    //remove existing one
    $("." + classes).remove();  

    //Create div
    
    var style = "";
    style += "position:absolute;";  // position absolute (moves)
    style += "top:" + y + "px;"     // top position
    style += "left:" + x + "px;";   // left position
    
    style += "background:#333;"     // background color
    style += "color:#FFF;"          // font color
    
    style += "padding:5px;"        // padding around the text
    
    style += "margin-top:15px;"     // keep it just below the mouse
    style += "margin-left:15px;"    // keep it to right of mouse
    
    
    var $newdiv1 = $( "<div id='" + id + "' class='" + classes + "' style='" + style + "'>" + contents + "</div>" );
    
    //Append newly created
    $( "body" ).append($newdiv1);    
}




////////////////////////////////////////////////////
//Debugging Functions
////////////////////////////////////////////////////

//Debug
function debug(level, message)
{
    // 1 for positions
    // 2 for debug notes ("x is 5")
    // 3 
    
    if (level <= settings.debugLevel)
    {
        clog("DEBUG [" + level + "]:: " + message);
    }
}

//A lazy shortcut to debug
function dbg(level,message)
{
    debug(level,message);
}

//Stubbing
function stub(s)
{
    debug(2, s);
}

//Console log
function clog(s)
{
    console.log(s)
}




////////////////////////////////////////////////////
//String/int Functions
////////////////////////////////////////////////////

//Add extra space to end of string
function fixLength(s,l, e)
{
    
    if (typeof (e) == "undefined")
    {
        e = '';
    }
    var returnMe = s;
    var spaceCount = l - s.length;
    
    if (e != null)
    {
        spaceCount -= 2;
    }
    
    for (var i = 0; i < spaceCount; i++)
    {
        returnMe += " ";
    }
    
    returnMe = e + returnMe + e;
    return returnMe;    
}

//Repeat Chars
function repeatChar(s,n)
{
    var r = "";
    for (var i = 0; i < n; i++)
    {
        r += s;
    }
    
    return r;
}

//is a between b & c (INCLUSIVE)
function between(a,b,c)
{
    if (a >= b && a <= c)
    {
        return true;
    }
    else
    {
        return false;
    }
}




////////////////////////////////////////////////////
//Timing functions
////////////////////////////////////////////////////

//current dateTime
function now()
{
  return new Date().getTime();
}




////////////////////////////////////////////////////
//INIT
////////////////////////////////////////////////////

//Initialisation definition
function init()
{    
    console.clear();
    if (settings.production)
    {
        settings.debugLevel = 0;
    }
    else
    {
        clog("---Running in debug mode at level " + settings.debugLevel + "---");
    }
}