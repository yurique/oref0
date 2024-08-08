function insulinDosed(opts) {
    const start = opts.start.getTime()
    const end = opts.end.getTime()
    const treatments = opts.treatments
    const profile_data = opts.profile
    let insulinDosed = 0
    if (!treatments) {
        console.error('No treatments to process.')
        return {}
    }

    treatments.forEach(treatment => {
        //console.error(treatment);
        if (treatment.insulin && treatment.date > start && treatment.date <= end) {
            insulinDosed += treatment.insulin
        }
    })
    //console.error(insulinDosed);

    return {
        insulin: Math.round(insulinDosed * 1000) / 1000,
    }
}

exports = module.exports = insulinDosed
