// tslint:disable-next-line:max-line-length
import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, ViewChild, ElementRef, ComponentRef, ComponentFactory } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SideFloatOverService } from './side-float-over.service';

@Component({
  selector: 'side-float-over',
  templateUrl: './side-float-over.component.html',
  styleUrls: ['./side-float-over.component.css']
})
export class SideFloatOverComponent implements OnInit {
  @ViewChild('sidePanel') sidePanel: MatSidenav;
  @ViewChild('sidePanelContainer') sidePanelContainer: ElementRef;

  @ViewChild('componentContainer', { read: ViewContainerRef }) componentContainer: ViewContainerRef;
  showLoading = true;
  componentRef: ComponentRef<Component>;
  componentFactory: ComponentFactory<Component>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private sideFloatOverService: SideFloatOverService) {
  }

  ngOnInit() {
    this.sideFloatOverService.openPanelRequested.subscribe((componentToInject) => {
      this.openSidePanel(componentToInject);
    });
    this.sideFloatOverService.closePanelRequested.subscribe(() => {
      this.closeSidePanel();
    });
  }

  private createSideNavContentComponent(component) {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.componentRef = this.componentContainer.createComponent(this.componentFactory);
  }

  private openSidePanel(componentToInject?: Component) {
    (<HTMLDivElement>this.sidePanelContainer.nativeElement).style.display = 'block';

    setTimeout(() => {
      // let toggleResult: Promise<MatDrawerToggleResult>;
      if (!this.sidePanel.opened) {
        this.sidePanel.open().then(() => {
            if (componentToInject) {
              this.createSideNavContentComponent(componentToInject);
          }
        });
      }
    }, 10);
  }

  private closeSidePanel() {
    this.sidePanel.close().then(() => {

    });
  }

  onPanelClose() {
    // de sidepanel container moet verborgenworden, anders komt dit bovenop het aanroepend
    // scherm te liggen en is dit niet meer toegankelijk voor muis en keyboard event.s
    (<HTMLDivElement>this.sidePanelContainer.nativeElement).style.display = 'none';
      this.componentRef.destroy();
      this.showLoading = true;
    // verwijder het keuze component en vervang door progress bar.
    // console.log('closed side panel', this.componentRef);
    // this.componentRef.changeDetectorRef.detach();
   /// this.componentRef.destroy();
   // console.log('closed side panel after destroy componentn', this.componentRef);
   // this.componentContainer.clear();
    // this.showLoading = true;
   // this.sideFloatOverService.panelClosed.next(this.componentContainer);
  }

  onPanelOpen() {

  }
}
