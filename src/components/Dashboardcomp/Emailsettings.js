import React from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button as PrimeButton }  from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
        

function EmailSettings(props){
    return(
            <Accordion>
                <AccordionTab header={
            <div className="flex align-items-center">
                <i className="pi pi-spin pi-cog mr-2"></i>
                <span className="vertical-align-middle">Email Settings</span>
            </div>
        }>
                    <Splitter style={{ height: 'auto' }}>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                            <p className="m-2">
                                    Lead Factory builds your email marketing lists at the press of a button. Email marketing is a solid tool for getting your brand, product, or service out there
                                </p>                        
                        </SplitterPanel>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                            {/* {props.emailBool ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration="1s" />  : <PrimeButton icon="pi pi-at" size="small" label='Pull Emails' rounded text raised severity="info" aria-label="Email" onClick={()=> props.emailPull()} /> } */}
                            {props.emailBool ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration="1s" />  :  <PrimeButton icon={<i className="pi pi-envelope p-overlay-badge mr-4" style={{ fontSize: '1.5rem' }}><Badge severity="info" value={props.emailCount}></Badge></i>} size="small" label='Pull Emails' rounded text raised severity="info" aria-label="Email" onClick={()=> props.emailPull()} /> }
                            {/* <PrimeButton type="button" label="Pull Emails" icon="pi pi-envelope" outlined  onClick={()=> props.emailPull()} ><Badge value={props.emailCount} size="normal" severity="danger"></Badge> </PrimeButton> } */}
                            {/* <PrimeButton icon={<i className="pi pi-envelope p-overlay-badge mr-2" style={{ fontSize: '1rem' }}><Badge value="2"></Badge></i>} size="small" label='Pull Emails' rounded severity="info" aria-label="Email" onClick={()=> props.emailPull()} /> }
<i className="pi pi-envelope p-overlay-badge" style={{ fontSize: '1rem' }}><Badge value="2"></Badge></i>                                                                            <PrimeButton type="button" label="Pull Emails" icon="pi pi-envelope" outlined badge="2" badgeClassName="p-badge-danger"  onClick={()=> props.emailPull()} /> */}
                            <PrimeButton icon="pi pi-info-circle" rounded text severity="info" tooltip="Selenium & Regex" aria-label="User" />

                        </SplitterPanel>
                    </Splitter>

                    <Splitter style={{ height: 'auto' }}>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                                <p className="m-2">
                                    For any business that uses email marketing, email verification is extremely important. Prevent sending to fake addresses, avoid wasting time and prevent email blacklisting.
                                </p>
                        </SplitterPanel>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                            {props.verifyBool ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration="1s" />  : <PrimeButton icon={<i className="pi pi-verified p-overlay-badge mr-2" style={{ fontSize: '1.5rem' }}><Badge severity="success" value={props.emailVerifyCount}></Badge></i>} size="small" label='Verify Emails' rounded text raised severity="success" onClick={()=> props.emailVerify()} disabled={props.emailCount > 0 ? false: true} /> }
                            <PrimeButton icon="pi pi-info-circle" rounded text severity="info" tooltip="Emailable API" aria-label="User" />

                        </SplitterPanel>
                    </Splitter>
                </AccordionTab>
            </Accordion>
    )
}


export default EmailSettings