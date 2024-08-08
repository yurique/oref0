import type { BasalSchedule } from '../types/Profile'

/* Return basal rate(U / hr) at the provided timeOfDay */
export function basalLookup(schedules: BasalSchedule[], now?: Date) {
    const nowDate = now || new Date()

    // @todo: check `i` because it can be undefined
    const basalprofile_data = schedules.sort((a, b) => Number(a.i) - Number(b.i))
    let basalRate = basalprofile_data[basalprofile_data.length - 1].rate
    if (basalRate === 0) {
        // TODO - shared node - move this print to shared object.
        console.error('ERROR: bad basal schedule', schedules)
        return
    }
    const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes()

    for (let i = 0; i < basalprofile_data.length - 1; i++) {
        if (nowMinutes >= basalprofile_data[i].minutes && nowMinutes < basalprofile_data[i + 1].minutes) {
            basalRate = basalprofile_data[i].rate
            break
        }
    }
    return Math.round(basalRate * 1000) / 1000
}

export function maxDailyBasal(inputs: { basals: { rate: string | number }[] }): number {
    const max = inputs.basals.reduce((b, a) => (Number(a.rate) > b ? Number(a.rate) : b), 0)
    return (Number(max) * 1000) / 1000
}

/*Return maximum daily basal rate(U / hr) from profile.basals */

export function maxBasalLookup(inputs: { settings: { maxBasal: number } }): number {
    return inputs.settings.maxBasal
}

exports.maxDailyBasal = maxDailyBasal
exports.maxBasalLookup = maxBasalLookup
exports.basalLookup = basalLookup
