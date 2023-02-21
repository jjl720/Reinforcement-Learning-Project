const margin = { top: 20, right: 20, bottom: 180, left: window.innerWidth*0.1};
const csvUrl = 'Predicted_Q.csv'

function useData(csvPath){
    const [dataAll, setData] = React.useState(null); // If data is not Loaded then null

    React.useEffect(() => {
        d3.csv(csvPath).then(data => {
            data.forEach(d => {
                d.date = d.Date;
                d.buy = +d.Buy;
                d.sell = +d.Sell;
                d.hold = +d.Hold;
                d.date2 = d.date2;
                d.volume = +d.volume;
                d.open = +d.open;
                d.high = +d.high;
                d.low = +d.low;
                d.close = +d.close;
                d.adjclose = +d.adjclose;
            });       
            setData(data);
        });
    }, []);
    return dataAll;
}

function YAxes(props) {
   const {yScale , height2, height} = props;
   const ticks = yScale.ticks();
   
   return <g>
    <line y1 ={height} y2 = {height2} stroke = {`white`}/>

    {ticks.map( tickValue => {
        return <g key ={tickValue} transform = {`translate(-5, ${yScale(tickValue)+height2})`}>
                    <line x1 = {-3} x2 = {5} stroke= {"white"}/>
                    <text transform = {`translate(-5, 3)`}style = {{textAnchor:'end',fontSize:'15px',fill:'white'}}>
                        {tickValue}
                    </text>
                </g> 
                }
            )
    }
        <g transform = {`translate(-50,${height/2-50}) rotate(-90)`}>
            <text style = {{textAnchor:'end', fontSize: "20px", fill:'white'}}>
                Predicted Q Values
            </text>
        </g>
    </g>
}

function XAxes(props) {
    const {xScale, width, height,data} = props;

    const time_horizon  = [];

    const ticks = xScale.domain();
    console.log(ticks,'tickers')
    return <g>
        <line x1={0} y1 ={height} x2 ={width} y2 ={height} stroke = {`white`} /> 
        {ticks.map( tickValue => {  
            return <g key = {tickValue} transform = {`translate(${xScale(tickValue)},${height})`}>
                        <line y1={0} y2 = {6} stroke = {"white"} />
                        <g transform = {`translate(18,10) rotate(60)`}>
                            <text style = {{textAnchor:'start', fontSize: "15px", fill:'white'}} y = {20}>
                            {tickValue}
                            </text>
                        </g>
            </g>  
                }
            )
        } 
        <g transform = {`translate(${width-40},${height+110})`}>
            <text style = {{textAnchor:'end', fontSize: "20px", fill:'white'}}>
                Time Horizon
            </text>
        </g>
    </g>

}

function Points(props) {
    const {data,xScale,yScale,width, height,selectedPoint, setSelectedPoint} = props;
    console.log(data)
    const mouseOver = d => {
        setSelectedPoint(d.date);
    };
    const mouseOut = () => {
        setSelectedPoint(null);
    };

    const color = d => d.date === selectedPoint? "steelblue":"red";
    const color_sell = d => d.date === selectedPoint? "steelblue":"black";
    const color_hold = d => d.date === selectedPoint? "steelblue":"blue";
    const radius = d => d.date === selectedPoint? 10:5;
    
    if (selectedPoint == null) {
        return <g>
            {data.map(d => {
                return <g>
                     <circle key={d.date} cx={xScale(d.date)}
                        cy = {yScale(d.buy)} r ={5} fill= {"red"} stroke={'white'} 
                        onMouseOver= {()=> mouseOver(d)} onMouseOut = {mouseOut}  /> 

                    <circle key={d.date} cx={xScale(d.date)}
                        cy = {yScale(d.sell)} r ={5} fill= {"black"} stroke={'white'} 
                        onMouseOver= {()=> mouseOver(d)} onMouseOut = {mouseOut} /> 

                    <circle key={d.date} cx={xScale(d.date)}
                        cy = {yScale(d.hold)} r ={5} fill= {"blue"} stroke={'white'} 
                        onMouseOver= {()=> mouseOver(d)} onMouseOut = {mouseOut} /> 
                    </g>
                    })}
        </g> 
    } else {
        return <g>
            {data.map(d => {
                return  <g>
                    
                    <circle key={d.date} cx={xScale(d.date)}
                        cy = {yScale(d.buy)} r ={radius(d)} fill= {color(d)} stroke={'white'} 
                        onMouseOver= {()=> mouseOver(d)} onMouseOut = {mouseOut} />
                    
                    <circle key={d.date} cx={xScale(d.date)}
                        cy = {yScale(d.sell)} r ={radius(d)} fill= {color_sell(d)} stroke={'white'} 
                        onMouseOver= {()=> mouseOver(d)} onMouseOut = {mouseOut} />

                    <circle key={d.date} cx={xScale(d.date)}
                        cy = {yScale(d.hold)} r ={radius(d)} fill= {color_hold(d)} stroke={'white'} 
                        onMouseOver= {()=> mouseOver(d)} onMouseOut = {mouseOut} />

                    </g>
                    })}

            {data.filter(d=> d.date===selectedPoint).map (d=> {
                return <g> 
                        <circle key={d.date} cx={xScale(d.date)}
                        cy = {yScale(d.buy)} r ={radius(d)} fill= {color(d)} stroke={'white'} 
                        onMouseOver= {()=> mouseOver(d)} onMouseOut = {mouseOut} />

                        <circle key={d.date} cx={xScale(d.date)}
                        cy = {yScale(d.sell)} r ={radius(d)} fill= {color_sell(d)} stroke={'white'} 
                        onMouseOver= {()=> mouseOver(d)} onMouseOut = {mouseOut} />

                        <circle key={d.date} cx={xScale(d.date)}
                        cy = {yScale(d.hold)} r ={radius(d)} fill= {color_hold(d)} stroke={'white'} 
                        onMouseOver= {()=> mouseOver(d)} onMouseOut = {mouseOut} />

                        <Tooltip data = {data} xScale = {xScale} yScale = {yScale} width ={width} height={height} selectedPoint ={selectedPoint} setSelectedPoint={setSelectedPoint}/>
                        
                        </g>
                    
            })}
            </g>
    }

}

function ScatterPlot(props) {
    const {dataAll,data, HEIGHT, WIDTH, selectedPoint, setSelectedPoint} = props;
    if (!dataAll) {return <pre>Loading...</pre>;}
    const height = HEIGHT;
    const width = WIDTH;
    const time_horizon  = [];

    for (let i = 0; i < data.length; i++) {time_horizon.push(data[i]['date']);}
    console.log(time_horizon,data,'scater');
    const xScale = d3.scaleBand().range([0,width*0.5])
        .domain(time_horizon);
    
    let largest = 0;

    if (largest< d3.max(dataAll,d=> d.buy)){
        largest = d3.max(dataAll,d=> d.buy);
    }
    if (largest< d3.max(dataAll,d=> d.sell)){
        largest = d3.max(dataAll,d=> d.sell);
    }
    if (largest< d3.max(dataAll,d=> d.hold)){
        largest = d3.max(dataAll,d=> d.hold);
    }

    const yScale = d3.scaleLinear().range([height,0])
        .domain([0, largest]).nice();

    return <g transform = {`translate(${margin.left}, ${margin.top+50})`} >
        <Points data ={data} xScale ={xScale} yScale = {yScale}  width = {width} height = {height} selectedPoint ={selectedPoint} setSelectedPoint={setSelectedPoint}/>
        <YAxes  yScale ={yScale} height2 = {0} height = {height}/>
        <XAxes xScale ={xScale}   width = {width*0.5} height = {height} data = {data}/>
    </g>
}

function Tooltip(props) {
   const {data,xScale, yScale,width, height, selectedPoint, setSelectedPoint} = props;
  
   return <g>
    {data.filter(d=> d.date===selectedPoint).map (d=> {
    let shift_width = width*0.5;
    let shift_height = 10;
    
    return <g transform = {`translate(${shift_width+10},${shift_height})`}> 

        <rect x ={0} y ={0} rx={'10'} width = {width*0.4} height={height*0.9} fill='steelblue' opacity = {0.6}/>

            <g transform = {`translate(${0},${10})`}>
            <g transform = {`translate(${width*0.16},${+20})`}>
            <text style = {{textAnchor:'start', fontSize: "22px"}}>
                {d.date}
            </text>
            </g>
            <g transform = {`translate(${10},${40})`}>
            <text style = {{textAnchor:'start', fontSize: "21px"}}>
                Predicted Q value:
            </text>
            </g>
            
            <g transform = {`translate(${+23},${+65})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Buy: {d.buy.toFixed(3)} 
                </text>
            </g>

            <g transform = {`translate(${width*0.16},${+65})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Sell: {d.sell.toFixed(3)} 
                </text>
            </g>

            <g transform = {`translate(${width*0.16*2},${+65})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Hold: {d.hold.toFixed(3)} 
                </text>
            </g>

            <g transform = {`translate(${10},${65+25})`}>
                <text style = {{textAnchor:'start', fontSize: "20px"}}>
                    Ticker: APPL
                </text>
            </g>

            <g transform = {`translate(${+23},${65+(2*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    State Date: {d.date} 
                </text>
            </g>

            <g transform = {`translate(${+23},${65+(3*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Open Price: {d.open.toFixed(3)}
                </text>
            </g>

            <g transform = {`translate(${+23},${65+(4*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Close Price:{d.close.toFixed(3)}
                </text>
            </g>

            <g transform = {`translate(${+23},${65+(5*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Adj. Close Price: {d.adjclose.toFixed(3)}
                </text>
            </g>

            <g transform = {`translate(${+23},${65+(6*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    High Price: {d.high.toFixed(3)}
                </text>
            </g>

            <g transform = {`translate(${+23},${65+(7*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Low Price: {d.low.toFixed(3)}
                </text>
            </g>

            <g transform = {`translate(${+23},${65+(8*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Volume: {d.volume}
                </text>
            </g>

            <g transform = {`translate(${width*0.16},${65+(2*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    State Date: {d.date} 
                </text>
            </g>

            <g transform = {`translate(${width*0.16},${65+(3*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Open Price: N/A
                </text>
            </g>

            <g transform = {`translate(${width*0.16},${65+(4*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Close Price: N/A
                </text>
            </g>

            <g transform = {`translate(${width*0.16},${65+(5*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Adj. Close Price: N/A
                </text>
            </g>

            <g transform = {`translate(${width*0.16},${65+(6*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    High Price: N/A
                </text>
            </g>

            <g transform = {`translate(${width*0.16},${65+(7*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Low Price: N/A
                </text>
            </g>

            <g transform = {`translate(${width*0.16},${65+(8*25)})`}>
                <text style = {{textAnchor:'start', fontSize: "18px"}}>
                    Volume: N/A
                </text>
            </g>


            </g>
        </g>
    })}
    </g>

}

const Charts = () => {
    
    const dataAll = useData(csvUrl);
    const [selectedPoint, setSelectedPoint] = React.useState(null);
    const [month, setMonth] = React.useState('0');

    if (!dataAll) {
       return <pre>Loading...</pre>;
    };


    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight*.70;
    const innerHeight = HEIGHT - margin.top - margin.bottom;
    const innerWidth = WIDTH - margin.left - margin.right; 
   
    const allMonths= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const mouseOut = () => {
        setMonth(document.getElementById('slider').value);
    };
    const mon = ['01','02','03','04','05','06','07','08','09','10','11','12']
    const data = dataAll.filter( d => {
    return d.date.slice(5, 7) === mon[month]; 
    });


    return (
        <div>
            <div>
                <input id="slider" type='range' min='0' max='11' step='1' value = {month} onChange = {mouseOut}/>
                <input id="monthText" type="text" value={allMonths[month]} readOnly/>
            </div>

            <svg width={WIDTH} height={HEIGHT}>
                <ScatterPlot dataAll ={dataAll} data ={data} HEIGHT={innerHeight} WIDTH={innerWidth} selectedPoint ={selectedPoint} setSelectedPoint={setSelectedPoint}/>
            </svg>
        </div>
    )   
}


const rootElement = document.getElementById('scatter');
           ReactDOM.render(<Charts/>, rootElement);