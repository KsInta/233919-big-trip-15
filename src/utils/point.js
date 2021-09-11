import dayjs from 'dayjs';

const isExpired = (dueDate) => dayjs().isAfter(dueDate, 'D');
const humanizePointDueDate = (dueDate, format) => dayjs(dueDate).format(format);

const sortPointDuration = (pointA, pointB) => pointB.dateTo.pointTimeLength - pointA.dateTo.pointTimeLength;

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const isDatesEqual = (pointA, pointB) => dayjs(pointA.dateFrom.pointStartFormatDate).isSame(pointB.dateFrom.pointStartFormatDate, 'D');

export {isExpired, humanizePointDueDate, sortPointDuration, sortPointPrice, isDatesEqual};
