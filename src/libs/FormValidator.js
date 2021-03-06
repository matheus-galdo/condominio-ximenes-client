const primitiveTypes = ['string', 'boolean', 'number', 'bigint']

let validationMessages = {
    required: 'Este campo é obrigatório',
    
    string: 'Este campo aceita apenas texto',
    number: 'Este campo aceita apenas números',
    bigint: 'Este campo aceita apenas números',
    boolean: 'Formato incorreto',
    object: 'Formato incorreto',

    max: 'Este campo deve ter até placeholder caracteres',
    min: 'Este campo deve ter ao menos placeholder caracteres',
    length: 'Este campo deve ter placeholder caracteres',

    confirmed: 'Os campos não coincidem',
    email: 'Informe um e-mail válido',
    cpf: 'Informe um número de CPF válido',
    telefone: 'Informe um número de telefone válido',
    placaCarro: 'Informe uma placa válida',
    password_confirmation: 'Senhas Não conferem',
    password_length: 'Senha deve ter no mínimo 8 caracteres',
    itens: 'Marque este campo ou adicione pelo menos um item'
}

let ruleValidators = {
    //obrigatorio
    required: function (value) {
        return (typeof value === 'undefined' || value.length === 0);
    },



    //tipos
    string: function (value) {
        return (typeof value !== 'string');
    },

    number: function (value) {
        value = Number(value)
        return (typeof value !== 'number' || isNaN(value));
    },

    bigint: function (value) {
        value = Number(value)
        return (typeof value !== 'bigint' || isNaN(value));

    },

    boolean: function (value) {
        return (typeof value !== 'boolean');
    },

    object: function (value) {
        return (typeof value !== 'object');
    },



    //tamanho do campo
    max: function (value, size) {
        if(value === '') return false
        return (value.length > size);
    },

    min: function (value, size) {
        if(value === '') return false
        return (value.length < size);
    },

    length: function (value, size) {
        if(value === '') return false
        return (value.length !== size && value.length > 0);
    },

    password_length: function (value, size = 8) {
        if(value === '') return false
        return (value.length < size);
    },


    //custom
    confirmed: function (value, otherFieldValue) {
        if(value === '') return false
        console.log(value, otherFieldValue);
        return value !== otherFieldValue;
    },

    email: function (value) {
        if(value === '') return false
        var re = /\S+@\S+\.\S+/;
        return !re.test(value);
    },

    cpf: function (value) {
        if(value === '') return false
        let clearedValue = value.replace(/(\.)?(-)?(\s)?/gm, '')
        if (clearedValue.length !== 11) return true;

        var re = /(\d{3})\.?(\d{3})\.?(\d{3})-?(\d{2})/;
        return !re.test(value);
    },

    telefone: function (value) {
        if(value === '') return false
        let clearedValue = value.replace(/(\.)?(-)?(\s)?(\()?(\))?/gm, '')
        if(clearedValue.length > 11) return true;
        var re = /(\(?\d{2}\)?)?\s?(\d{4,5})-?\s?(\d{4})/;
        return !re.test(value);
    },

    placaCarro: function (value) {
        if(value === '') return false
        if(value.length !== 7) return true;
        var re = /([A-Z]{3}[0-9][0-9A-Z][0-9]{2})/;
        return !re.test(value);
    },

    itens: function (value, itens) {

        if(!value){
            return(itens.length <= 0)
        }

        return false
    }
}

function getRuleValidator(ruleName) {
    let ruleArg = null
    if (ruleName.indexOf(':') > 0) [ruleName, ruleArg] = ruleName.split(':')
    return [ruleValidators[ruleName], ruleName, ruleArg]
}


function checkForDataErrors(data, rule, itens) {
    let [callableValidator, ruleName, validatorArgs] = getRuleValidator(rule)
    if (validatorArgs === null && rule === 'itens') validatorArgs = itens
    return [callableValidator(data, validatorArgs), ruleName, validatorArgs]
}


function getErrorMessage(rule, ruleArg) {
    return (ruleArg)? validationMessages[rule].replace('placeholder', ruleArg) : validationMessages[rule]
}



/**
 * @param {*} data - os dados que serão validados, passe um valor ou um array de valores
 * @param {*} rules - as regras de validação que são aceitas. As regras foram baseadas no validator do laravel, sendo assim os paramentros válidos são:
 * [ required, present, string, number, bigint, boolean, object, max:0, min:0, length:0, email ]
 *
 */
export default function FormValidator(data, rules, itens = []) {

    let input = {isValid: true, errors: [], original: {data:data, rule:rules}};

    //retorna se não tiver nenhuma validação definida
    if (rules.length === 0 || rules === "" || !rules)  return input

    let dataList = (primitiveTypes.includes(typeof data) || Array.isArray(data)) ? [data] : data
    let rulesList = (typeof rules === 'string') ? rules.split('|') : rules

    dataList.forEach(dataItem => {
        rulesList.forEach(rule => {

            let [dataHasErrors, ruleName, ruleArg] = checkForDataErrors(dataItem, rule, itens)
            
            if (dataHasErrors) {
                let errorObj = {
                    rule: ruleName,
                    message: getErrorMessage(ruleName, ruleArg)
                }
                input.isValid = false                
                input.errors.push(errorObj)
            }
        })
    });

    return input
}