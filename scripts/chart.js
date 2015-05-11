
//Define jQuery function
(function($)
{
    $.fn.jChart = function(options)
    {
        inFunction("$.fn.jChart - setting defaults");
        /////////////////////////
        //parameters
        /////////////////////////
        var settings = $.extend(
        {            
            //General                            
            newObject: true,
            randomNumber: Math.round(Math.random() * 100),          // Random number for the chart ID
            ctx: null,                                              // Context
            cols: -1,                                               // Number of columns per series            
            position: 'absolute',                                   // CSS Positioning of the canvas
            
            //Colouring
            font: "'Titillium Web', sans-serif",                    // Font face
            fontColour: '#888',                                      // Font colour
            fontSize: 12,                                           // Font size
            bgCol: "transparent",                                   // Canvas Background Colour            
            lineCol: "#333",                                        // For line chart or outside of bars
            
            //Timing
            totalTime: 700,                                         // Time (ms) for animation
            fadeTime: 400,                                          // Time (ms) for fading in first
                                        
            //Positioning
            top: 0,                                                 // Top Position (CSS)
            left: 0,                                                // Left Position (CSS)
            width: 300,                                             // Width of canvas
            height: 300,                                            // Height of canvas
            margin: 40,                                             // Margin around drawarea
            container: '',                                          // parent object - leave blank to make position absolute
            
            //Axis info
            borderCol: "#aaa",                                      // For the axis borders                        
            yScale: 10,                                             // incremental values on y axis
                        
            //Currency
            possibleCurrencies: ['$','£','€'],                      // possible currency leading symbols
            currency: '',                                           // taken from any leading symbols in the data
            
            //Labels
            labelTypes: [],                                         // none/name/value - what to show on labels
            labelTypeDefault: "none",
            labelYOffset: 14,                                       // Y offset positioning of labels
            labelXOffset: 3,                                        // X offset positioning of labels
                        
            //Currently touched objects
            touchedObject: -1,
            
            //Tooltip settings
            tooltipContents:toolTipContentTypes.fullRecord,
            tooltipPercentages: true,
            
            //Colouring
            themeName: 'manual',
            colours: ['#3498db', '#e67e22', '#16a085', '#34495e', '#e74c3c', '#95a5a6', '#1abc9c', '#f1c40f'],                                    
            defaultOpacity:0.8,
            highlightedOpacity:0.2,
            lineColor:'#EAEAEA',
            lineWidth:3,
            
            //Bar chart specifics
            gap: 10,
            
            //Line chart specifics            
            lineWidth: 2,                                           // line width
            dots: true,
            shadeUnderLine: true,
                           
            //Scatter graph specifics           
            dotFill: '#eaeaea',
            
            //Pie specifics
            
            //Donut specifics
            donutGap: 5,
            
            //Types
            seriesTypes: [],            
            defaultType: types.stackedBar
            
                        
        }, options);







        /////////////////////////
        //make a graph object
        /////////////////////////     
        var g = graph();            // make an object
        g.convertTable(this);       // import data
        g.settings = settings;
        
        //Set the defaults
        for(var i = 0; i <= g.seriesCount; i++)
        {        
            g.settings.seriesTypes[i] = settings.defaultType;
            g.settings.labelTypes[i] = settings.labelTypeDefault;
        } 
        
        g.init();
        g.settings.newObject = false;                
        
        
        
        
        outFunction("$.fn.jChart");
        
        //Return the template
        return g;    
    };
}(jQuery));







///////////////////////////////////////////
//Canvas functions
///////////////////////////////////////////
function canvasWrite(ctx, txt, y, x, fontSize, font, color, align)
{
    if (align == undefined)
    {
        align = hAlign.left;
    }
    
    
    ctx.font = fontSize + "px " + font;
    ctx.fillStyle = color;
    
    if (align == hAlign.right)
    {
        var txtMeasure = ctx.measureText(txt); // TextMetrics object
        txtMeasure.width; // 16;
        x = x - txtMeasure.width;
    }
    
    if (align == hAlign.centre)
    {
        var txtMeasure = ctx.measureText(txt); // TextMetrics object
        txtMeasure.width; // 16;
        x = x - (txtMeasure.width/2);
    }
                
    ctx.fillText(txt, x, y);
}



function makeCanvas(id, bgCol, height, width, position, left, top, container)
{
    if (typeof container == 'undefined' || container == 'body' || container == '')
    {
        container = "body";
    }
    else
    {
        container = "#" + container;
        position = "";
    }
    
    
    
    var toAppend = "<canvas id='" + id + "' style='position:" + position + "; top:" + top + "px; left:" + left + "px;  ' height=" + height + "px width=" + width + "px></canvas>";
    
    $(container).append(toAppend);
    //$(container).append("<canvas id='" + id + "' style='position:" + position + "; top:" + top + "px; left:" + left + "px;  ' height=" + height + "px width=" + width + "px></canvas>");
    var ctx = getContext(id);
    ctx.clearRect(0, 0, width, height);
    //drawBox(ctx, "transparent", bgCol, point(0, 0), point(height, width));

    return ctx;
}

function getContext(id)
{
    var canvas = document.getElementById(id); // grab canvas element
    var ctx = canvas.getContext('2d'); // 2d context of element    
    return ctx;
}

function wipeCanvas(id)
{
    var canvas = document.getElementById(id); // grab canvas element
    var ctx = canvas.getContext('2d'); // 2d context of element
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas    

}



///////////////////////////////////////////
//Custom drawing functions
///////////////////////////////////////////
function point(y, x)
{
    var p = {};
    p.y = y;
    p.x = x;
    return p;
}

function drawLine(ctx, col, lineWidth, p1, p2)
{
    ctx.strokeStyle = col;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}



