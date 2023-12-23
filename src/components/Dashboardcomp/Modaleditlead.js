import React from "react";
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
                
function ModalEditLead(props){
    return (
                        <Dialog header="Edit Lead" visible={props.visibleEditLead} footer={props.productDialogFooter}  style={{ width: '35vw' }} onHide={() => props.setVisibleEditLead()}>
                            {/* ERROR MSG */}
                            {props.submitNewLead &&  props.companyError ? <div className="p-inputgroup mb-1"><Message severity="error" text="Company is required"  className="border-primary w-full justify-content-start"  /></div> : null}
                            <div className="p-inputgroup mb-4"> 
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>  
                                <InputText name="company"  value={props.company} onChange={(evt) => props.Formchange(evt)}  placeholder="Company" />
                            </div>
                            {/* ERROR MSG */}
                            {props.submitNewLead &&  props.industryError  ? <div className="p-inputgroup mb-1"><Message severity="error" text="Industry is required"  className="border-primary w-full justify-content-start"  /></div> : null}
                            <div className="p-inputgroup mb-4">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-wrench"></i>
                                </span>
                                <InputText name="industry" value={props.industry} onChange={(evt) => props.Formchange(evt)}  placeholder="Industry" />
                            </div>
                            {/* ERROR MSG */}
                            <div className="flex flex-column md:flex-row gap-2 mb-1">{props.submitNewLead &&  props.locationError  ? <div className="p-inputgroup mb-1"><Message severity="error" text="Location is required"  className="border-primary w-full justify-content-start"  /></div> : null}{props.submitNewLead &&  props.phoneError ? <div className="p-inputgroup mb-1"><Message severity="error" text="Phone is required"  className="border-primary w-full justify-content-start"  /></div> : null} </div>
                            
                            <div className="flex flex-column md:flex-row gap-2 mb-4">
                               
                                <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-map-marker"></i>
                                    </span>
                                    <InputText name="location" value={props.location} onChange={(evt) => props.Formchange(evt)}  placeholder="State" />
                                </div>

                            <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-hashtag"></i>
                                    </span>
                                    <InputText name="phone" value={props.phone} onChange={(evt) => props.Formchange(evt)}  keyfilter="num" placeholder="Phone" />
                                </div>
                            </div>
                            {/* ERROR MSG */}
                            {props.submitNewLead &&  props.emailError ? <div className="p-inputgroup mb-1"><Message severity="error" text="Enter a valid email"  className="border-primary w-full justify-content-start"  /></div> : null}
                            <div className="p-inputgroup mb-4">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-at"></i>
                                </span>
                                <InputText name="email" value={props.email} onChange={(evt) => props.Formchange(evt)}  keyfilter="email" placeholder="Email" />
                            </div>
                            <div className="flex flex-column md:flex-row mb-4">

                                <div className="p-inputgroup flex-1">
                                    <span className="p-inputgroup-addon">www</span>
                                    <InputText name="url" value={props.u} onChange={(evt) => props.Formchange(evt)}  placeholder="Website" />
                                </div>
                            </div>

                        </Dialog>
    )
}

export default ModalEditLead