import moment from "moment";

export const bytesToSize = bytes =>  {
    bytes = parseInt(bytes)
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const dateFormater = timestamp => {

    let date = moment(timestamp);
    let now = moment()

    if(date.isSame(now, 'day')){
        return date.format('LT')
    }

    return date.format('L')
}
