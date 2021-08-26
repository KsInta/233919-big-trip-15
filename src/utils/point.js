import dayjs from 'dayjs';

const isExpired = (dueDate) => dayjs().isAfter(dueDate, 'D');
const humanizePointDueDate = (dueDate, format) => dayjs(dueDate).format(format);

export {isExpired, humanizePointDueDate};
