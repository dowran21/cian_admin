import dayjs from 'dayjs';

export const formatDate = (date) => {
    return dayjs(date).format('DD.MM.YYYY HH:mm')
}
 
export const exFormatDate = (date, format) => {
    return dayjs(date).format(format)
}