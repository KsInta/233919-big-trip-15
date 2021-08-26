import dayjs from 'dayjs';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const isExpired = (dueDate) => dayjs().isAfter(dueDate, 'D');
const humanizePointDueDate = (dueDate, format) => dayjs(dueDate).format(format);

export {render, RenderPosition, createElement, isExpired, humanizePointDueDate};
