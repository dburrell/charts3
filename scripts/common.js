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