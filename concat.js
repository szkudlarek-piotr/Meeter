// const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
// console.log(arr.join(' '))

function parseStringToInt(str) {
    if (typeof str !== 'string') {
        throw new Error('parameter is not string', str)
    }

    // parse str to int
}

function z(param) {
    parseStringToInt(param)
}


function main() {
    try {
        z(3)
    } catch (error) {
        console.error(error)

        userinterface.showalert('przes[raszam coś podzszło nie tak')
    }
}

main()