import React, {useEffect, useState, useRef} from 'react';
import Footer from './Footer';
import { Smallinforectangle } from './Infoblock';
import axios from 'axios';
import EmailSettings from "./Dashboardcomp/Emailsettings"
import ModalNewLead from "./Dashboardcomp/Modalnewlead"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button as PrimeButton }  from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Link } from "react-router-dom";
import { FilterMatchMode } from 'primereact/api';
import { ProgressSpinner } from 'primereact/progressspinner';                
import ModalSwitch from './Dashboardcomp/Modalswitch';
import { getStatusNum, getStatusColor } from './helpers/swithstatus';
import Leadchart from './Dashboardcomp/Chart'
import { Badge } from 'primereact/badge';
import { baseUrl } from '../constants/globals';


function Dashboard(){

    // const baseUrl = "https://440f142c.dv-mtn-capstone.pages.dev"
    // const baseUrl = process.env.PUBLIC_URL

    console.log("baseUrl", baseUrl)
    const [newlead, setNewLead] = useState({company: "",
        industry: "",
        location: "",
        phone: "",
        email: "",
        url: "", 
        status:  null,
        status_num: 0});

        
    const [submitNewLead, setSubmitNewLead] = useState(false)
    const [errors, setErrors] = useState({})

    const [selectedLead, setSelectedLead] = useState(null);

    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [leads, setLeads] = useState([]);
    const [patchData, setPatchData] = useState(null)
    const [submitEdit, setSubmitEdit] = useState(false)

    const [submitDelete, setSubmitDelete] = useState(false)
    const [deleteData, setDeleteData] = useState(null)

    const [totalLeadCount, setTotalLeadCount] = useState(0)
    const [userInformation, setUserInformation] = useState({})

    const [pullingYellowPg, setPullingYellowPg] = useState(false)
    const [pullingGoogle, setPullingGoogle] = useState(false)
    
    const [pullEmail, setPullEmail] = useState(false)
    const [verifyEmail, setVerifyEmail] = useState(false)

    const [hitDatabase, setHitDatabase] = useState(true)

    const [headlessBrowser, setHeadlessBrowser] = useState(false);
    const [visibleHeadlessDialouge, setVisibleHeadlessDialouge] = useState(false);
    const [visibleNewLead, setVisibleNewLead] = useState(false);
    const [editingModal, setEditingModal] = useState(false);

    const [leadstatus, setLeadStatus] = useState(null)
    const [leadstatusNum, setLeadStatusNum] = useState(0)
    const statuses = ['new client', 'dnc', 'meeting', 'negotiation',  'prospect', 'unqualified']

    const [func, setFunc] = useState({})

    const toast = useRef(null);
    const dt = useRef(null);

    let x = document.cookie
    let user_id = x.split(";")[0]


    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [labels, setLabels] = useState(null)
    const [industryData, setIndustryData] = useState(null)
    const [backgroundColorInd, setBackgroundColorInd] = useState(null)
    const [hoverBackgroundColorInd, setHoverBackgroundColorInd] = useState(null)

    useEffect(() => {
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Industries',
                    data: industryData,
                    backgroundColor: backgroundColorInd,
                    borderColor: hoverBackgroundColorInd,
                    borderWidth: 1
                }
            ]
        };
        const options = {scales: {y: {beginAtZero: true}},};
        setChartData(data);
        setChartOptions(options);
    }, [industryData]);

    const [chartData2, setChartData2] = useState({});
    const [chartOptions2, setChartOptions2] = useState({});
    const [labels2, setLabels2] = useState(null)
    const [locationData, setLocationData] = useState(null)
    const [backgroundColorLoc, setBackgroundColorLoc] = useState(null)
    const [hoverBackgroundColorLoc, setHoverBackgroundColorLoc] = useState(null)

    useEffect(() => {
        const data = {
            labels: labels2,
            datasets: [
                {
                    label: 'Location',
                    data: locationData,
                    backgroundColor: backgroundColorLoc,
                    borderColor: hoverBackgroundColorLoc,
                    borderWidth: 1
                }
            ]
        };
        const options = {scales: {y: {beginAtZero: true}}};
        setChartData2(data);
        setChartOptions2(options);
    }, [locationData]);

    const [chartData3, setChartData3] = useState({});
    const [chartOptions3, setChartOptions3] = useState({});
    const [labels3, setLabels3] = useState(null)
    const [statusData, setStatusData] = useState(null)
    const [backgroundColorSta, setBackgroundColorSta] = useState(null)
    const [hoverBackgroundColorSta, setHoverBackgroundColorSta] = useState(null)

    useEffect(() => {
        const data = {
            labels: labels3,
            datasets: [
                {
                    label: 'Status',
                    data: statusData,
                    backgroundColor: backgroundColorSta,
                    borderColor: hoverBackgroundColorSta,
                    borderWidth: 1
                }
            ]
        };
        const options = {indexAxis: 'y'};
        setChartData3(data);
        setChartOptions3(options);
    }, [statusData]);

    function Inputchange(evt){
        const { name, value } = evt.target
        console.log(name, value)
        setNewLead(prev=>{
            return {
            ...prev,
            [name]: value

            }
        })
    }

    const [emailCount, setEmailCount] = useState(0)
    const [emailVerifyCount, setEmailVerifyCount] = useState(0)

    useEffect(() => {
        if (hitDatabase){
            console.log(`Pulling Database Leads:`)
            axios.get(`/dashboard/${user_id}`)
                .then(dbResult=>{
                    console.log(dbResult.data)
                    setLeads(dbResult.data.leadInfo)
                    setTotalLeadCount(dbResult.data.leadInfo.length)
                    const { userInfo, leadInfo, industryName, industryNum, backgroundColor, hoverBackgroundColor, locationName, locationNum, locationbackgroundColor, locationhoverBackgroundColor, statusName, statusNum, statusbackgroundColor, statushoverBackgroundColor} = dbResult.data

                    setLabels(industryName)
                    setIndustryData(industryNum)
                    setBackgroundColorInd(backgroundColor)
                    setHoverBackgroundColorInd(hoverBackgroundColor)

                    setLabels2(locationName)
                    setLocationData(locationNum)
                    setBackgroundColorLoc(locationbackgroundColor)
                    setHoverBackgroundColorLoc(locationhoverBackgroundColor)

                    setLabels3(statusName)
                    setStatusData(statusNum)
                    setBackgroundColorSta(statusbackgroundColor)
                    setHoverBackgroundColorSta(statushoverBackgroundColor)

                    userInfo.industry = userInfo.industry.join(", ")
                    userInfo.location = userInfo.location.join(", ")
                    setUserInformation(userInfo)

                    let emailCounter = 0;
                    let emailVerCounter = 0;
                    for (const obj of leadInfo) {
                        if (obj.email !== '') emailCounter++;
                        if (obj.email_verify !== null && obj.email_verify.state === 'deliverable') emailVerCounter++
                    }
                    setEmailVerifyCount(emailVerCounter)
                    setEmailCount(emailCounter)
                    console.log("emailCounter", emailCounter);
                })
                .catch(dbError=>console.log(dbError.data))

            setHitDatabase(false)
            initFilters();
        }

    }, [hitDatabase]);


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilterValue('');
    };


    useEffect(() => {
        console.log(selectedLead)
    }, [selectedLead]);


    useEffect(() => {
        if (pullingYellowPg){
            console.log(`Pulling YP:`, pullingYellowPg)
            axios.post(`${baseUrl}:5023/ypscrape/${user_id}`, {headlessBrowser:  headlessBrowser})
            .then(dbResult=>{
                console.log(dbResult)
                setPullingYellowPg(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Finished Scraping Leads', life: 3000 });
                setHitDatabase(true)
                setHeadlessBrowser(false)
            })
            .catch(dbError=>{
                setPullingYellowPg(false)
                toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error Scraping Leads', life: 3000 });
                setHeadlessBrowser(false)
            })
            setTimeout(function(){
                setHeadlessBrowser(false)
            }, 1500);
        }
    }, [pullingYellowPg]);

    useEffect(() => {
        if (pullingGoogle){
            console.log(`pullingGoogle:`, pullingGoogle)
            axios.post(`${baseUrl}:5023/google/${user_id}`, {headlessBrowser:  headlessBrowser})
            .then(dbResult=>{
                console.log(dbResult)
                setPullingGoogle(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Finished Scraping Leads', life: 3000 });
                setHitDatabase(true)
                setHeadlessBrowser(false)
            })
            .catch(dbError=>{
                setPullingGoogle(false)
                setHeadlessBrowser(false)
                toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error Scraping Leads', life: 3000 });
            })
            setTimeout(function(){
                setHeadlessBrowser(false)
            }, 1500);
        }
    }, [pullingGoogle]);

    useEffect(()=>{
        if (pullEmail){
            console.log(`pullingEmails:`, pullEmail)
            axios.post(`${baseUrl}:5023/pullEmail/${user_id}`, {headlessBrowser:  headlessBrowser})
            .then(dbResult=>{
                const { msg } = dbResult.data
                setPullEmail(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: msg, life: 3000 });
                setHitDatabase(true)
                setTimeout(function(){
                    setHitDatabase(true)
                }, 1500);
            })
            .catch(dbError=>{
                setPullEmail(false)
                toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error Pulling Emails.', life: 3000 });
            })
            setTimeout(function(){
                setHeadlessBrowser(false)
            }, 1500);
        }
    }, [pullEmail])

    


    useEffect(()=>{
        if (verifyEmail){
            console.log(`Verify Email:`, verifyEmail)
            axios.post(`${baseUrl}:5023/verifyemail/${user_id}`, {headlessBrowser:  headlessBrowser})
            .then(dbResult=>{
                const { msg } = dbResult.data
                setVerifyEmail(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: msg, life: 3000 });
                setHitDatabase(true)
                setTimeout(function(){
                    setHitDatabase(true)
                }, 1500);
            })
            .catch(dbError=>{
                    setVerifyEmail(false)
                    toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error Pulling Emails.', life: 3000 });
            })

            setTimeout(function(){
                setHeadlessBrowser(false)
            }, 1500);
        }

    }, [verifyEmail])


    useEffect(()=>{
        if (submitNewLead && Object.keys(errors).length === 0 && !editingModal){
            console.log("Submitting New Lead", newlead)
            console.log("Errors", errors)
            axios.post(`${baseUrl}:5023/dashboard/${user_id}`, newlead)
            .then(dbResult=>{
                const { msg } = dbResult.data
                closeNewLeadModal()
                setLeadStatus(null)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: msg, life: 3000 });
                setHitDatabase(true)
            })
            .catch(dbError=>{
                setLeadStatus(null)
                closeNewLeadModal()
                toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error Saving New Lead.', life: 3000 });
            })
            
        }
        console.log(errors.length, "Errors", errors)

    }, [errors])

    useEffect(()=>{
        if (submitNewLead && Object.keys(errors).length === 0 && editingModal){
            console.log("Editing Lead", newlead)
            console.log("Errors", errors)
            axios.patch(`${baseUrl}:5023/dashboard/${newlead.lead_id}`, newlead)
            .then(dbResult=>{
                const { msg } = dbResult.data
                closeNewLeadModal()
                setEditingModal(false)
                setLeadStatus(null)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: msg, life: 3000 });
                setHitDatabase(true)
            })
            .catch(dbError=>{
                setLeadStatus(null)
                setEditingModal(false)
                closeNewLeadModal()
                toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error Saving New Lead.', life: 3000 });
            })    
        }
        console.log(errors.length, "Errors", errors)

    }, [errors])


  function handleErrors(formValues){
    let errors= {}
    const {company, industry, location, phone, email, url} = newlead
    if (company.length < 1){
        errors.company = "Company is required"
    }
    if (industry.length < 1){
        errors.industry = "Industry is required"
    }
    if (location.length < 2){
        errors.location = "Location is required"
    }
    if (phone.length < 10){
        errors.phone = "Phone is required"
    }
    let array_mails = formValues.email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    console.log(array_mails)
    if  (email.length > 0 && !array_mails){ 
      errors.email = "Enter a valid email."
    }
    setErrors(errors)
  }


    // FOUR FUNCTIONS TO START SELENIUM
    const emailPull = () => setPullEmail(true)
    const emailVerify = () => setVerifyEmail(true)
    const Scrapeyp = () => setPullingYellowPg(true)
    const Scrapegoogle = () => setPullingGoogle(true)



    const urlBodyTemplate = (rowData) =>{
        const { url } = rowData     
        if (url){
            return <a href={url}>Link</a> 
        }
   }
    

    const companyImgBodyTemplate = (rowData) => {
        const company_img = rowData.company_img
        return (
            <div className="flex align-items-center gap-2">
                <img alt={company_img} src={company_img} className="shadow-2 border-round" style={{ maxWidth: '64px', maxHeight: "64px" }} />
            </div>
        )
    };


    const companyBodyTemplate = (rowData) => {
        const { company, lead_id } = rowData
        return <Link onClick={document.cookie = `${user_id}; path=/lead/` + rowData.lead_id} to={"/lead/" + lead_id}>{company}</Link>
    };

    useEffect(() => {
        console.log(patchData)
        if (submitEdit){
            console.log(`MY PATCH DATA:`, patchData)
            axios.patch(`/dashboard/${patchData.lead_id}`, patchData)
                .then(dbResult=>{
                    const { msg } = dbResult.data
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: msg, life: 3000 });
                    setHitDatabase(true)
                })
                .catch(dbError=>{
                    setPullEmail(false)
                    toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error updating lead.', life: 3000 });
                })
        }
        setPatchData(null)
        setSubmitEdit(false)
        }, [submitEdit]);


    const onRowEditComplete = (e) => {
        let { newData, index } = e;
        setPatchData(newData)
        setSubmitEdit(true)
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => {
            console.log(e)
            console.log(e.target.value)
            options.editorCallback(e.target.value)}
         } />;
    };

    const header = (
            <div className="flex justify-content-between">
                <h4 className="m-2">Manage Leads</h4>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search..." />
                </span>
            </div>
    );

    useEffect(() => {
        console.log(deleteData)
        if (submitDelete){
            console.log(`MY DELETE DATA:`, deleteData)
            axios.delete(`/dashboard/${deleteData.lead_id}`)
                .then(dbResult=>{
                    console.log(dbResult.data)
                    const { msg } = dbResult.data
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: msg, life: 3000 });
                    setHitDatabase(true)
                })
                .catch(dbError=>console.log(dbError))
        }
        setDeleteData(null)
        setSubmitDelete(false)
        }, [submitDelete]);

    const confirmDeleteMany = () => {
        if (selectedLead){
            console.log(selectedLead)
            let ids = []
            selectedLead.map(val=> ids.push(val.lead_id))
            console.log(ids)
            console.log(ids.join(","))
            setDeleteData({lead_id: ids})
            setSubmitDelete(true)
            const _leads =  leads.filter(val => !selectedLead.includes(val))
            setTotalLeadCount(_leads.length)
            setLeads(_leads);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Select leads to delete.', life: 3150 });
  
        }
    };

    const confirmDeleteProduct = (lead) => {
        console.log(lead)
        setDeleteData(lead)
        setSubmitDelete(true)
        const _leads = leads.filter(item=> item.lead_id !== lead.lead_id )
        setTotalLeadCount(_leads.length)
        setLeads(_leads);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };


  const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <PrimeButton label="New" icon="pi pi-plus" severity="success" onClick={()=> setVisibleNewLead(true)} />
                <PrimeButton label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteMany}  />
            </div>
        );
    };
    const rightToolbarTemplate = () => {
            return (
            <div className="flex flex-wrap gap-2">
                <PrimeButton label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => exportCSV(false)} />
            </div>
            );
    };

    function closeNewLeadModal(){
        setVisibleNewLead(false)  
        setSubmitNewLead(false)
        setEditingModal(false)
        setLeadStatus(null)
        setNewLead({company: "", industry: "", location: "", phone: "", email: "", url: ""})
    }

    const editProduct = (rowData) => {
        console.log(rowData)
        setEditingModal(true)
        setNewLead({ ...rowData })
        setVisibleNewLead(true)
        // setProduct({ ...product });
        // setProductDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
         return (
            <div className='flex overflow-hidden'>
                <PrimeButton icon="pi pi-pencil" rounded outlined  onClick={() => editProduct(rowData)} />

                <PrimeButton icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
                <Link onClick={document.cookie = `${user_id}; path=/lead/` + rowData.lead_id} to={"/lead/" + rowData.lead_id}><PrimeButton icon="pi pi-home" rounded outlined /></Link>
            </div>
        );
    };

    const productDialogFooter = (
        <div className='flex flex-wrap gap-2 float-end' >
            <PrimeButton label="Cancel" size='small' severity="info" icon="pi pi-times" outlined onClick={() => closeNewLeadModal() } />
            <PrimeButton label="Save"  size='small' severity="info" icon="pi pi-check" onClick={()=> {
                handleErrors(newlead)
                console.log(newlead)
                setSubmitNewLead(true)
         
                }} />
        </div>
    );

    const headlessBrowserDialogFooter = (
        <div className='flex flex-wrap gap-2 float-end' >
            <PrimeButton label="Cancel" size='small' severity="info" icon="pi pi-times" outlined onClick={() => {
                setVisibleHeadlessDialouge(false)
            }} />
            <PrimeButton label="Save"  size='small' severity="info" icon="pi pi-check" onClick={()=> { 
                func.name()
                setVisibleHeadlessDialouge(false)
                }
            } />
        </div>
    );
    
    const tagBodyTemp = (rowData) => {
        return <Tag value={rowData.status} severity={getStatusColor(rowData.status)}></Tag>;
    };

    const emailBody = (rowData) => {
        if (rowData.email_verify !== null){
                const { state, score } = rowData.email_verify 
                return  <PrimeButton icon={<i className="pi pi-verified p-overlay-badge mr-4" style={{ fontSize: '1.5rem' }}><Badge severity={state === 'deliverable' ? 'success': 'danger'} value={score}></Badge></i>} size="small" label={rowData.email} rounded text severity={state === 'deliverable' ? 'success': 'danger'} tooltip={JSON.stringify(rowData.email_verify,null,'\t')} tooltipOptions={{ position: 'top', mouseTrack: true, mouseTrackTop: 15 }} /> 
            }
        return rowData.email
    }

    function setLeadStatusFunc(value){
        console.log(value)
        setNewLead(prev =>{
            return {
                ...prev,
                status: value,
                status_num: getStatusNum(value)
            }
        })
    }


    return <div className="App">
            <Toast ref={toast} />
            <div className="sideby"> 
                <Smallinforectangle name="Lead Count" number={totalLeadCount} />
                <Smallinforectangle name="Industries" emoji="fa fa-edit float-end"  meaning={"Roofing"}/>
                {/* meaning={userInformation.industry.substring(0,26) + '...' }/> */}
                <Smallinforectangle name="Locations" emoji="fa fa-edit float-end" meaning={"Utah"}/>
                <Smallinforectangle name="Yellow Pages" button={pullingYellowPg ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration="1s" />  : <PrimeButton icon="pi pi-user" size="small" label='Pull Leads' rounded text raised severity="info" aria-label="User" onClick={()=> {
                        setFunc({name: Scrapeyp})
                        setVisibleHeadlessDialouge(true)
                }} />}/> 
                <Smallinforectangle name="Google" button={pullingGoogle ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration="1s" />  : <PrimeButton icon="pi pi-user" size="small" label='Pull Leads' rounded text raised severity="info" aria-label="User" onClick={()=>{
                        setFunc({name: Scrapegoogle})
                        setVisibleHeadlessDialouge(true)
                }} />}/> 
            </div>   
            <div className="card">
               {totalLeadCount > 0 &&  <Leadchart chartData={chartData}  chartOptions={chartOptions} chartData2={chartData2} chartOptions2={chartOptions2} chartData3={chartData3} chartOptions3={chartOptions3}  /> }
               {totalLeadCount > 0 &&  <EmailSettings emailBool={pullEmail} emailCount={emailCount} emailVerifyCount={emailVerifyCount} emailPull={()=> {
                    setFunc({name: emailPull})
                    setVisibleHeadlessDialouge(true)}
                    } verifyBool={verifyEmail} emailVerify={emailVerify} /> }
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} sortField="lead_id" sortOrder={-1}  value={leads} stripedRows paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50, 500]}size="large" editMode="row" dataKey="lead_id" onRowEditComplete={onRowEditComplete} selection={selectedLead}  onSelectionChange={(e) => setSelectedLead(e.value)}  filters={filters} globalFilterFields={['company', 'industry', 'location', 'phone', 'email']} header={header} emptyMessage="No leads found.">
                    <Column selectionMode="multiple" style={{ width: '1%' }} exportable={false}></Column>
                    <Column field="lead_id" style={{ width: '0%' }}  header="ID"></Column>

                    <Column body={companyImgBodyTemplate}  header="Img" style={{ width: '5%' }}></Column>
                    <Column body={companyBodyTemplate} field='company' style={{ width: '15%' }} editor={(options) => textEditor(options)}  header="Company"></Column>
                    <Column field="industry" style={{ width: '12%' }} editor={(options) => textEditor(options)}  header="Industry"></Column>
                    <Column field="location" style={{ width: '9%' }} editor={(options) => textEditor(options)}  header="Location"></Column>
                    <Column field="phone" style={{whiteSpace: "nowrap"}} editor={(options) => textEditor(options)}  header="Phone"></Column>
                    <Column body={emailBody} field="email" editor={(options) => textEditor(options)}  header="Email"></Column>
                    <Column field="status" style={{whiteSpace: "nowrap"}} body={tagBodyTemp} header="Status" ></Column>
                    <Column body={urlBodyTemplate} header="Url"></Column>
                    <Column style={{whiteSpace: "nowrap"}} body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
                
                {/* MODALS */}
                <ModalNewLead visibleNewLead={visibleNewLead} productDialogFooter={productDialogFooter} setVisibleNewLead={()=> closeNewLeadModal()}  company={newlead.company} industry={newlead.industry} location={newlead.location} phone={newlead.phone} email={newlead.email} url={newlead.url} companyError={errors.company} industryError={errors.industry} locationError={errors.location} phoneError={errors.phone} emailError={errors.email} leadStatus={newlead.status} setLeadStatus={setLeadStatusFunc}  statuses={statuses}  submitNewLead={submitNewLead} Formchange={Inputchange}  />
                <ModalSwitch visibleHeadlessDialouge={visibleHeadlessDialouge} headlessBrowserDialogFooter={headlessBrowserDialogFooter} setVisibleHeadlessDialouge={() => setVisibleHeadlessDialouge(false)}  headlessBrowser={headlessBrowser} setHeadless={()=> setHeadlessBrowser(!headlessBrowser)} />
            </div>
            <Footer />
    </div>
}


export default Dashboard