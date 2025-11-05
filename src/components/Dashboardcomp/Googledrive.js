import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

function ModalCreateDriveFolder(props) {
  return (
    <Dialog
      header={props.header || "Create Drive Folder"}
      visible={props.visibleCreateFolder}
      style={{ width: props.width || "30rem" }}
      modal
      footer={props.footer}                /* optional, like your other modal */
      onHide={() => props.onHide && props.onHide()}
    >
      {/* optional error line, controlled by parent */}
      {props.showError && props.errorText ? (
        <div className="p-inputgroup mb-2">
          <Message
            severity="error"
            text={props.errorText}
            className="border-primary w-full justify-content-start"
          />
        </div>
      ) : null}

      <div className="p-inputgroup mb-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-folder-plus"></i>
        </span>
        <InputText
          id="folderName"
          name="folderName"
          value={props.folderName}
          onChange={(e) => props.onFolderNameChange && props.onFolderNameChange(e)}
          placeholder="Folder name"
        />
      </div>

      {props.rowLabel ? (
        <small className="text-500 block mb-3">Row: {props.rowLabel}</small>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button
          label={props.cancelLabel || "Cancel"}
          text
          onClick={() => props.onHide && props.onHide()}
        />
        <Button
          label={props.submitLabel || "Test Submit"}
          icon="pi pi-check"
          onClick={() => props.onSubmit && props.onSubmit()}
          loading={!!props.loading}
        />
      </div>
    </Dialog>
  );
}

export default ModalCreateDriveFolder;
