const getRandomInteger = (min = 0, max = 1) => (min > max) ? (Math.floor(Math.random() * (min + 1 - max)) + max) : (Math.floor(Math.random() * (max + 1 - min)) + min);

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const getRandomArray = (parentArray, length) => {
  const arrayCopy = parentArray.slice();
  const newArrayLength = getRandomInteger(0, length + 1);
  const indexStart = getRandomInteger(0, arrayCopy.length - 1);
  const indexEnd = indexStart + newArrayLength;
  const description = arrayCopy.slice(indexStart, indexEnd);
  return description;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomInteger, getRandomArrayElement, getRandomArray, updateItem};
