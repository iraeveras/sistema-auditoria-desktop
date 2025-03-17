// File: src/electron/util.ts
export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}