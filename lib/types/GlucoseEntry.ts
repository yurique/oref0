export interface GlucoseEntry {
    date?: number
    display_time?: string
    dateString?: string
    sgv?: number
    glucose?: number
    type?: 'sgv' | 'cal' | string
    device?: string
    noise?: number
    xDrip_started_at?: unknown
}

export const getGlucoseEntryDate = (entry: GlucoseEntry): Date | undefined => {
    if (entry.date) {
        return new Date(entry.date)
    } else if (entry.dateString) {
        return new Date(entry.dateString)
    } else if (entry.display_time) {
        return new Date(entry.display_time.replace('T', ' '))
    }

    return undefined
}
