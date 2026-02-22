import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';
import { assetUrl } from '../utils/asset-url';

@Pipe({
  name: 'assetUrl',
  standalone: true,
})
export class AssetUrlPipe implements PipeTransform {
  transform(input: string | null | undefined): string {
    return assetUrl(input, environment.assetBaseUrl);
  }
}
