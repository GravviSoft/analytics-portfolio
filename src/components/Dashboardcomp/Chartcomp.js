import React from "react";
import { Chart } from 'primereact/chart';

            

function SmallLeadchart(props){
    return(

                <div className="card flex align-items-end justify-content-center">
                        <Chart  type="bar" data={props.chartData3} options={props.chartOptions3} />
                </div>

    )
}


export default SmallLeadchart
