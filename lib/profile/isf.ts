import type { ISFProfile, ISFSensitivity } from '../types/Profile'

export default function isfLookup(
    isf_profile: ISFProfile,
    timestamp: Date | undefined,
    lastResult: ISFSensitivity | null
): [number, ISFSensitivity | null] {
    const nowDate = timestamp || new Date()

    const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes()

    if (lastResult && nowMinutes >= lastResult.offset && nowMinutes < lastResult.endOffset) {
        return [lastResult.sensitivity, lastResult]
    }

    const isf_data = isf_profile.sensitivities.sort((a, b) => a.offset - b.offset)

    let isfSchedule = isf_data[isf_data.length - 1]

    if (isf_data[0].offset !== 0) {
        return [-1, lastResult]
    }

    let endMinutes = 1440

    for (let i = 0; i < isf_data.length - 1; i++) {
        const currentISF = isf_data[i]
        const nextISF = isf_data[i + 1]
        if (nowMinutes >= currentISF.offset && nowMinutes < nextISF.offset) {
            endMinutes = nextISF.offset
            isfSchedule = isf_data[i]
            break
        }
    }

    return [
        isfSchedule.sensitivity,
        {
            ...isfSchedule,
            endOffset: endMinutes,
        },
    ]
}

isfLookup.isfLookup = isfLookup
exports = module.exports = isfLookup
