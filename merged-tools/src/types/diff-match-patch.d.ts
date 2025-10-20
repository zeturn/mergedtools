declare module 'diff-match-patch' {
  export const DIFF_DELETE: number;
  export const DIFF_EQUAL: number;
  export const DIFF_INSERT: number;
  export class diff_match_patch {
    Diff_Timeout: number;
    Diff_EditCost: number;
    Match_Threshold: number;
    Match_Distance: number;
    Patch_DeleteThreshold: number;
    diff_main(text1: string, text2: string): [number, string][];
    diff_cleanupSemantic(diffs: [number, string][]): void;
    patch_make(text1: string, text2: string): any[];
    patch_apply(patches: any[], text: string): [string, boolean[]] | [string];
  }
}
