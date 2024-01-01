import React from "react";
import { Chart } from 'primereact/chart';
import { TabView, TabPanel } from 'primereact/tabview';
        
function Leadchart(props){
    return(
         <div className="sideby">
            <div className="w-9">

            <TabView >
                <TabPanel  unstyled={true}  header="Industries" leftIcon="pi pi-wrench mr-2">
                    <div className="card" >
                        <Chart type="bar" data={props.chartData} options={props.chartOptions} />
                    </div>
                </TabPanel>
                <TabPanel header="Locations" leftIcon="pi pi-map-marker mr-2">
                    <div className="card" >
                        <Chart type="bar" data={props.chartData2} options={props.chartOptions2} />
                    </div>
                </TabPanel>

            </TabView>
            </div>
            <div className="w-9">
                    <TabView >
                    <TabPanel header="Status" leftIcon="pi pi-user mr-2">
                    <div className="card">
                            <Chart  type="bar" data={props.chartData3} options={props.chartOptions3} />
                    </div>

                    </TabPanel>
                </TabView>
                </div>

                </div>
    )
}

export default Leadchart
