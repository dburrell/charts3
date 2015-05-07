
//Placed in brackets to protect the scope
{
    //Set theme name
    var themeName = 'net.jcharts.greys';
    
    
    //Set bar colours
    var seriesColours = [];
    seriesColours[0] = '#CCC';
    seriesColours[1] = '#EAEAEA';
    seriesColours[2] = '#DDD';
    seriesColours[3] = '#AAA';
    seriesColours[4] = '#FDFDFD';
    seriesColours[5] = '#ACACAC';
    seriesColours[6] = '#888';
    seriesColours[7] = '#B2B2B2';
    
    //Opacities
    var defaultOpacity = 1;
    var highlightedOpacity = 0.4;
    
    //Font
    var fontColour = '#888';
    var font = "'Titillium Web', sans-serif";
    
    
    
    
    //Connect up
    var x = {};
    x.name = themeName;
    x.seriesColours = seriesColours;
    x.defaultOpacity = defaultOpacity;
    x.highlightedOpacity = highlightedOpacity;
    x.fontColour = fontColour;
    x.font = font;
    
    env.themes[x.name] = x;    
}
