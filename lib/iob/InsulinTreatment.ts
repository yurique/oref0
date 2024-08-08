export interface BasalTreatment {
    timestamp: string
    started_at: Date
    date: number
    rate: number
    duration: number
}

export interface BolusTreatment {
    timestamp: string
    started_at: Date
    date: number
    insulin: number
}

export type InsulinTreatment = BasalTreatment | BolusTreatment

export const isBasalTreatment = <A extends InsulinTreatment>(treatment: A): treatment is A & BasalTreatment =>
    Object.prototype.hasOwnProperty.call(treatment, 'rate')
export const isBolusTreatment = <A extends InsulinTreatment>(treatment: A): treatment is A & BolusTreatment =>
    Object.prototype.hasOwnProperty.call(treatment, 'insulin')
