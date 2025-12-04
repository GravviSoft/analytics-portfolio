import React, {useEffect, useState, useRef, useMemo} from 'react';
import Footer from './Footer';
import { Smallinforectangle } from './Infoblock';
import axios from 'axios';
import EmailSettings from "./Dashboardcomp/Emailsettings"
import ModalNewLead from "./Dashboardcomp/Modalnewlead"
import ModalCreateDriveFolder from './Dashboardcomp/Googledrive';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button as PrimeButton }  from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Link } from "react-router-dom";
// import { FilterMatchMode } from 'primereact/api';
import { ProgressSpinner } from 'primereact/progressspinner';                
import ModalSwitch from './Dashboardcomp/Modalswitch';
import { getStatusNum, getStatusColor } from './helpers/swithstatus';
import Leadchart from './Dashboardcomp/Chart'
import { Badge } from 'primereact/badge';
import { baseUrl } from '../constants/globals';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode, FilterService } from 'primereact/api';
// import { Col } from 'sequelize/lib/utils';
import { MultiSelect } from 'primereact/multiselect';

// PrimeReact custom operator: keep rows whose date is within N months from today
FilterService.register('withinMonths', (value, filter /* N months */) => {
  // value = row.first_upload_date (ISO string or Date)
  // filter = number (1|2|3|4) or null
  if (filter == null) return true;            // "All time"
  if (!value) return false;

  const d = new Date(value);
  if (isNaN(d)) return false;

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - Number(filter));
  return d >= cutoff;
});


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

    // const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    
    const [first, setFirst] = useState(0); // index of first row on the current page
    const [monthWindow, setMonthWindow] = useState(null); // null | 1 | 2 | 3 | 4
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        first_upload_date: { value: null, matchMode: 'withinMonths' }, // 👈 our custom rule
        search_term: { value: null, matchMode: FilterMatchMode.EQUALS }

    });
    const [windowCount, setWindowCount] = useState(0); // for the stat card/report

        

    
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

    function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1] || null;
}
    // let x = document.cookie
    // let user_id = x.split(";")[0]
    const user_id = getCookie('user_id'); // returns the value or null
    if (!user_id) {
    console.warn('No user_id cookie found.');
    // Optionally: redirect to login or show a message
    // return;
    }



        /* =============================
    // GOOGLE DRIVE CODE TO CREATE FOLDERS
    ============================= */
    // GOOGLE DRIVE CODE TO CREATE FOLDERS
    const [folderDlgOpen, setFolderDlgOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [rowForFolder, setRowForFolder] = useState(null);
    const [submitAttempt, setSubmitAttempt] = useState(false);

    const API_KEY = "AIzaSyDEfijnvr2Ob1ZzaYWaZ1CrkcShZyJzSUQ";
    const CLIENT_ID = "1035244904865-u1qq4t1g8oonht00pkbmrbfds0mivsvb.apps.googleusercontent.com";
/* ---------- gapi loader + init (JS ONLY) ---------- */
    // const API_KEY = "YOUR_API_KEY";
    /* ===== GIS + GAPI BOOTSTRAP (JS only) ===== */
    const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
    "https://sheets.googleapis.com/$discovery/rest?version=v4",
    "https://docs.googleapis.com/$discovery/rest?version=v1",
    ];
    const SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/documents",
    ].join(" ");

    let bootPromise = null;
    let tokenClient = null;
    let accessToken = null;

    function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.defer = true;
        s.onload = resolve;
        s.onerror = () => reject(new Error("Failed to load script: " + src));
        document.head.appendChild(s);
    });
    }

    /** Boot both gapi (client) and GIS (OAuth) */
    async function bootApis() {
    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
        // 1) Load scripts
        await loadScriptOnce("https://apis.google.com/js/api.js");
        await loadScriptOnce("https://accounts.google.com/gsi/client");

        // 2) Init gapi client (discovery only; OAuth handled by GIS)
        await new Promise((res) => window.gapi.load("client", res));
        await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
        });

        // 3) Init GIS token client
        tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,      // space-separated scopes
        // callback is set dynamically when requesting tokens
        callback: () => {},
        });
    })();

    return bootPromise;
    }

    /** Ask GIS for an access token (must be called from a user gesture) */
    function requestAccessToken({ prompt = "consent" } = {}) {
    return new Promise((resolve, reject) => {
        tokenClient.callback = (resp) => {
        if (resp.error) {
            reject(resp);
            return;
        }
        accessToken = resp.access_token;
        resolve(accessToken);
        };
        try {
        tokenClient.requestAccessToken({ prompt }); // "consent" first time; "" for silent refresh
        } catch (e) {
        reject(e);
        }
    });
    }

    /** Ensure we’re booted and authorized; sets token on gapi.client */
    async function ensureAuthorized() {
    await bootApis();
    if (!accessToken) {
        // first time: force the consent prompt (needs to run from a click)
        await requestAccessToken({ prompt: "consent" });
    }
    window.gapi.client.setToken({ access_token: accessToken });
    }


    /* =============================
    DRIVE/SHEETS/DOCS HELPERS
    ============================= */

    // ---- error helper (put at top of Dashboard.js) ----
    function errMessage(err) {
    if (err && err.result && err.result.error) return JSON.stringify(err.result.error, null, 2);
    if (err && err.error) return JSON.stringify(err.error, null, 2);
    return String(err);
    }

    // Create a Drive folder (optionally inside a parent)
    async function createDriveFolder(name, parentId) {
    try {
        const gapi = window.gapi;
        const resource = { name, mimeType: "application/vnd.google-apps.folder" };
        if (parentId) resource.parents = [parentId];

        const res = await gapi.client.drive.files.create({
        resource,
        fields: "id,name,webViewLink,parents",
        });
        const out = res.result || {};
        return { id: out.id, name: out.name, webViewLink: out.webViewLink };
    } catch (err) {
        console.error("createDriveFolder failed:", errMessage(err));
        throw err;
    }
    }

    async function createEditorsBriefingDocInFolder(videoFolderId) {
        const gapi = window.gapi;

        const briefingTitle = "Editors Briefing";
        const valueStatement =
            "No nudity, always keep it family friendly. " +
            "No bad language. Keep it tasteful always and avoid anything sexually suggestive.";
        const instructionsHeading = "Instructions";

        const fullText =
            `${briefingTitle}\n\n` +
            `${valueStatement}\n\n` +
            `${instructionsHeading}\n`;

        // 1) Create the doc
        const docRes = await gapi.client.docs.documents.create({
            resource: { title: briefingTitle },
        });
        const documentId = docRes.result.documentId;

        const titleLen = briefingTitle.length;
        const valueLen = valueStatement.length;
        const instructionsLen = instructionsHeading.length;

        // 2) Insert text + formatting
        await gapi.client.docs.documents.batchUpdate({
            documentId,
            resource: {
            requests: [
                // Insert all the text at the beginning
                {
                insertText: {
                    location: { index: 1 },
                    text: fullText,
                },
                },
                // Title style for "Editors Briefing"
                {
                updateParagraphStyle: {
                    range: {
                    startIndex: 1,
                    endIndex: 1 + titleLen + 1, // include newline
                    },
                    paragraphStyle: { namedStyleType: "TITLE" },
                    fields: "namedStyleType",
                },
                },
                // Italic value statement
                {
                updateTextStyle: {
                    range: {
                    startIndex: 1 + titleLen + 2, // after "\n\n"
                    endIndex: 1 + titleLen + 2 + valueLen,
                    },
                    textStyle: { italic: true },
                    fields: "italic",
                },
                },
                // Heading style for "Instructions"
                {
                updateParagraphStyle: {
                    range: {
                    startIndex:
                        1 + titleLen + 2 + valueLen + 2, // after value + "\n\n"
                    endIndex:
                        1 +
                        titleLen +
                        2 +
                        valueLen +
                        2 +
                        instructionsLen +
                        1, // include newline
                    },
                    paragraphStyle: { namedStyleType: "HEADING_2" },
                    fields: "namedStyleType",
                },
                },
            ],
            },
        });

        // 3) Move doc into 03_Video folder
        const meta = await gapi.client.drive.files.get({
            fileId: documentId,
            fields: "parents",
        });
        const previousParents = (meta.result.parents || []).join(",");

        await gapi.client.drive.files.update({
            fileId: documentId,
            addParents: videoFolderId,
            removeParents: previousParents || undefined,
            fields: "id,parents",
        });

        return documentId;
        }

    // Move a file into a folder (Drive v3 best practice: add new parent, remove previous)
    // Move file to a folder (unchanged helper)
    async function moveFileToFolder(fileId, newParentId) {
    const gapi = window.gapi;
    const getRes = await gapi.client.drive.files.get({ fileId, fields: "parents" });
    const previousParents = (getRes.result.parents || []).join(",");
    await gapi.client.drive.files.update({
        fileId,
        addParents: newParentId,
        removeParents: previousParents || undefined,
        fields: "id, parents",
    });
    }

    // ---- SHEET: create with title + force-rename fallback
// ---- SHEET: create with title, set title via Sheets API, force-rename via Drive as fallback
    async function createSheetInFolder(folderId, row, fileName) {
    const gapi = window.gapi;

    // 1) Create (pass a title, but we won't rely on it)
    const createRes = await gapi.client.sheets.spreadsheets.create({
        properties: { title: fileName },
    });
    const spreadsheetId = createRes.result.spreadsheetId;

    // 2) Move to folder
    await moveFileToFolder(spreadsheetId, folderId);

    // 3) Explicitly set the spreadsheet title via Sheets API (most reliable)
    await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
        requests: [
            {
            updateSpreadsheetProperties: {
                properties: { title: fileName },
                fields: "title",
            },
            },
        ],
        },
    });

    // 4) As an extra safety, rename via Drive metadata too (handles any residual cache)
    await gapi.client.drive.files.update({
        fileId: spreadsheetId,
        resource: { name: fileName },
        fields: "id, name",
    });

    // 5) Write your values & basic formatting
    const values = [
        ["Channel", "Subs", "Month Views", "Rev Last Mon", "RPM"],
        [
        row?.channel_name ?? "",
        row?.sub_count ?? "",
        row?.views_last_month ?? "",
        row?.revenue_last_month ?? "",
        row?.rpm ?? "",
        ],
    ];

    await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "A1:E2",
        valueInputOption: "RAW",
        resource: { values },
    });

    await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
        requests: [
            {
            repeatCell: {
                range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
                cell: { userEnteredFormat: { textFormat: { bold: true } } },
                fields: "userEnteredFormat.textFormat.bold",
            },
            },
            {
            autoResizeDimensions: {
                dimensions: { sheetId: 0, dimension: "COLUMNS", startIndex: 0, endIndex: 5 },
            },
            },
        ],
        },
    });

    // optional: read back the name to verify
    const meta = await gapi.client.drive.files.get({ fileId: spreadsheetId, fields: "id, name" });
    console.log("Sheet title now:", meta.result.name);

    return spreadsheetId;
    }



    // ---- DOC: create with title + force-rename fallback
    async function createDocInFolder(folderId, row, fileName) {
    const gapi = window.gapi;

    // 1) Create with the title you want
    const docRes = await gapi.client.docs.documents.create({ title: fileName });
    const documentId = docRes.result.documentId;

    // 2) Move it into the folder
    await moveFileToFolder(documentId, folderId);

    // 3) Force name (fallback) in case it shows as Untitled
    await gapi.client.drive.files.update({
        fileId: documentId,
        resource: { name:fileName  },
        fields: "id, name",
    });

    // 4) Insert content (unchanged)
    const intro =
        `Channel: ${row?.channel_name || ""}\n` +
        `Subs: ${row?.sub_count || ""}\n` +
        `Monthly Views: ${row?.views_last_month || ""}\n` +
        `Revenue Last Month: ${row?.revenue_last_month || ""}\n\nNotes:\n`;

    await gapi.client.docs.documents.batchUpdate({
        documentId,
        resource: { requests: [{ insertText: { text: intro, location: { index: 1 } } }] },
    });

    return documentId;
    }
    // ---- constants for naming

    function slugify(s) {
    return (s || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    function today() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getMonth()+1)}${pad(d.getDate())}${d.getFullYear()}`;
    }

    // Create (or find) the global "Channels" root
    async function ensureChannelsRoot() {
    const gapi = window.gapi;
    // search for folder named "Channels" in My Drive
    const q = `mimeType='application/vnd.google-apps.folder' and name='Channels' and trashed=false`;
    const res = await gapi.client.drive.files.list({ q, fields: "files(id,name)" });
    if (res.result.files && res.result.files.length) return res.result.files[0];

    // create it
    const create = await gapi.client.drive.files.create({
        resource: { name: "Channels", mimeType: "application/vnd.google-apps.folder" },
        fields: "id,name,webViewLink",
    });
    return create.result;
    }


    async function ensureTrackerHeaders(spreadsheetId) {
        const gapi = window.gapi;
        const res = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "A1:O1",
        });
        const haveHeaders = res.result.values && res.result.values[0] && res.result.values[0].length > 0;
        if (haveHeaders) return;

        const headers = [[
        "project_id","slug","title","status",
        "publish_date","publish_time","description",
        "channel_id","channel_folder_id","project_folder_id",
        "script_doc_id","thumb_file_id","video_file_id",
        "brief_doc_id","project_sheet_id","youtube_video_id",
        "sheet_row_index"
    ]];

        // const headers = [[
        //     "project_id","slug","title","status","publish_date",
        //     "channel_id","channel_folder_id","project_folder_id",
        //     "script_doc_id","thumb_file_id","video_file_id",
        //     "brief_doc_id","project_sheet_id","youtube_video_id","sheet_row_index"
        // ]];

        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId,
            range: "A1:Q1",
            valueInputOption: "RAW",
            resource: { values: headers },
        });
    }
    // Create (or find) a channel root folder + tracker sheet
// Create (or find) a channel root folder + tracker sheet using ONLY the name you pass in
    async function ensureChannelRootAndTracker(channelRow, fileName) {
    const gapi = window.gapi;
    const channelsRoot = await ensureChannelsRoot();

    // 1) Folder name from your input
    const channelSlug = slugify(fileName);
    const folderName = channelSlug; // or `${channelSlug}_${channelRow.channel_id}` if you want uniqueness

    // 2) Find/create channel folder under Channels root
    const q = `'${channelsRoot.id}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
    const res = await gapi.client.drive.files.list({ q, fields: "files(id,name)" });
    let channelFolder = (res.result.files || [])[0];
    if (!channelFolder) {
        const created = await gapi.client.drive.files.create({
        resource: {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: [channelsRoot.id],
            appProperties: { channel_id: String(channelRow.channel_id) }, // optional metadata
        },
        fields: "id,name,webViewLink",
        });
        channelFolder = created.result;
    }

    // 3) Ensure Projects subfolder
    const qProj = `'${channelFolder.id}' in parents and mimeType='application/vnd.google-apps.folder' and name='Projects' and trashed=false`;
    const projRes = await gapi.client.drive.files.list({ q: qProj, fields: "files(id,name)" });
    let projectsFolder = (projRes.result.files || [])[0];
    if (!projectsFolder) {
        const created = await gapi.client.drive.files.create({
        resource: { name: "Projects", mimeType: "application/vnd.google-apps.folder", parents: [channelFolder.id] },
        fields: "id,name",
        });
        projectsFolder = created.result;
    }

    // 4) Ensure tracker sheet exists
    const trackerName = "_Channel_Tracker";
    const qSheet = `'${channelFolder.id}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and name='${trackerName}' and trashed=false`;
    const sheetRes = await gapi.client.drive.files.list({ q: qSheet, fields: "files(id,name)" });
    let trackerSheetId;
    if (sheetRes.result.files && sheetRes.result.files.length) {
        trackerSheetId = sheetRes.result.files[0].id;
    } else {
        const createRes = await gapi.client.sheets.spreadsheets.create({ properties: { title: trackerName } });
        trackerSheetId = createRes.result.spreadsheetId;
        await moveFileToFolder(trackerSheetId, channelFolder.id);
    }

    // 5) NOW add headers (trackerSheetId is known)
    await ensureTrackerHeaders(trackerSheetId);

    return {
        channelsRootId: channelsRoot.id,
        channelFolderId: channelFolder.id,
        projectsFolderId: projectsFolder.id,
        trackerSheetId,
    };
    }

    //Google sheets append rows with correct columns
    async function appendTrackerRow(spreadsheetId, row) {
    const gapi = window.gapi;
    // row must be an array of length 15 (A..O)
    const res = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "A:O",
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: { values: [row] },
    });

    // Capture the row index Google wrote to, so we can update later
    const updatedRange = res.result.updates.updatedRange; // e.g., "Sheet1!A2:O2"
    const rowIndex = parseInt(updatedRange.split("!")[1].split(":")[0].match(/\d+/)[0], 10);

    // Write the row index into column O
    await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `O${rowIndex}`,
        valueInputOption: "RAW",
        resource: { values: [[rowIndex]] },
    });

    return rowIndex;
    }
    // Ensure status buckets under Projects
    async function ensureProjectBuckets(projectsFolderId) {
    const gapi = window.gapi;
    const needed = ["0_Current", "1_Queue", "9_Archive"];
    const res = await gapi.client.drive.files.list({
        q: `'${projectsFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id,name)",
    });
    const byName = Object.fromEntries((res.result.files || []).map(f => [f.name, f.id]));
    const out = { currentId: byName["0_Current"], queueId: byName["1_Queue"], archiveId: byName["9_Archive"] };

    for (const name of needed) {
        if (!byName[name]) {
        const created = await gapi.client.drive.files.create({
            resource: { name, mimeType: "application/vnd.google-apps.folder", parents: [projectsFolderId] },
            fields: "id,name",
        });
        out[name === "0_Current" ? "currentId" : name === "1_Queue" ? "queueId" : "archiveId"] = created.result.id;
        }
    }
    return out;
    }

    // Move a project folder to a bucket (Queue/Archive)
    async function moveProjectToBucket(projectFolderId, bucketFolderId) {
    const gapi = window.gapi;
    const meta = await gapi.client.drive.files.get({ fileId: projectFolderId, fields: "parents" });
    const previousParents = (meta.result.parents || []).join(",");
    await gapi.client.drive.files.update({
        fileId: projectFolderId,
        addParents: bucketFolderId,
        removeParents: previousParents || undefined,
        fields: "id,parents",
    });
    }

    // Create or refresh a CURRENT shortcut for a project
    async function upsertCurrentShortcut(projectsCurrentFolderId, projectFolderId, projectName) {
    const gapi = window.gapi;
    // Try to find existing shortcut pointing to this project
    const q = `'${projectsCurrentFolderId}' in parents and mimeType='application/vnd.google-apps.shortcut' and trashed=false`;
    const res = await gapi.client.drive.files.list({ q, fields: "files(id,name,shortcutDetails)" });
    const existing = (res.result.files || []).find(f => f.shortcutDetails && f.shortcutDetails.targetId === projectFolderId);

    const shortcutName = `CURRENT — ${projectName}`;
    if (existing) {
        // make sure name is up to date
        if (existing.name !== shortcutName) {
        await gapi.client.drive.files.update({ fileId: existing.id, resource: { name: shortcutName }, fields: "id" });
        }
        return existing.id;
    }
    // create new shortcut
    const created = await gapi.client.drive.files.create({
        resource: {
        name: shortcutName,
        mimeType: "application/vnd.google-apps.shortcut",
        parents: [projectsCurrentFolderId],
        shortcutDetails: { targetId: projectFolderId },
        },
        fields: "id",
    });
    return created.result.id;
    }

    // Remove ALL shortcuts in 0_Current (so only one current project shows)
    async function clearCurrentShortcuts(projectsCurrentFolderId) {
    const gapi = window.gapi;
    const q = `'${projectsCurrentFolderId}' in parents and mimeType='application/vnd.google-apps.shortcut' and trashed=false`;
    const res = await gapi.client.drive.files.list({ q, fields: "files(id)" });
    for (const f of (res.result.files || [])) {
        await gapi.client.drive.files.update({
        fileId: f.id,
        resource: { trashed: true },
        fields: "id",
        });
    }
    }


// Create a new project under a channel
// Create one project under a channel and append a tracker row
// baseName = the name you typed in the dialog (used for titles)
// Create one project under a channel and append a tracker row
    async function createProject(channelRow, baseName) {
    const gapi = window.gapi;

    // Get (or create) channel containers and tracker (channel folder name comes from baseName)
    const { projectsFolderId, trackerSheetId, channelFolderId } =
        await ensureChannelRootAndTracker(channelRow, baseName);

    // Deterministic project id / folder name
    const slug = slugify(baseName);
    const projectId = `${today()}_${slug}`;
    const projectFolderName = projectId;

    // Create project folder with metadata
    const proj = await gapi.client.drive.files.create({
        resource: {
        name: projectFolderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [projectsFolderId],
        appProperties: {
            channel_id: String(channelRow.channel_id),
            project_id: projectId,
            slug
        },
        },
        fields: "id,name",
    });

    // Subfolders
    const makeSub = async (name) => {
        const f = await gapi.client.drive.files.create({
        resource: { name, mimeType: "application/vnd.google-apps.folder", parents: [proj.result.id] },
        fields: "id,name",
        });
        return f.result.id;
    };
    const scriptFolderId = await makeSub("01_Script");
    const thumbFolderId  = await makeSub("02_Thumbnail");
    const videoFolderId  = await makeSub("03_Video");
    await makeSub("04_Assets");

    // NEW: Editors Briefing doc inside 03_Video
    const editorsDocId = await createEditorsBriefingDocInFolder(videoFolderId);

    // Ensure status buckets and put the new project into 1_Queue
    const { currentId, queueId, archiveId } = await ensureProjectBuckets(projectsFolderId);
    await moveProjectToBucket(proj.result.id, queueId);

    // ✅ Make this the ONLY "current" project for freelancers
    await clearCurrentShortcuts(currentId);                                     // remove old CURRENT shortcuts
    await upsertCurrentShortcut(currentId, proj.result.id, projectFolderName);  // add CURRENT — <project>

    // Brief Doc (in Script folder) and per-project Sheet (in project root)
    const briefDocId = await createDocInFolder(scriptFolderId, channelRow, baseName);          // title = baseName
    const sheetId    = await createSheetInFolder(proj.result.id, channelRow, `${baseName} — Sheet`);

    // Append tracker row (A..O must match your headers)
    // A project_id | B slug | C title | D status | E publish_date
    // F channel_id | G channel_folder_id | H project_folder_id
    // I script_doc_id | J thumb_file_id | K video_file_id
    // L brief_doc_id | M project_sheet_id | N youtube_video_id | O sheet_row_index
    const rowValues = [
        projectId, slug, baseName, "New",
        "", "", "",   // publish_date, publish_time, description
        channelRow.channel_id, channelFolderId, proj.result.id,
        briefDocId, "", "", briefDocId, sheetId, "", ""
    ];
    // const rowValues = [
    //     projectId,               // A
    //     slug,                    // B
    //     baseName,                // C
    //     "New",                   // D
    //     "",                      // E
    //     channelRow.channel_id,   // F
    //     channelFolderId,         // G
    //     proj.result.id,          // H
    //     briefDocId,              // I
    //     "",                      // J (will be auto-filled later)
    //     "",                      // K (will be auto-filled later)
    //     briefDocId,              // L
    //     sheetId,                 // M
    //     "",                      // N
    //     ""                       // O (appendTrackerRow will set)
    // ];
    const sheetRowIndex = await appendTrackerRow(trackerSheetId, rowValues);

    return {
        projectId,
        projectFolderId: proj.result.id,
        scriptFolderId,
        editorsDocId,          // 👈 NEW
        thumbFolderId,
        videoFolderId,
        briefDocId,
        sheetId,
        trackerSheetId,
        sheetRowIndex,
        buckets: { currentId, queueId, archiveId },
    };
    }





    const openFolderDialog = (row) => {
        setRowForFolder(row);
        setFolderName(row?.channel_name ?? "New Folder");
        setFolderDlgOpen(true);
    };
    // open dialog

    // close dialog
    const closeFolderDialog = () => {
    setFolderDlgOpen(false);
    setSubmitAttempt(false);                 // reset when closing
    };


    const handleTestSubmit = () => {
    console.log("TEST — folder name:", folderName, "row:", rowForFolder);
    toast.current?.show({
        severity: "success",
        summary: "Form works",
        detail: `You entered: "${folderName}"`,
        life: 2500,
    });
    setFolderDlgOpen(false);
    };

    const driveButtonBody = (rowData) => (
        <PrimeButton
        label="Create"
        icon="pi pi-folder"
        size="small"
        onClick={() => {
            setRowForFolder(rowData);
            setFolderName(rowData?.channel_name || "New Folder");
            setSubmitAttempt(false);
            setFolderDlgOpen(true);
        }}
        className="p-button-sm"
        />
    );


    // submit from modal
    const handleCreateAll = async () => {
        setSubmitAttempt(true);
        const base = (folderName || "").trim();
        if (!base) return;

        try {
            await ensureAuthorized();

            // NEW: create a full project for this channel row
            const {
            projectId,
            projectFolderId,
            scriptFolderId,
            thumbFolderId,
            videoFolderId,
            briefDocId,
            sheetId,
            } = await createProject(rowForFolder, base);

            console.log("Project created:", {
            projectId, projectFolderId, scriptFolderId, thumbFolderId, videoFolderId, briefDocId, sheetId
            });

            toast.current?.show({
            severity: "success",
            summary: "Project ready",
            detail: `Folders & docs created for "${base}"`,
            life: 3000,
            });

            setFolderDlgOpen(false);
        } catch (err) {
            const msg = errMessage(err);
            console.error("Drive error:", msg, err);
            toast.current?.show({ severity: "error", summary: "Drive error", detail: msg, life: 6000 });
        }
    };

    // const handleCreateAll = async () => {
    //     setSubmitAttempt(true);
    //     const base = (folderName || "").trim();
    //     if (!base) return;

    //     try {
    //         await ensureAuthorized();                 // GIS auth

    //         // 1) create the folder named exactly as typed
    //         const folder = await createDriveFolder(base);

    //         // 2) choose file titles (use base, or add suffixes)
    //         const sheetTitle = `${base} — Sheet`;     // or just: base
    //         const docTitle   = `${base} — Summary`;   // or just: base

    //         // 3) pass the titles into the helpers
    //         const sheetId = await createSheetInFolder(folder.id, rowForFolder, sheetTitle);
    //         const docId   = await createDocInFolder(folder.id, rowForFolder, docTitle);

    //         console.log("Drive created:", { folder, sheetId, docId });

    //         toast.current && toast.current.show({
    //         severity: "success",
    //         summary: "Created in Drive",
    //         detail: `Folder: ${folder.name}`,
    //         life: 3000,
    //         });

    //         setFolderDlgOpen(false);
    //     } catch (err) {
    //         const msg = errMessage(err);
    //         console.error("Drive error:", msg, err);
    //         toast.current && toast.current.show({
    //         severity: "error",
    //         summary: "Drive error",
    //         detail: msg,
    //         life: 6000,
    //         });
    //     }
    // };


    //END OF GOOOGLE DRIVE CODE


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


    // const [expandedRows, setExpandedRows] = useState({}); // object form with dataKey

      // 🔹 the table’s data
    const [channels, setChannels] = useState([]);
    const [expandedRows, setExpandedRows] = useState({}); // object form with dataKey
    const allowExpansion = (row) => Array.isArray(row?.top3_videos) && row.top3_videos.length > 0;
    const getHeroVideo = (row) => {
        const list = Array.isArray(row?.top3_videos) ? row.top3_videos : [];
        if (!list.length) return null;
        return list.reduce((best, v) => (Number(v.views ?? 0) > Number(best.views ?? 0) ? v : best), list[0]);
    };
    const [popThumb, setPopThumb] = useState({}); // object form with dataKey
    const [totalRecords, setTotalRecords] = useState(0); // ← NEW
    const [vidCount, setVidCount] = useState(0)
    const [channelCount, setChannelCount] = useState(0)
    console.log('totalRecords:', totalRecords);

    // // helper (put near top of file)
    // const toBoolNull = (v) =>
    // v === true || v === 'true' ? true :
    // v === false || v === 'false' ? false :
    // null;
    


    useEffect(() => {
        if (hitDatabase){
            console.log(`Pulling Database Leads:`)
            axios.get(`${baseUrl}/dashboard`)
                // .then((dbResult) => {
                //     // always log the data, not the axios wrapper
                //     console.log("dashboard payload:", dbResult.data);

                //     const payload = dbResult.data;

                //     // items can be either payload.items (new shape) or payload (legacy array)
                //     const items = Array.isArray(payload?.items)
                //         ? payload.items
                //         : Array.isArray(payload)
                //         ? payload
                //         : [];

                //     // counts from API, with fallbacks
                //     const vidTotal   = payload?.vid_count ?? items.length;
                //     const chanTotal = payload?.channel_count ?? items.length;
                //         // pull counts if present, else fall back to item length

                //     setVidCount(vidTotal)
                //     setChannelCount(chanTotal)
                    

                //     const raw = Array.isArray(dbResult.data?.items) ? dbResult.data?.items : [];
                //     const rows = raw.map((r, i) => {
                //         const id = String(r.channel_id ?? i);
                //         const hero = getHeroVideo(r);
                //         const topVidViews = hero ? Number(hero.views ?? 0) : null;
                //         // console.log('topVidViews:', topVidViews);
                //         // console.log('row:', r.channel_name, 'hero:', hero);

                //         return {
                //             ...r,                 // copy all original row fields
                //             channel_id: id,       // ensure dataKey is a string
                //             heroVideo: hero,      // stash the most-viewed video object
                //             heroThumbUrl: hero?.thumb_url, // convenience field for the thumbnail
                //             topVidViews,

                //                           // ✅ normalize so editors/bodies always see boolean/null
                //             is_monetized: toBoolNull(r.is_monetized),
                //             interested: r.interested ?? false,
                //             not_interested: r.not_interested ?? false,
                //         };

                //     });

                //     setTotalRecords(payload?.items.length); // ← NEW

                //     setChannels(rows);
                //     setWindowCount(rows.length);
                //     // interested: r.interested ?? false,
                //     // not_interested: r.not_interested ?? false,
                //     const initialExpanded = rows.reduce((acc, row) => {
                //     if (allowExpansion(row)) acc[row.channel_id] = true;
                //     return acc;
                //     }, {});
                //     setExpandedRows({});

                //     // (optional) quick sanity logs
                //     console.log("channels:", rows);
                //     console.log("expandedRows:", initialExpanded);
                // })
                .then((dbResult) => {
                console.log("dashboard payload:", dbResult.data);

                const payload = dbResult.data;

                // 1) Normalize items (works if API returns { items: [...] } OR just [...])
                const items = Array.isArray(payload?.items)
                    ? payload.items
                    : Array.isArray(payload)
                    ? payload
                    : [];

                // 2) Use items for counts
                const vidTotal   = payload?.vid_count ?? items.length;
                const chanTotal  = payload?.channel_count ?? items.length;

                setVidCount(vidTotal);
                setChannelCount(chanTotal);
                setTotalRecords(items.length);        // ✅ FIXED (no payload?.items.length)

                // 3) Build rows from items (NOT from dbResult.data?.items anymore)
                const rows = items.map((r, i) => {
                    const id   = String(r.channel_id ?? i);
                    const hero = getHeroVideo(r);
                    const topVidViews = hero ? Number(hero.views ?? 0) : null;

                    return {
                    ...r,
                    channel_id: id,
                    heroVideo: hero,
                    heroThumbUrl: hero?.thumb_url,
                    topVidViews,
                    is_monetized: toBoolNull(r.is_monetized),
                    interested: r.interested ?? false,
                    not_interested: r.not_interested ?? false,
                    };
                });

                setChannels(rows);
                setWindowCount(rows.length);

                const initialExpanded = rows.reduce((acc, row) => {
                    if (allowExpansion(row)) acc[row.channel_id] = true;
                    return acc;
                }, {});
                setExpandedRows({});
                })
                .catch((err) => {
                    console.error("Dashboard load failed:", err);
                })

            setHitDatabase(false)
            // initFilters();
        }

    }, [hitDatabase]);



    const monthOptions = [
    { label: 'All time', value: null },
    { label: 'Last 1 month', value: 1 },
    { label: 'Last 2 months', value: 2 },
    { label: 'Last 3 months', value: 3 },
    { label: 'Last 4 months', value: 4 },
    { label: 'Interested', value: 'INTERESTED' },   // 👈 new

    ];

    // const [first, setFirst] = useState(0); // make sure this exists at top-level

    const windowSelector = (
    <div className="flex items-center gap-2">
        <span className="text-sm">Date Filter:</span>
        <Dropdown
        value={monthWindow}
        options={monthOptions}
        optionLabel="label"
        optionValue="value"
        // onChange={(e) => {
        //     setMonthWindow(e.value);

        //     // update DataTable filters for custom rule
        //     setFilters((f) => ({
        //     ...f,
        //     first_upload_date: { ...f.first_upload_date, value: e.value },
        //     }));

        //     // go back to page 1 (PrimeReact has no resetPage)
        //     setFirst(0);

        //     // nudge table filter with our custom operator
        //     if (dt.current?.filter) {
        //     dt.current.filter(e.value, 'first_upload_date', 'withinMonths');
        //     }
        // }}
        onChange={(e) => {
        const v = e.value;
        setMonthWindow(v);

        if (v === 'INTERESTED') {
            setFilters(f => ({
            ...f,
            // clear the month window
            first_upload_date: { ...f.first_upload_date, value: null },
            // turn on interested filter
            interested: { value: true, matchMode: FilterMatchMode.EQUALS }
            }));
        } else {
            setFilters(f => ({
            ...f,
            interested: { value: null, matchMode: FilterMatchMode.EQUALS },  // clear interested filter
            first_upload_date: { ...f.first_upload_date, value: v }          // keep your withinMonths rule
            }));
        }
        }}

        className="w-12rem"
        placeholder="All time"
        appendTo={document.body}
        />
    </div>
    );



    // THE BUTTON CODE 
    // const driveButtonBody = (row) => (
    //     <PrimeButton
    //         icon="pi pi-folder-plus"
    //         rounded
    //         severity="info"
    //         aria-label="Open folder form"
    //         onClick={() => openFolderDialog(row)}
    //         tooltip="Create folder"
    //     />
    
    // );
    // put near your table component scope


    

    // const driveButtonBody = (row) => {
    //     return (
    //     <div className="flex flex-wrap gap-2">
    //         {/* <PrimeButton label="Export" icon="pi pi-upload" className="p-button-help" onClick={() => openFolderDialog(row)} /> */}
    //         <PrimeButton icon="pi pi-pencil" rounded outlined  onClick={() => openFolderDialog(row)} />

    //     </div>
    //     );};
    // GOOGLE DRIVE CODE TO CREATE FOLDERS

    // main-row thumbnail column (uses the precomputed field)


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
            
            axios.patch(`/channel/${patchData.channel_id}`, patchData)
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


    // const onRowEditComplete = (e) => {
    //     let { newData, index } = e;
    //     setPatchData(newData)
    //     setSubmitEdit(true)
    // };
// ✅ build a tiny patch from row changes + normalize the date
    // const onRowEditComplete = (e) => {
    // const { newData, data: oldData } = e; // oldData is the row before edit
    // const id = newData.channel_id;

    // // Only allow these fields to be changed via the UI
    // const editable = [
    //     'is_monetized',
    //     'revenue_last_month',
    //     'rpm_low',
    //     'rpm_high',
    //     'first_upload_date',
    //     'claimed_by',
    //     // 'interested', // <-- exclude so you don't nuke the filter accidentally
    // ];

    // const patch = {};
    // editable.forEach((k) => {
    //     if (newData[k] !== oldData[k] && newData[k] !== undefined) {
    //     patch[k] = newData[k];
    //     }
    // });

    // // Nothing changed → bail
    // if (Object.keys(patch).length === 0) return;

    // // If you edit the date, normalize to ISO string
    // if (patch.first_upload_date instanceof Date) {
    //     patch.first_upload_date = patch.first_upload_date.toISOString();
    // }

    // // Trigger your existing effect-driven save
    // setPatchData({ channel_id: id, ...patch });
    // setSubmitEdit(true);
    // };
    const onRowEditComplete = (e) => {
        const { newData, data: oldData } = e;
        const patch = {};
        const editable = ['is_monetized','revenue_last_month','rpm_low','rpm_high','first_upload_date','claimed_by'];

        // coerce & diff
        const normalized = { ...newData, is_monetized: toBoolNull(newData.is_monetized) };
        editable.forEach(k => {
            if (normalized[k] !== oldData[k] && normalized[k] !== undefined) patch[k] = normalized[k];
        });
        if (patch.first_upload_date instanceof Date) patch.first_upload_date = patch.first_upload_date.toISOString();
        if (Object.keys(patch).length === 0) return;

        setPatchData({ channel_id: newData.channel_id, ...patch });
        setSubmitEdit(true);
    };




    // put near your other helpers
    const markNotInterested = async (row) => {
    const id = row.channel_id;

    // snapshot for rollback
    const snapshot = channels;

    // ✅ optimistic UI: remove from table immediately
    setChannels(prev => prev.filter(r => r.channel_id !== id));

    try {
        await axios.patch(`/channel/${id}`, { not_interested: true });
        toast.current?.show({
        severity: 'success',
        summary: 'Hidden',
        detail: 'Marked as not interested',
        life: 1500
        });
    } catch (err) {
        // 🔁 rollback on failure
        setChannels(snapshot);
        toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not update interest flag',
        life: 2500
        });
    }
    };

    const notInterestedBody = (row) => (
    <PrimeButton
        icon="pi pi-times"
        rounded
        text
        severity="danger"
        aria-label="Not interested"
        className="ni-btn"
        // tooltip="Hide this channel"
        onClick={() => markNotInterested(row)}
    />
    );

    // mark as INTERESTED (keeps row visible)
    // keep the SAME name: markInterested
    const markInterested = async (row) => {
    const id = row.channel_id;
    const next = !Boolean(row.interested); // flip current value

    // optimistic UI
    setChannels(prev =>
        prev.map(r => (r.channel_id === id ? { ...r, interested: next } : r))
    );

    try {
        await axios.patch(`${baseUrl}/channel/${id}`, { interested: next });
        toast.current?.show({
        severity: 'success',
        summary: 'Saved',
        detail: next ? 'Marked as interested' : 'Removed interested',
        life: 1500
        });
    } catch (err) {
        // rollback on failure
        setChannels(prev =>
        prev.map(r => (r.channel_id === id ? { ...r, interested: !next } : r))
        );
        toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not update interested flag',
        life: 2500
        });
    }
    };

    // keep the SAME name: interestedBody (if you’re already using it)
    const interestedBody = (row) => (
    <PrimeButton
        icon={row.interested ? 'pi pi-star-fill' : 'pi pi-star'}
        rounded
        text
        severity="success"
        aria-label="Interested"
        onClick={() => markInterested(row)}
        tooltip={row.interested ? 'Unmark interested' : 'Mark interested'}
    />
    );

    // const markInterested = async (row) => {
    // const id = row.channel_id;

    // // optimistic update: flip the flag in-place
    // setChannels(prev =>
    //     prev.map(r => (r.channel_id === id ? { ...r, interested: true } : r))
    // );

    // try {
    //     await axios.patch(`${baseUrl}/channel/${id}`, { interested: true });
    //     toast.current?.show({
    //     severity: 'success',
    //     summary: 'Saved',
    //     detail: 'Marked as interested',
    //     life: 1500
    //     });
    // } catch (err) {
    //     // rollback on failure
    //     setChannels(prev =>
    //     prev.map(r => (r.channel_id === id ? { ...r, interested: row.interested ?? false } : r))
    //     );
    //     toast.current?.show({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Could not update interested flag',
    //     life: 2500
    //     });
    // }
    // };

    // const interestedBody = (row) => (
    // <PrimeButton
    //     icon="pi pi-star"
    //     rounded
    //     text
    //     severity="success"
    //     aria-label="Interested"
    //     onClick={() => markInterested(row)}
    //     tooltip="Mark as interested"
    // />
    // );

    // (you already have notInterestedBody)


        // ✅ One tiny handler for all cells
    const onCellEditComplete = async (e) => {
    const { rowData, field, newValue, value: oldValue } = e; // value = old value
    const channel_id = rowData.channel_id;

    // No-op if it didn't change
    if ((oldValue ?? '') === (newValue ?? '')) return;

    // Optimistic UI
    setChannels(prev =>
        prev.map(r => (r.channel_id === channel_id ? { ...r, [field]: newValue } : r))
    );

    try {
        // Persist to backend
        await patchChannel(channel_id, { [field]: newValue });
        toast.current?.show({
        severity: 'success',
        summary: 'Saved',
        detail: `${field} updated`,
        life: 1500
        });
    } catch (err) {
        // Roll back on error
        setChannels(prev =>
        prev.map(r => (r.channel_id === channel_id ? { ...r, [field]: oldValue } : r))
        );
        toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not save change',
        life: 2500
        });
        // prevent PrimeReact from finalizing edit if you want:
        // e.originalEvent?.preventDefault?.();
    }
    };


// === helper to persist channel changes ===
    const patchChannel = async (channel_id, patch) => {
    try {
        await axios.patch(`${baseUrl}:5023/channel/${channel_id}`, patch);
        toast.current?.show({
        severity: "success",
        summary: "Saved",
        detail: "Channel updated",
        life: 2000
        });
    } catch (e) {
        toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Could not save channel",
        life: 3000
        });
        throw e;
    }
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => {
            console.log(e)
            console.log(e.target.value)
            options.editorCallback(e.target.value)}
         } />;
    };


    const header = (
    <div className="flex justify-content-between flex-wrap gap-3">
        <h4 className="m-2">Manage Leads</h4>
        <div className="flex gap-3">
        {windowSelector}
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search..." />
        </span>
        </div>
    </div>
    );

    // const header = (
    //         <div className="flex justify-content-between">
    //             <h4 className="m-2">Manage Leads</h4>
    //             <span className="p-input-icon-left">
    //                 <i className="pi pi-search" />
    //                 <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search..." />
    //             </span>
    //         </div>
    // );

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

        const heroThumbBody = (row) =>
    row.heroThumbUrl ? (
        <a href={row.heroVideo?.video_url} target="_blank" rel="noreferrer">
        <img
            src={row.heroThumbUrl}
            alt={row.heroVideo?.title || "Top video"}
            style={{ width: 96, height: 54, objectFit: "cover", borderRadius: 8 }}
        className="shadow-4"/>
        </a>
    ) : (
        "—"
    );

            const thumbBody = (row) =>
    row.heroThumbUrl ? (
        <a href={row.heroVideo?.video_url} target="_blank" rel="noreferrer">
        <img
            src={row.heroThumbUrl}
            alt={row.heroVideo?.title || "Top video"}
            style={{ width: 96, height: 54, objectFit: "cover", borderRadius: 8 }}
        className="shadow-4"/>
        </a>
    ) : (
        "—"
    );

    // simple body template
    const channelLinkBody = (row) => {
    if (!row.channel_url) return row.channel_name || "—";
    return (
        <a
        href={row.channel_url} target="_blank" rel="noreferrer" className="p-link underline" onClick={(e) => e.stopPropagation()} // optional: keep row/expander from reacting
        >
        {row.channel_name}
        </a>
    );
    };

    // ---- GETTING THE TIMESTAMP TO READ 2025-10-24T02:20:20.055Z, TO '2 Weeks Ago' ----
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    function timeAgo(input) {
        const d = new Date(input);
        if (!input || isNaN(d)) return '—';

        const now = new Date();
        // diff in seconds (negative = past)
        let diffSeconds = Math.round((d.getTime() - now.getTime()) / 1000);

        const units = [
            ['year',   60 * 60 * 24 * 365],
            ['month',  60 * 60 * 24 * 30],
            ['week',   60 * 60 * 24 * 7],
            ['day',    60 * 60 * 24],
            ['hour',   60 * 60],
            ['minute', 60],
            ['second', 1],
        ];

        for (const [unit, inSeconds] of units) {
            const value = diffSeconds / inSeconds;
            if (Math.abs(value) >= 1 || unit === 'second') {
            return rtf.format(Math.round(value), unit);
            }
        }
    }
    const firstUploadTextBody = (row) => {
        const iso = row.first_upload_date;   // adjust to your field name
        const pretty = timeAgo(iso);
        return <span title={iso}>{pretty}</span>; // title shows exact timestamp on hover
    };

    // works for a *video* row (inside the expanded table)
    const videoThumbBody = (vid) => {
    if (!vid?.thumb_url) return "—";
    return (
        <a href={vid.video_url} target="_blank" rel="noreferrer">
        <img
            src={vid.thumb_url}
            alt={vid.title}
            style={{ width: 96, height: 54, objectFit: "cover", borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()} // optional: avoid toggling row on click
        />
        </a>
    );
    };
    const videoTitleBody = (vid) =>
    vid?.title ? (
        <a href={vid.video_url} target="_blank" rel="noreferrer" className="underline">
        {vid.title}
        </a>
    ) : (
        "—"
    );

    // ####HELPERS FOR THE VIDEO TITLES
    const ytSearchUrl = (title) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(title || "")}`;

    const styles = {
    ellipsis1: {               // 1 line
        maxWidth: 420,
        display: "inline-block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    ellipsis2: {               // 2 lines
        maxWidth: 420,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        wordBreak: "break-word",
    },
    };

    const videoTitleBodyVideos = (vid) =>
    vid?.title ? (
        <a
        href={ytSearchUrl(vid.title)}
        target="_blank"
        rel="noreferrer"
        title={vid.title}                 // full title on hover
        onClick={(e) => e.stopPropagation()} // avoid toggling the row
        className="p-link"
        >
        <span style={styles.ellipsis2}>{vid.title}</span>
        </a>
    ) : (
        "—"
    );

    // helper (switch style)
    const getMonetization = (row) => {
    switch (row?.is_monetized) {
        case true:
        return { label: "$$", severity: "success" }; // green
        case false:
        return { label: "👎", severity: "danger" }; // red
        default:
        return { label: "??", severity: "warning" }; // yellow (optional)
    }
    };

    // column body
    const monetizationBody = (row) => {
        const { label, severity } = getMonetization(row);
        return <Tag value={label} severity={severity} rounded />;
    };

// utils
// Tiny helper: format as money, integers without decimals; otherwise one decimal.
    const fmtMoney = (n) => {
    if (!Number.isFinite(n)) return null;
    return (n % 1 === 0) ? n.toFixed(0) : n.toFixed(1);
    };

    // Build plain text for the RPM column.
    // Examples:
    //   low=1, high=5     → "$1–$5 RPM"
    //   low=2, high=null  → "$2 RPM"
    //   low=null, high=5  → "$5 RPM"
    //   both null/NaN     → "—"
    const getRpmText = (row) => {
    let low  = Number(row?.rpm_low);
    let high = Number(row?.rpm_high);

    const hasLow  = Number.isFinite(low);
    const hasHigh = Number.isFinite(high);

    if (!hasLow && !hasHigh) return "—";

    // If only one side exists, show that single value.
    if (hasLow && !hasHigh)  return `$${fmtMoney(low)} RPM`;
    if (!hasLow && hasHigh)  return `$${fmtMoney(high)} RPM`;

    // If both exist but are reversed, normalize (e.g., low=6, high=2 → "$2–$6 RPM").
    if (low > high) [low, high] = [high, low];

    return `$${fmtMoney(low)}–${fmtMoney(high)}`;
    };

    // Column body: pure text (no badges/tags).
    const rpmBody = (row) => {
    const text = getRpmText(row);
    return <span title={text}>{text}</span>;
    };

        // tiny numeric editor (allows blank -> null)
    const numberEditor = (options) => (
    <InputText
        type="number"
        value={options.value ?? ""}
        onChange={(e) => {
        const v = e.target.value;
        options.editorCallback(v === "" ? null : Number(v));
        }}
        style={{ width: 120 }}
    />
    );

    // show raw values or "—"
    const rpmLowBody  = (row) => (Number.isFinite(row.rpm_low)  ? row.rpm_low  : "—");
    const rpmHighBody = (row) => (Number.isFinite(row.rpm_high) ? row.rpm_high : "—");

    // Add these two columns near your RPM display column



    // const fmtMoney = (n) => {
    // if (!Number.isFinite(n)) return null;
    // // show integers without decimals; otherwise one decimal
    // return (n % 1 === 0) ? n.toFixed(0) : n.toFixed(1);
    // };

    // // build the badge model from row
    // const getRpmBadge = (row) => {
    // const low  = Number(row?.rpm_low);
    // const high = Number(row?.rpm_high);

    // if (Number.isFinite(low) && Number.isFinite(high) && high > 0) {
    //     const label = `$${fmtMoney(low)}–$${fmtMoney(high)} `;
    //     return { label, severity: "success" };         // green
    // }

    // if (Number.isFinite(low) || Number.isFinite(high)) {
    //     const one = Number.isFinite(low) ? low : high;
    //     const label = `$${fmtMoney(one)} RPM`;
    //     return { label, severity: "warning" };         // yellow (partial)
    // }

    // return { label: "No RPM", severity: "danger" };  // red (missing)
    // };

    // // column body
    // const rpmBody = (row) => {
    // const { label, severity } = getRpmBadge(row);
    // return <Tag value={label} severity={severity} rounded />;
    // };


    const topVidViewsBody = (row) => {
    if (typeof row.topVidViews === "number") {
        return row.topVidViews.toLocaleString();
    } else {
        return "—";
    }
    };


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
// imports

    // pretty display: "Oct 08, 2025" (and keep your "x months ago" if you like)
    const firstUploadPretty = (row) => {
    const v = row.first_upload_date;
    if (!v) return "—";
    const d = new Date(v);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    };

    // cell editor (Calendar)
    const firstUploadEditor = (options) => (
    <Calendar
        value={options.value ? new Date(options.value) : null}
        onChange={(e) => options.editorCallback(e.value)}   // e.value is a Date
        showIcon
        dateFormat="M dd, yy"   // visual only
        touchUI
    />
    );

    // small helper: convert to ISO for the API
// helpers
    const toBoolNull = (v) => (v === true || v === 'true') ? true
    : (v === false || v === 'false') ? false
    : null;

    const monetizedOptions = [
    { label: '?? (Unknown)', value: null },
    { label: '$$ (Yes)',    value: true },
    { label: '👎 (No)',     value: false },
    ];

    // editor used by the Column
    const monetizedEditor = (options) => (
    <Dropdown
        value={toBoolNull(options.value)}
        options={monetizedOptions}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => options.editorCallback(e.value)}   // send true/false/null
        placeholder="Select…"
        appendTo={document.body}     // avoids z-index issues (panel behind table)
        className="w-12rem"
    />
    );

    //CODE FOR THE NICHE DROPDOWN BUTTON ON THE DATATABLE
    // Title-case helper
    const toTitle = (s) =>
    (s || '').replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());

    const nicheOptions = React.useMemo(
    () => [...new Set((channels || []).map(r => r?.search_term).filter(Boolean))]
            .map(v => ({ label: v.replace(/\b\w/g, c => c.toUpperCase()), value: v })),
    [channels]
    );

    const nicheRowFilter = (options) => (
    <Dropdown
        value={options.value}
        options={nicheOptions}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Any"
        showClear
        className="p-column-filter w-12rem"
        appendTo={document.body}
    />
    );




    return <div className="App">
            <Toast ref={toast} />
            <div className="sideby"> 
                {/* <Smallinforectangle name="Good Leads" number={totalRecords} /> */}
                <Smallinforectangle name="Good Leads" number={windowCount} />
                <Smallinforectangle name="videos" number={vidCount}/>
                <Smallinforectangle name="channel" number={channelCount}/>

                {/* meaning={userInformation.industry.substring(0,26) + '...' }/> */}
                {/* <Smallinforectangle name="Locations" emoji="fa fa-edit float-end" meaning={"Utah"}/> */}
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

                {/* <DataTable ref={dt} sortField="lead_id" sortOrder={-1}  value={leads} stripedRows paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50, 500]}size="large" editMode="row" dataKey="lead_id" onRowEditComplete={onRowEditComplete} selection={selectedLead}  onSelectionChange={(e) => setSelectedLead(e.value)}  filters={filters} globalFilterFields={['company', 'industry', 'location', 'phone', 'email']} header={header} emptyMessage="No leads found.">
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
                </DataTable> */}
                <DataTable
                /* 👇 add these */
                ref={dt}
                header={header}
                filters={filters}
                // filterDisplay="menu"                // enables filtering; menu UI will stay hidden if we don't render filter UI
                // onFilter={(e) => setWindowCount(e.filteredValue?.length ?? channels.length)} // capture filtered length
                onFilter={(e) => { setFilters(e.filters); setWindowCount(e.filteredValue?.length ?? channels.length); }}
                filterDisplay="row"   // ⬅️ switch from "menu" to "row"
                paginator
                rows={50}                                 // page size
                rowsPerPageOptions={[25, 50, 100, 200]}   // user choices
                pageLinkSize={5}                          // how many page links to show
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate={`Showing {first}–{last} of ${windowCount}`}
                editMode="row"
                onRowEditComplete={onRowEditComplete}     // ✅ row event
                value={channels}
                dataKey="channel_id"
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                /* 👇 controlled pagination so we can jump to page 1 on filter change */
                first={first}
                onPage={(e) => setFirst(e.first)}
                rowExpansionTemplate={(row) => (
                    <div className="p-3">
                    <h5>Top Videos for {row.channel_name}</h5>
                    <DataTable value={row.top3_videos || []}>
                        <Column field="title" body={videoTitleBodyVideos} header="Title" />
                        <Column header="Thumb" body={videoThumbBody}  />
                        <Column field="views" header="Views" />
                        <Column field="duration_mins" header="Duration" />
                        <Column header="Watch" body={(v) => (<a href={v.video_url} target="_blank" rel="noreferrer">Open</a>)} />
                    </DataTable>
                    </div>
                )}
                >
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                {/* ...your other columns... */}
                <Column field="channel_name" body={channelLinkBody} header="Channel" />
                <Column rowEditor headerStyle={{ width: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
                <Column field="is_monetized" body={monetizationBody}  editor={monetizedEditor} style={{ width: "8rem" }} header="$$" />
                <Column header="Top Video" body={heroThumbBody} style={{ width: "8rem" }} />
                {/* <Column field="Top Views" body={topVidViewsBody} header="TopVid Views" sortable/> */}
                <Column header="" body={notInterestedBody} style={{ width: '10rem' }} />
                <Column header="" body={interestedBody} style={{ width: '10rem' }} />
                <Column field="first_upload_date" body={firstUploadTextBody}  editor={firstUploadEditor} header="First Upload" 
                // filter showFilterMenu={false} 
                sortable/>
                <Column field="topVidViews" header="TopVid Views" body={topVidViewsBody} sortable  dataType="numeric" />
                <Column field="search_term" header="Niche"
                        // filter
                        // showFilterMenu={false}
                        // filterMatchMode="equals"
                        // filterElement={nicheRowFilter} /
                        />
                <Column field="sub_count" header="Subs" />
                <Column field="views_last_month" header="Month Views" sortable/>
                <Column field="revenue_last_month" header="Rev Last Mon" editor={(options) => textEditor(options)} sortable/>
                {/* <Column header="RPM" body={rpmBody} sortable/> */}
                <Column field="rpm_low" header="RPM Low" body={rpmLowBody} editor={numberEditor} sortable />
                <Column field="rpm_high" header="RPM High" body={rpmHighBody} editor={numberEditor} sortable />
                <Column field="avg_monthly_uploads" header="Monthly Uploads" sortable/>
                {/* <Column field="claimed_by" header="Clamed By" /> */}

                {/* <Column field="channel_url" header="URL" /> */}
                {/* <Column header="Hide" body={notInterestedBody} style={{ width: '10rem' }} />
                <Column header="Save" body={interestedBody} style={{ width: '10rem' }} /> */}
                <Column header="Drive" body={driveButtonBody} exportable={false} style={{ width: "6rem", textAlign: "center" }} />
                {/* <Column rowEditor headerStyle={{ width: '8rem' }} bodyStyle={{ textAlign: 'center' }} /> */}


                </DataTable>


                {/* <DataTable value={channels}  dataKey="channel_id">
                <Column field="channel_id" header="ID" hidden />
                <Column field="company" header="Company" />
                <Column field="channel_name" header="Channel" />
                <Column field="sub_count" header="Subs" />
                <Column field="views_last_month" header="Month Views" />
                <Column field="revenue_last_month" header="Rev Last Mon" />
                <Column field="avg_monthly_uploads" header="Month Uploads" />
                <Column field="channel_url" header="URL" />
                </DataTable> */}
                  
                    {/* <DataTable value={channels} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                            onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                            dataKey="id" header={header} tableStyle={{ minWidth: '60rem' }}>
                        <Column expander={allowExpansion} style={{ width: '5rem' }} />
                        <Column field="channel" header="C" sortable />
                        <Column header="Image" body={imageBodyTemplate} />
                        <Column field="price" header="Price" sortable body={priceBodyTemplate} />
                        <Column field="category" header="Category" sortable />
                        <Column field="rating" header="Reviews" sortable body={ratingBodyTemplate} />
                        <Column field="inventoryStatus" header="Status" sortable body={statusBodyTemplate} />
                    </DataTable> */}

                
                {/* MODALS */}
                <ModalCreateDriveFolder
                header="Create Drive Folder"
                visibleCreateFolder={folderDlgOpen}
                onHide={() => setFolderDlgOpen(false)}
                folderName={folderName}
                onFolderNameChange={(e) => setFolderName(e.target.value)}
                rowLabel={rowForFolder?.channel_name}
                submitLabel="Test Submit"
                cancelLabel="Cancel"
                loading={false}
                showError={submitAttempt && !folderName}
                errorText="Folder name is required"
                onSubmit={handleCreateAll}

                />

                <ModalNewLead visibleNewLead={visibleNewLead} productDialogFooter={productDialogFooter} setVisibleNewLead={()=> closeNewLeadModal()}  company={newlead.company} industry={newlead.industry} location={newlead.location} phone={newlead.phone} email={newlead.email} url={newlead.url} companyError={errors.company} industryError={errors.industry} locationError={errors.location} phoneError={errors.phone} emailError={errors.email} leadStatus={newlead.status} setLeadStatus={setLeadStatusFunc}  statuses={statuses}  submitNewLead={submitNewLead} Formchange={Inputchange}  />
                <ModalSwitch visibleHeadlessDialouge={visibleHeadlessDialouge} headlessBrowserDialogFooter={headlessBrowserDialogFooter} setVisibleHeadlessDialouge={() => setVisibleHeadlessDialouge(false)}  headlessBrowser={headlessBrowser} setHeadless={()=> setHeadlessBrowser(!headlessBrowser)} />
            </div>
            <Footer />
    </div>
}


export default Dashboard