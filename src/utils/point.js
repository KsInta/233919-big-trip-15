import dayjs from 'dayjs';

const isExpired = (dueDate) => dayjs().isAfter(dueDate, 'D');
const humanizePointDueDate = (dueDate, format) => dayjs(dueDate).format(format);

const sortPointDuration = (pointsA, pointB) => pointB.dateTo.pointTimeLength - pointsA.dateTo.pointTimeLength;

const sortPointPrice = (pointsA, pointB) => pointB.basePrice - pointsA.basePrice;

export {isExpired, humanizePointDueDate, sortPointDuration, sortPointPrice};
