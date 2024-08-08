export interface FinalResult {
    err: string
    stdout: string
    return_val: number
}

function console_both(final_result: string, theArgs: unknown[]) {
    let newResult = final_result
    if (newResult.length > 0) {
        newResult += '\n'
    }
    const len = theArgs.length
    for (let i = 0; i < len; i++) {
        if (typeof theArgs[i] !== 'object') {
            newResult += theArgs[i]
        } else {
            newResult += JSON.stringify(theArgs[i])
        }
        if (i !== len - 1) {
            newResult += ' '
        }
    }
    return newResult
}

export const console_error = function console_error(final_result: FinalResult, ...theArgs: unknown[]) {
    final_result.err = console_both(final_result.err, theArgs)
}

export const console_log = function console_log(final_result: FinalResult, ...theArgs: unknown[]) {
    final_result.stdout = console_both(final_result.stdout, theArgs)
}

export const process_exit = function process_exit(final_result: FinalResult, ret: number) {
    final_result.return_val = ret
}

export const initFinalResults = function initFinalResults(): FinalResult {
    return {
        stdout: '',
        err: '',
        return_val: 0,
    }
}

module.exports = {
    console_log: console_log,
    console_error: console_error,
    process_exit: process_exit,
    initFinalResults: initFinalResults,
}
