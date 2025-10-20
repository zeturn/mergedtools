declare module 'jsqr' {
  export interface QRCode {
    data: string
    binaryData?: Uint8ClampedArray
    chunks?: any[]
    version?: number
    location?: any
  }
  export default function jsQR(data: Uint8ClampedArray, width: number, height: number, options?: any): QRCode | null
}

declare module 'html-minifier-terser' {
  export function minify(input: string, options?: any): Promise<string>
}

declare module 'csso' {
  const csso: { minify: (css: string, options?: any) => { css: string; map?: any } }
  export default csso
}
