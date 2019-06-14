import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUri'
})
export class SafeUriPipe implements PipeTransform {
  constructor(
    private _sanitized: DomSanitizer
  ) { }

  transform(value: any, args?: any): SafeResourceUrl {
    return this._sanitized.bypassSecurityTrustResourceUrl(value);
  }
}
