import React from "react";
import { InputSwitch } from "primereact/inputswitch";
import { Dialog } from 'primereact/dialog';


function ModalSwitch(props){
    return (
            <Dialog header="Headless Browser" visible={props.visibleHeadlessDialouge} footer={props.headlessBrowserDialogFooter}  style={{ width: '50vw' }} onHide={() => props.setVisibleHeadlessDialouge()}>
                <div className="card flex justify-content-center">
                    <span id="switch2">Off/On</span>
                    <InputSwitch aria-labelledby="switch2" checked={props.headlessBrowser} onChange={() => props.setHeadless()} />
                </div>
            </Dialog>

        
    )
}

export default ModalSwitch