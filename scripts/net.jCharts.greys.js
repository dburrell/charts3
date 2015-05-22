
//Placed in brackets to protect the scope
{
    var theme = {};
    
    //Set theme name
    theme.themeName = 'net.jCharts.greys';
    
    
    //Set bar colours
    theme.colours = [];
    theme.colours[0] = '#CCC';
    theme.colours[1] = '#EAEAEA';
    theme.colours[2] = '#DDD';
    theme.colours[3] = '#AAA';
    theme.colours[4] = '#FDFDFD';
    theme.colours[5] = '#ACACAC';
    theme.colours[6] = '#888';
    theme.colours[7] = '#B2B2B2';

    //Background color
    theme.bgCol = '#CCC';
    
    //For scatter type
    theme.lineWidth = 2;
        
    //Opacities
    theme.defaultOpacity = 1;
    theme.highlightedOpacity = 0.4;
    
    //Font
    theme.fontColour = '#888';
    theme.font = "'Titillium Web', sans-serif";
    
    //Connect up
    env.themes[theme.themeName] = theme;    
}
