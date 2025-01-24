import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pathFormat'
})
export class PathFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;  // Return empty string if value is falsy

    // Replace slashes, hyphens, and capitalize the first letter of each word
    return value
      .replace(/[-/]/g, ' ')  // Replace hyphen and slash with space
      .split(' ')  // Split by spaces
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize the first letter of each word
      .join(' / ').slice(2);  // Join the words back together with spaces
  }

}
