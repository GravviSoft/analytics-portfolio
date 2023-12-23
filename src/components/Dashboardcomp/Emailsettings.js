import React from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button as PrimeButton }  from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

        

function EmailSettings(props){
    return(
            <Accordion>
                <AccordionTab header="Email Settings">
                    <Splitter style={{ height: 'auto' }}>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                            <p className="m-2">
                                    Lead Factory builds your email marketing lists at the press of a button. Email marketing is a solid tool for getting your brand, product, or service out there
                                </p>                        
                        </SplitterPanel>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                            {/* {props.emailBool ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration="1s" />  : <PrimeButton icon="pi pi-at" size="small" label='Pull Emails' rounded text raised severity="info" aria-label="Email" onClick={()=> props.emailPull()} /> } */}
                            {props.emailBool ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration="1s" />  : <PrimeButton icon="pi pi-at" size="small" label='Pull Emails' rounded text raised severity="info" aria-label="Email" onClick={()=> props.emailPull()} /> }

                        </SplitterPanel>
                    </Splitter>

                    <Splitter style={{ height: 'auto' }}>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                                <p className="m-2">
                                    For any business that uses email marketing, email verification is extremely important. Prevent sending to fake addresses, avoid wasting time and prevent email blacklisting.
                                </p>
                        </SplitterPanel>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                            {props.verifyBool ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration="1s" />  : <PrimeButton icon="pi pi-verified" size="small" label='Verify Emails' rounded text raised severity="success" aria-label="Verify" onClick={()=> props.emailVerify()} /> }

                        </SplitterPanel>
                    </Splitter>
                </AccordionTab>
            </Accordion>
    )
}


export default EmailSettings