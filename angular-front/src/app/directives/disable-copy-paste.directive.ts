import { Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appDisableCopyPaste]'
})
export class DisableCopyPasteDirective {
  @HostListener('copy', ['$event'])
  onCopy(event:Event): void {
    event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event:Event): void {
    event.preventDefault();
  }
}