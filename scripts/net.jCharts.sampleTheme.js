
//Placed in brackets to protect the scope
{
    //Set theme name
    var themeName = 'net.jcharts.sampleTheme';
    
    
    //Set bar colours
    var seriesColours = [];
    seriesColours[0] = '#3498db';
    seriesColours[1] = '#e67e22';
    seriesColours[2] = '#16a085';
    seriesColours[3] = '#34495e';
    seriesColours[4] = '#e74c3c';
    seriesColours[5] = '#95a5a6';
    seriesColours[6] = '#1abc9c';
    seriesColours[7] = '#f1c40f';
    
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
