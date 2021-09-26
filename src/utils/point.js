import dayjs from 'dayjs';

const dateDifferenceInDay = (dateEnd, dateStart) => dayjs(dateEnd).diff(dateStart);

const humanizePointDueDate = (dueDate, format) => dayjs(dueDate).format(format);

const sortPointTimeUp = (pointA, pointB) => new Date(pointA.dateFrom) - new Date(pointB.dateFrom);

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const isDatesEqual = (pointA, pointB) => dayjs(pointA.dateFrom.pointStartFormatDate).isSame(pointB.dateFrom.pointStartFormatDate, 'D');

const getDiffDuration = (dateEnd, dateStart) => dayjs(dateEnd).diff(dayjs(dateStart));

const sortPointDuration = (pointA, pointB) => getDiffDuration(pointB.dateTo, pointB.dateFrom) - getDiffDuration(pointA.dateTo, pointA.dateFrom);

const getDurationFormated = (dateStart, dateEnd) => {
  const diffDuration = (dateEnd !== undefined) ? getDiffDuration(dateEnd, dateStart) : dateStart;
  let minutes = Math.floor(diffDuration / 60000);
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  const days = Math.floor(hours / 24);
  hours = hours % 24;

  const diffDays = days > 0 ? `${(`00${days}`).slice(-2)}D` : '';

  let diffHours = '';
  if(hours > 0) {
    diffHours = `${(`00${hours}`).slice(-2)}H`;
  } else {
    if(days > 0) {
      diffHours = '00H';
    }
  }
  const diffMinutes = minutes > 0 ? `${(`00${minutes}`).slice(-2)}M` : '00M';

  return `${diffDays} ${diffHours} ${diffMinutes}`;
};

export {dateDifferenceInDay, humanizePointDueDate, sortPointTimeUp, sortPointDuration, sortPointPrice, isDatesEqual, getDurationFormated, getDiffDuration};
