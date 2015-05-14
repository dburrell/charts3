
//Placed in brackets to protect the scope
{
    var theme = {};
    
    //Set theme name
    theme.themeName = 'net.jCharts.sampleTheme';
    
    
    //Set bar colours
    theme.colours = [];
    theme.colours[0] = '#3498db';
    theme.colours[1] = '#e67e22';
    theme.colours[2] = '#16a085';
    theme.colours[3] = '#34495e';
    theme.colours[4] = '#e74c3c';
    theme.colours[5] = '#95a5a6';
    theme.colours[6] = '#1abc9c';
    theme.colours[7] = '#f1c40f';
    
    //Background color
    theme.bgCol = 'transparent';
    
    //For scatter type
    theme.lineWidth = 1;
    
    //Opacities
    theme.defaultOpacity = 1;
    theme.highlightedOpacity = 0.4;
    
    //Font
    theme.fontColour = '#888';
    theme.font = "'Titillium Web', sans-serif";
    
    //Connect up    
    env.themes[theme.themeName] = theme;    
}
