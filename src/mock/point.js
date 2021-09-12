import {getRandomInteger, getRandomArrayElement, getRandomArray} from '../utils/common.js';
import {isExpired, humanizePointDueDate} from '../utils/point.js';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';

//const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const CITIES = ['Amsterdam', 'Chamonix', 'Geneva', 'Tokio', 'Rome', 'London', 'Zurich'];
const DESCRIPTION_TEXTS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'];
const EVENT_OFFERS = [
  {
    type: 'TAXI',
    offers: [
      {
        title: 'TAXI Add luggage',
        price: 30,
      },
      {
        title: 'TAXI Switch to comfort class',
        price: 100,
      },
      {
        title: 'TAXI Add meal',
        price: 15,
      },
      {
        title: 'TAXI Choose seats',
        price: 5,
      },
      {
        title: 'TAXI Travel by train',
        price: 40,
      },
    ],
  },
  {
    type: 'BUS',
    offers: [
      {
        title: 'BUS Add luggage',
        price: 30,
      },
      {
        title: 'BUS Switch to comfort class',
        price: 100,
      },
      {
        title: 'BUS Choose seats',
        price: 5,
      },
      {
        title: 'BUS Travel by train',
        price: 40,
      },
    ],
  },
  {
    type: 'TRAIN',
    offers: [
      {
        title: 'TRAIN Add luggage',
        price: 30,
      },
      {
        title: 'TRAIN Switch to comfort class',
        price: 100,
      },
      {
        title: 'TRAIN Add meal',
        price: 15,
      },
      {
        title: 'TRAIN Choose seats',
        price: 5,
      },
      {
        title: 'TRAIN Travel by train',
        price: 40,
      },
    ],
  },
  {
    type: 'SHIP',
    offers: [
      {
        title: 'SHIP Add luggage',
        price: 30,
      },
      {
        title: 'SHIP Switch to comfort class',
        price: 100,
      },
      {
        title: 'SHIP Add meal',
        price: 15,
      },
      {
        title: 'SHIP Travel by train',
        price: 40,
      },
    ],
  },
  {
    type: 'FLIGHT',
    offers: [
      {
        title: 'FLIGHT Add luggage',
        price: 30,
      },
      {
        title: 'FLIGHT Switch to comfort class',
        price: 100,
      },
      {
        title: 'FLIGHT Add meal',
        price: 15,
      },
      {
        title: 'FLIGHT Choose seats',
        price: 5,
      },
      {
        title: 'FLIGHT Travel by train',
        price: 40,
      },
    ],
  },
  {
    type: 'CHECK-IN',
    offers: null,
  },
  {
    type: 'SIGHTSEEING',
    offers: [
      {
        title: 'SIGHTSEEING Add luggage',
        price: 30,
      },
      {
        title: 'SIGHTSEEING Switch to comfort class',
        price: 100,
      },
      {
        title: 'SIGHTSEEING Add meal',
        price: 15,
      },
      {
        title: 'SIGHTSEEING Choose seats',
        price: 5,
      },
    ],
  },
  {
    type: 'RESTAURANT',
    offers: null,
  },
];

const MAX_DESCRIPTION_LENGTH = 5;
//const MAX_OFFERS_LENGTH = 5;
const PLUG_IMG_URL = 'http://picsum.photos/248/152?r=';
const PLUG_IMG_URL_LIMIT = 1000;
const MIN_POINT_PRICE = 100;
const MAX_POINT_PRICE = 10000;
const MIN_POINT_TIME_MINUTES_LENGTH = 5;
const MAX_POINT_TIME_MINUTES_LENGTH = 300;

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
  const pointOffers = EVENT_OFFERS[getRandomInteger(0, EVENT_OFFERS.length - 1)];
  const offersSelected = {};
  if (pointOffers.offers !== null) {
    pointOffers.offers.map((offer) => {
      offersSelected[`${pointOffers.type}-${pointOffers.offers.indexOf(offer)}`] = Boolean(getRandomInteger(0, 1));
    });
  }

  return {
    pointOffers,
    id: nanoid(),
    isExpired: isExpired(pointStartTime),
    basePrice: getRandomInteger(MIN_POINT_PRICE, MAX_POINT_PRICE),
    dateFrom: {
      pointStartFormatDate: humanizePointDueDate(pointStartTime, 'DD-MM-YYYY HH:mm:ss'),
      pointStartFormatDay: humanizePointDueDate(pointStartTime, 'MMM DD'),
      pointStartFormatTime: humanizePointDueDate(pointStartTime, 'HH:mm'),
    },
    dateTo: {
      pointEndFormatDate: humanizePointDueDate(pointEndTime, 'DD-MM-YYYYTHH:mm:ss'),
      pointEndFormatTime: humanizePointDueDate(pointEndTime, 'HH:mm'),
      pointTimeLength,
    },
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
    type: pointOffers.type,
    offers: pointOffers.offers,
    offersSelected,
  };
};

export {generatePoint, CITIES, PLUG_IMG_URL, EVENT_OFFERS, DESCRIPTION_TEXTS, MAX_DESCRIPTION_LENGTH, PLUG_IMG_URL_LIMIT, MIN_POINT_PRICE, MAX_POINT_PRICE};
