
//Define jQuery function
(function($)
{
    $.fn.jChart = function(options)
    {
        /////////////////////////
        //parameters
        /////////////////////////
        var settings = $.extend(
        {
            //General                            
            randomNumber: Math.round(Math.random() * 100),          // Random number for the chart ID
            ctx: null,                                              // Context
            cols: -1,                                               // Number of columns per series            
            position: 'absolute',                                   // CSS Positioning of the canvas
            
            //Colouring
            font: "'Titillium Web', sans-serif",                    // Font face
            fontColor: '#888',                                      // Font colour
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
            
            //Axis info
            borderCol: "#aaa",                                      // For the axis borders                        
            yScale: 10,                                             // incremental values on y axis
                        
            //Currency
            possibleCurrencies: ['$','£','€'],                      // possible currency leading symbols
            currency: '',                                           // taken from any leading symbols in the data
            
            //Labels
            labels: ["none","none","none"],                         // none/name/value - what to show on labels
            labelYOffset: 14,                                       // Y offset positioning of labels
            labelXOffset: 3,                                        // X offset positioning of labels
                        
            //Currently touched objects
            touchedObject: -1,
            
            //Tooltip settings
            tooltipContents:toolTipContentTypes.fullRecord,
            tooltipPercentages: true,
            
            //Bar chart specifics            
            colours: ['#3498db', '#e67e22', '#16a085', '#34495e', '#e74c3c', '#95a5a6', '#1abc9c', '#f1c40f'],                                    
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
            //defaultType: types.stackedBar
            defaultType: types.donut
            //defaultType: types.bar
                        
        }, options);







        /////////////////////////
        //make a graph object
        /////////////////////////     
        var g = graph();            // make an object
        g.convertTable(this);       // import data
        
        //Default the seriesTypes to bar
        for(var i = 0; i <= g.seriesCount; i++)
        {        
            settings.seriesTypes[i] = settings.defaultType;
        } 
        
        //create canvas                
        if (settings.ctx == null)
        {
            settings.ctx = makeCanvas("canvas" + settings.randomNumber, settings.bgCol, settings.height, settings.width, settings.position, settings.left, settings.top);
            settings.ctx.translate(0.5, 0.5);
            $("#" + "canvas" + settings.randomNumber).hide();
            
            //On mouse over of this canvas, 
            $( "#canvas" + settings.randomNumber).mousemove(function( event )
            {                
                var y = event.pageY;
                var x = event.pageX;
                g.mouseOver(y,x);                
            });
        }
                
        //Pass values into graph object
        g.settings = settings;
                
        //Return the object
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



function makeCanvas(id, bgCol, height, width, position, left, top)
{
    $("body").append("<canvas id='" + id + "' style='position:" + position + "; top:" + top + "px; left:" + left + "px;  ' height=" + height + "px width=" + width + "px></canvas>");
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



