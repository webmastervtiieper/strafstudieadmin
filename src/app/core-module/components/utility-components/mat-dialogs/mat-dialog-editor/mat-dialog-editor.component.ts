import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { TdDialogService, IConfirmConfig } from "@covalent/core";
import { MatButton } from '@angular/material';
import { MatDialogEditorReadyArgs } from "../../../../base-classes/base-editor-dialog";


@Component({
  selector: 'mat-dialog-editor',
  templateUrl: './mat-dialog-editor.component.html'
})
export class MatDialogEditorComponent implements OnInit{
  @Input('dialogTitleIconName') dialogTitleIconName = "subject"; //md-icon name voor titel van dialog screent;
  @Input('dialogTitle') dialogTitle ="Dialog titel";
  @Input('savePending') savePending=false;
  @Input('dialogTitleExtraText') dialogTitleExtraText = ""; //text aan de rechterkant van de dailogtitle
  //@Input('dialogStatusText')dialogStatusText ="";
  //@Input('dialogStatusIconName')dialogStatusIconName="info" ;
  
  @Output() closeButtonClicked: EventEmitter<MatButton> = new EventEmitter<MatButton>();
  @Output() saveButtonClicked: EventEmitter<MatButton> = new EventEmitter<MatButton>();
  @Output() dialogReady:EventEmitter<MatDialogEditorReadyArgs> = new EventEmitter<MatDialogEditorReadyArgs>();

  @ViewChild("btnClose") btnClose: MatButton;
  @ViewChild("btnSave") btnSave: MatButton;
  constructor()
  { }

  ngOnInit()
  {
    this.dialogReady.emit({closeButton:this.btnClose, saveButton:this.btnSave});
  }

  btnClose_clicked() {
    this.closeButtonClicked.emit(this.btnClose);
  }
  btnSave_clicked() {
    this.saveButtonClicked.emit(this.btnSave);
  }
  
}

