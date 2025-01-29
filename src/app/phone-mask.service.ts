import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhoneMaskService {
  private masks: { [key: string]: string } = {
    'IN': '00000 00000',  // India (10 digits)
    'US': '000-000-0000',  // United States (10 digits)
    'UK': '00 000 000000',  // United Kingdom (10-15 digits)
    'AU': '0000 000 000',  // Australia (9-10 digits)
    'CA': '000-000-0000',  // Canada (10 digits)
    'FR': '00 00 00 00 00',  // France (10 digits)
    'DE': '000 0000 0000',  // Germany (10 digits)
    'BR': '00 0 0000-0000',  // Brazil (10-11 digits)
    'IT': '000 0000 0000',  // Italy (10 digits)
    'JP': '000-0000-0000',  // Japan (10 digits)
    'CN': '000 0000 0000',  // China (10 digits)
    'KR': '000-0000-0000',  // South Korea (10 digits)
    'MX': '000-000-0000',  // Mexico (10 digits)
    'ZA': '00 000 0000',  // South Africa (10 digits)
    'RU': '000 0000 0000',  // Russia (10 digits)
    'AR': '000-000-0000',  // Argentina (10 digits)
    'NG': '000 000 0000',  // Nigeria (10 digits)
    'EG': '00 000 0000',  // Egypt (10 digits)
    'SE': '000 000 000',  // Sweden (10 digits)
    'NO': '000 000 000',  // Norway (10 digits)
    'DK': '000 000 00',  // Denmark (8-10 digits)
    'FI': '000 000 000',  // Finland (9 digits)
    'CH': '00 000 0000',  // Switzerland (10 digits)
    'BE': '000 000 00',  // Belgium (8-9 digits)
    'NL': '00 000 0000',  // Netherlands (9 digits)
    'AT': '000 000 0000',  // Austria (10 digits)
    'PL': '000 000 000',  // Poland (9 digits)
    'SG': '0000 0000',  // Singapore (8 digits)
    'MY': '000-000-0000',  // Malaysia (10 digits)
    'PH': '000-000-0000',  // Philippines (10 digits)
    'TH': '000 000 0000',  // Thailand (10 digits)
    'ID': '000-000-0000',  // Indonesia (10 digits)
    'PK': '000-000-0000',  // Pakistan (10 digits)
    'VN': '000 000 0000',  // Vietnam (10 digits)
    'KW': '000 000 000',  // Kuwait (8-9 digits)
    'QA': '000 000 000',  // Qatar (8 digits)
    'OM': '000 000 000',  // Oman (8 digits)
    'SA': '000 000 0000',  // Saudi Arabia (9 digits)
    'AE': '000 000 0000',  // United Arab Emirates (9 digits)
    'IL': '00 000 0000',  // Israel (9 digits)
    'IQ': '000 000 000',  // Iraq (9 digits)
    'IR': '000 0000 0000',  // Iran (10 digits)
    'AF': '000 000 000',  // Afghanistan (9 digits)
    'BT': '000 000 000',  // Bhutan (8 digits)
    'LK': '000 000 0000',  // Sri Lanka (9 digits)
    'BD': '000 000 0000',  // Bangladesh (10 digits)
    'NE': '000 000 0000',  // Niger (10 digits)
    'KE': '000 000 0000',  // Kenya (10 digits)
    'ET': '000 000 0000',  // Ethiopia (10 digits)
    'TZ': '000 000 0000',  // Tanzania (10 digits)
    'UG': '000 000 0000'   // Uganda (10 digits)
  };
  

  constructor() {}

  getMask(countryCode: string): string {
    return this.masks[countryCode] || '';
  }
}
