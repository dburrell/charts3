////////////////////////////////////////////////////
//Initialisation
////////////////////////////////////////////////////
init();





////////////////////////////////////////////////////
//Functions
////////////////////////////////////////////////////

//Debug

function debug(level, message)
{
    if (level <= settings.debugLevel)
    {
        clog("DEBUG [" + level + "]:: " + message);
    }
}

//Debug Alert

function dAlert(level, message)
{
    if (level <= settings.debugLevel)
    {
        alert("DEBUG [" + level + "]:: " + message);
    }
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



function fixLength(s,l)
{
    var returnMe = s;
    var spaceCount = l - s.length;
    
    for (var i = 0; i < spaceCount; i++)
    {
        returnMe += " ";
    }
    
    return returnMe;
    //return "'" + returnMe + "'";
}

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