
// Import the core angular services.
import { DOCUMENT } from "@angular/platform-browser";
import { Inject } from "@angular/core";
import { Injectable } from "@angular/core";

@Injectable()
export class ClipboardService {
    private dom: Document;
    // I initialize the Clipboard service.
    // --
    // CAUTION: This service is tightly couped to the browser DOM (Document Object Model).
    // But, by injecting the "document" reference rather than trying to reference it
    // globally, we can at least pretend that we are trying to lower the tight coupling.
    constructor( @Inject( DOCUMENT ) dom: Document ) {
        this.dom = dom;
    }
    public copy( value: string ) : Promise<string> {
        var promise = new Promise<string>(
            ( resolve, reject ) : void => {
                var textarea = null;
                try {
                    textarea = this.dom.createElement( "textarea" );
                    textarea.style.height = "0px";
                    textarea.style.left = "-100px";
                    textarea.style.opacity = "0";
                    textarea.style.position = "fixed";
                    textarea.style.top = "-100px";
                    textarea.style.width = "0px";
                    this.dom.body.appendChild( textarea );

                    // Set and select the value (creating an active Selection range).
                    textarea.value = value;
                    textarea.select();

                    // Ask the browser to copy the current selection to the clipboard.
                    this.dom.execCommand( "copy" );
                    resolve( value );

                } finally {
                    // Cleanup - remove the Textarea from the DOM if it was injected.
                    if ( textarea && textarea.parentNode ) {
                        textarea.parentNode.removeChild( textarea );
                    }
                }
            }
        );
        return promise;
    }

}