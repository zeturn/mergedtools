declare module 'piexifjs' {
  export const ImageIFD: any
  export function load(dataURL: string): any
  export function dump(exif: any): string
  export function insert(exifStr: string, dataURL: string): string
}
