import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUri'
})
export class SafeUriPipe implements PipeTransform {
  constructor(
    private sanitized: DomSanitizer
  ) { }

  transform(value: string): SafeResourceUrl {
    return this.sanitized.bypassSecurityTrustResourceUrl(value);
  }
}
