import * as basal from '../profile/basal'
import get_iob from '../iob'
import find_insulin, { Input as IOBInput } from '../iob/history'
import isf from '../profile/isf'
import { GlucoseEntry } from '../types/GlucoseEntry';
import { BasalSchedule } from '../types/Profile';

export interface DetectCOBInput {
    glucose_data: GlucoseEntry[]
    iob_inputs: IOBInput
    basalprofile?: BasalSchedule[]
    mealTime: number
    ciTime?: number
}

function getDateFromEntry(entry: GlucoseEntry) {
    if (entry.date) {
        return entry.date
    } else if (entry.display_time) {
        return Date.parse(entry.display_time)
    } else if (entry.dateString) {
        return Date.parse(entry.dateString)
    }

    throw new TypeError('Unable to find a date in GlucoseEntry')
}

export default function detectCarbAbsorption(inputs: DetectCOBInput) {

    const glucose_data = inputs.glucose_data.reduce(
        (b, a) => {
            const glucose = a.glucose || a.sgv
            return glucose ? [...b, { ...a, glucose, date: getDateFromEntry(a) }] : b
        },
        [] as (GlucoseEntry & { glucose: number, date: number })[]
    )
    var iob_inputs = inputs.iob_inputs;
    var basalprofile = inputs.basalprofile;
    /* TODO why does declaring profile break tests-command-behavior.tests.sh? 
       because it is a global variable used in other places.*/ 
    var profile = inputs.iob_inputs.profile;
    var mealTime = new Date(inputs.mealTime);
    var ciTime = inputs.ciTime ? new Date(inputs.ciTime) : undefined;

    //console.error(mealTime, ciTime);

    // get treatments from pumphistory once, not every time we get_iob()
    var treatments = find_insulin(inputs.iob_inputs);

    if (! glucose_data.length) {
        // @todo: return something empty
    }

    var carbsAbsorbed = 0;
    var bucketed_data = glucose_data.slice(0, 1)
    var j=0;
    var foundPreMealBG = false;
    var lastbgi = 0;

    if (! glucose_data[0].glucose || glucose_data[0].glucose < 39) {
      lastbgi = -1;
    }

    for (var i=1; i < glucose_data.length; ++i) {
        const currentGlucose = glucose_data[i]
        var bgTime = new Date(currentGlucose.date)
        var lastbgTime;
        if (currentGlucose.glucose < 39) {
            //console.error("skipping:",glucose_data[i].glucose);
            continue;
        }
        // only consider BGs for 6h after a meal for calculating COB
        var hoursAfterMeal = (bgTime.getTime() - mealTime.getTime())/(60*60*1000);
        if (hoursAfterMeal > 6 || foundPreMealBG) {
            continue;
        } else if (hoursAfterMeal < 0) {
            //console.error("Found pre-meal BG:",glucose_data[i].glucose, bgTime, Math.round(hoursAfterMeal*100)/100);
            foundPreMealBG = true;
        }
        //console.error(glucose_data[i].glucose, bgTime, Math.round(hoursAfterMeal*100)/100, bucketed_data[bucketed_data.length-1].display_time);
        // only consider last ~45m of data in CI mode
        // this allows us to calculate deviations for the last ~30m
        if (typeof ciTime !== 'undefined') {
            var hoursAgo = (ciTime.getTime() - bgTime.getTime())/(45*60*1000);
            if (hoursAgo > 1 || hoursAgo < 0) {
                continue;
            }
        }
        const lastBucketedData = bucketed_data[bucketed_data.length-1]
        lastbgTime = new Date(lastBucketedData.date);
        var elapsed_minutes = (bgTime.getTime() - lastbgTime.getTime())/(60*1000);
    //console.error(bgTime, lastbgTime, elapsed_minutes);
        if(Math.abs(elapsed_minutes) > 8) {
            // interpolate missing data points
            var lastbg = glucose_data[lastbgi].glucose;
            // cap interpolation at a maximum of 4h
            elapsed_minutes = Math.min(240,Math.abs(elapsed_minutes));
            //console.error(elapsed_minutes);
            while (elapsed_minutes > 5) {
                var previousbgTime: Date = new Date(lastbgTime.getTime() - 5 * 60*1000);
                j++;

                var gapDelta = glucose_data[i].glucose - lastbg;
                var previousbg = lastbg + (5/elapsed_minutes * gapDelta);
                bucketed_data[j] = {
                    date: previousbgTime.getTime(),
                    glucose: Math.round(previousbg),
                };

                elapsed_minutes = elapsed_minutes - 5;
                lastbg = previousbg;
                lastbgTime = new Date(previousbgTime);
            }

        } else if(Math.abs(elapsed_minutes) > 2) {
            j++;
            bucketed_data[j]=glucose_data[i];
            bucketed_data[j].date = bgTime.getTime();
        } else {
            bucketed_data[j].glucose = (bucketed_data[j].glucose + glucose_data[i].glucose)/2;
        }

        lastbgi = i;
        //console.error(bucketed_data[j].date)
    }
    var currentDeviation = 0;
    var slopeFromMaxDeviation = 0;
    var slopeFromMinDeviation = 999;
    var maxDeviation = 0;
    var minDeviation = 999;
    var allDeviations = [];
    //console.error(bucketed_data);
    var lastIsfResult = undefined;
    if (!profile.isfProfile) {
        console.error("No isfProfile found in Profile");
        throw new TypeError("No isfProfile found in Profile")
    }
    for (i=0; i < bucketed_data.length-3; ++i) {
        bgTime = new Date(bucketed_data[i].date);

        var sens;
        [sens, lastIsfResult] = isf.isfLookup(profile.isfProfile, bgTime, lastIsfResult);

        //console.error(bgTime , bucketed_data[i].glucose, bucketed_data[i].date);
        var bg;
        let avgDelta;
        var delta;
        if (typeof(bucketed_data[i].glucose) !== 'undefined') {
            bg = bucketed_data[i].glucose;
            if ( bg < 39 || bucketed_data[i+3].glucose < 39) {
                process.stderr.write("!");
                continue;
            }
            avgDelta = Math.round(((bg - bucketed_data[i+3].glucose)/3) * 100) / 100;
            delta = (bg - bucketed_data[i+1].glucose);
        } else {
            console.error("Could not find glucose data");
            continue;
        }

        iob_inputs.clock=bgTime.toISOString();
        iob_inputs.profile.current_basal = basal.basalLookup(basalprofile || [], bgTime);
        //console.log(JSON.stringify(iob_inputs.profile));
        //console.error("Before: ", new Date().getTime());
        var iob = get_iob(iob_inputs, true, treatments)[0];
        //console.error("After: ", new Date().getTime());
        //console.error(JSON.stringify(iob));

        var bgi = Math.round(( -iob.activity * sens * 5 ) * 100) / 100;
        //console.error(delta);
        var deviation = Math.round((delta-bgi) * 100) / 100;
        //if (deviation < 0 && deviation > -2) { console.error("BG: "+bg+", avgDelta: "+avgDelta+", BGI: "+bgi+", deviation: "+deviation); }
        // calculate the deviation right now, for use in min_5m
        if (i===0) {
            currentDeviation = Math.round((avgDelta-bgi)*1000)/1000;
            if (ciTime && ciTime > bgTime) {
                //console.error("currentDeviation:",currentDeviation,avgDelta,bgi);
                allDeviations.push(Math.round(currentDeviation));
            }
            if (currentDeviation/2 > profile.min_5m_carbimpact) {
                //console.error("currentDeviation",currentDeviation,"/2 > min_5m_carbimpact",profile.min_5m_carbimpact);
            }
        } else if (ciTime && ciTime > bgTime) {
            var avgDeviation = Math.round((avgDelta-bgi)*1000)/1000;
            var deviationSlope = (avgDeviation - currentDeviation)/(bgTime.getTime()-ciTime.getTime())*1000*60*5;
            //console.error(avgDeviation,currentDeviation,bgTime,ciTime)
            if (avgDeviation > maxDeviation) {
                slopeFromMaxDeviation = Math.min(0, deviationSlope);
                maxDeviation = avgDeviation;
            }
            if (avgDeviation < minDeviation) {
                slopeFromMinDeviation = Math.max(0, deviationSlope);
                minDeviation = avgDeviation;
            }

            //console.error("Deviations:",avgDeviation, avgDelta,bgi,bgTime);
            allDeviations.push(Math.round(avgDeviation));
            //console.error(allDeviations);
        }

        // if bgTime is more recent than mealTime
        if(bgTime > mealTime) {
            // figure out how many carbs that represents
            // if currentDeviation is > 2 * min_5m_carbimpact, assume currentDeviation/2 worth of carbs were absorbed
            // but always assume at least profile.min_5m_carbimpact (3mg/dL/5m by default) absorption
            var ci = Math.max(deviation, currentDeviation/2, profile.min_5m_carbimpact);
            var absorbed = ci * profile.carb_ratio / sens;
            // and add that to the running total carbsAbsorbed
            //console.error("carbsAbsorbed:",carbsAbsorbed,"absorbed:",absorbed,"bgTime:",bgTime,"BG:",bucketed_data[i].glucose)
            carbsAbsorbed += absorbed;
        }
    }
    if(maxDeviation>0) {
        //console.error("currentDeviation:",currentDeviation,"maxDeviation:",maxDeviation,"slopeFromMaxDeviation:",slopeFromMaxDeviation);
    }

    return {
        "carbsAbsorbed": carbsAbsorbed
    ,   "currentDeviation": currentDeviation
    ,   "maxDeviation": maxDeviation
    ,   "minDeviation": minDeviation
    ,   "slopeFromMaxDeviation": slopeFromMaxDeviation
    ,   "slopeFromMinDeviation": slopeFromMinDeviation
    ,   "allDeviations": allDeviations
    }
}
module.exports = detectCarbAbsorption;
