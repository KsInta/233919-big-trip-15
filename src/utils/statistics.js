const makeItemsUniq = (items) => [...new Set(items)];

const countPointsByType = (points, type) =>
  points.filter((point) => point.type === type).length;

const countPointsMoneyByType = (points, type) =>
  points.reduce((counter, point) => {
    if (point.type === type) {
      return counter + point.basePrice;
    }

    return counter;
  }, 0);

export {makeItemsUniq, countPointsByType, countPointsMoneyByType};
