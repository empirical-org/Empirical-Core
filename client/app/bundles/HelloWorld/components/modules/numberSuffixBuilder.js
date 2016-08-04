'use strict'

export default function(num) {
    let numS = String(num)
    let numL = numS.length - 1
    if (num >= 11 && num <= 19) {
        numS += 'th'
    } else if (numS[numL] === '1') {
        numS += 'st'
    } else if (numS[numL] === '2') {
        numS += 'nd'
    } else if (numS[numL] === '3') {
        numS += 'rd'
    } else {
        numS += 'th'
    }
    return numS
}
