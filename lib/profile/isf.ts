import { ISFProfile, ISFSensitivity } from "../types/Profile";

export default function isfLookup(isf_profile: ISFProfile, timestamp: Date | undefined, lastResult?: ISFSensitivity): [number, ISFSensitivity | undefined] {

    var nowDate = timestamp || new Date();

    var nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();

    if (lastResult && nowMinutes >= lastResult.offset && nowMinutes < lastResult.endOffset) {
        return [lastResult.sensitivity, lastResult];
    }

    let isf_data = isf_profile.sensitivities.sort((a, b) => a.offset - b.offset)

    var isfSchedule = isf_data[isf_data.length - 1];

    if (isf_data[0].offset !== 0) {
        return [-1, lastResult];
    }

    var endMinutes = 1440;

    for (var i = 0; i < isf_data.length - 1; i++) {
        var currentISF = isf_data[i];
        var nextISF = isf_data[i+1];
        if (nowMinutes >= currentISF.offset && nowMinutes < nextISF.offset) {
            endMinutes = nextISF.offset;
            isfSchedule = isf_data[i];
            break;
        }
    }

    lastResult = isfSchedule;
    lastResult.endOffset = endMinutes;

    return [isfSchedule.sensitivity, lastResult];
}

isfLookup.isfLookup = isfLookup;
exports = module.exports = isfLookup;
