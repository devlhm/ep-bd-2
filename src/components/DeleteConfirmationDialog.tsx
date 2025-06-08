import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React from 'react'

interface DeleteConfirmationDialogProps {
    visible: boolean;
    onHide: () => void;
    onConfirm: () => void;
    confirmationMessage: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = (props: DeleteConfirmationDialogProps) => {
    return (
        <Dialog
            visible={props.visible}
            style={{ width: "450px" }}
            header="Confirmação"
            modal
            footer={
                <>
                    <Button
                        label="Não"
                        icon="pi pi-times"
                        className="p-button-text mr-3 p-3"
                        onClick={props.onHide}
                    />
                    <Button
                        label="Sim"
                        icon="pi pi-check"
                        className="p-button-text p-3"
                        onClick={props.onConfirm}
                    />
                </>
            }
            onHide={props.onHide}
        >
            <div className="confirmation-content pt-5">
                <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                />
                {(
                    <span>
                        {props.confirmationMessage}
                    </span>
                )}
            </div>
        </Dialog>
    )
}

export default DeleteConfirmationDialog;