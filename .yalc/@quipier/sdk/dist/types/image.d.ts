/** Read an image File into a normalized data URL that fits the upload budget.
 *  - GIFs stay as-is when already small (preserves animation), else flattened.
 *  - PNGs keep transparency until shrinking alone can't fit, then fall to JPEG.
 *  - Everything else is JPEG, quality-stepped to fit.
 *  Falls back to the raw data URL if a <canvas> isn't available. */
export declare function fileToDataUrl(file: File): Promise<string>;
//# sourceMappingURL=image.d.ts.map