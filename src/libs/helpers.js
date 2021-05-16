export function capitalize(str) {    
    return str[0].toUpperCase() + str.slice(1)
}

export const clipboard = (e, text) => {
    e.preventDefault()
    navigator.clipboard.writeText(text).then(function () {
        /* clipboard successfully set */
    }, function () {
        /* clipboard write failed */
    });
}


export const numberFormat = (value, format) => {

    const FORMATS = {
        real: value => {
            return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        },

        money: value => {
            return  value.toLocaleString('pt-br', {minimumFractionDigits: 2});
        },
    }

    let callable = FORMATS[format]
    return callable(value)
}