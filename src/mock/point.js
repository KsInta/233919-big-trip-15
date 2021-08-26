import {getRandomInteger, getRandomArrayElement, getRandomArray} from '../utils/common.js';
import {isExpired, humanizePointDueDate} from '../utils/point.js';
import dayjs from 'dayjs';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const CITIES = ['Amsterdam', 'Chamonix', 'Geneva', 'Tokio', 'Rome', 'London', 'Zurich'];
const DESCRIPTION_TEXTS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'];
const EVENT_OFFERS = [
  {
    title: 'Add luggage',
    price: 30,
  },
  {
    title: 'Switch to comfort class',
    price: 100,
  },
  {
    title: 'Add meal',
    price: 15,
  },
  {
    title: 'Choose seats',
    price: 5,
  },
  {
    title: 'Travel by train',
    price: 40,
  },
];

const MAX_DESCRIPTION_LENGTH = 5;
const MAX_OFFERS_LENGTH = 5;
const PLUG_IMG_URL = 'http://picsum.photos/248/152?r=';
const PLUG_IMG_URL_LIMIT = 1000;
const MIN_POINT_PRICE = 100;
const MAX_POINT_PRICE = 10000;
const MIN_POINT_TIME_MINUTES_LENGTH = 5;
const MAX_POINT_TIME_MINUTES_LENGTH = 60;

const generateDate = () => {

  const minDaysGap = -7;
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(minDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day');
};

const generatePoint = () => {
  const pointStartTime = generateDate();
  const pointTimeLength = getRandomInteger(MIN_POINT_TIME_MINUTES_LENGTH, MAX_POINT_TIME_MINUTES_LENGTH);
  const pointEndTime = dayjs(pointStartTime).add(pointTimeLength, 'minute');

  return {
    isExpired: isExpired(pointStartTime),
    basePrice: getRandomInteger(MIN_POINT_PRICE, MAX_POINT_PRICE),
    dateFrom: {
      pointStartFormatDate: humanizePointDueDate(pointStartTime, 'YYYY-MM-DDTHH:mm:ss'),
      pointStartFormatDay: humanizePointDueDate(pointStartTime, 'MMM DD'),
      pointStartFormatTime: humanizePointDueDate(pointStartTime, 'HH:mm'),
    },
    dateTo: {
      pointEndFormatDate: humanizePointDueDate(pointEndTime, 'YYYY-MM-DDTHH:mm:ss'),
      pointEndFormatTime: humanizePointDueDate(pointEndTime, 'HH:mm'),
      pointTimeLength,
    },
    type: getRandomArrayElement(POINT_TYPES),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    destination: {
      name: getRandomArrayElement(CITIES),
      description: getRandomArray(DESCRIPTION_TEXTS, MAX_DESCRIPTION_LENGTH).join(' '),
      pictures: [
        {
          src: `${PLUG_IMG_URL}${getRandomInteger(0, PLUG_IMG_URL_LIMIT)}`,
        },
      ],
    },
    offers: getRandomArray(EVENT_OFFERS, MAX_OFFERS_LENGTH),
  };
};

export {generatePoint, POINT_TYPES, CITIES, PLUG_IMG_URL};
