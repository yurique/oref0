
export type GlucoseEntry = {
    date?: number
    display_time?: string
    dateString?: string
    sgv?: number
    glucose?: number
    type?: 'sgv' | 'cal' | string
    device?: string
    noise?: number
}
