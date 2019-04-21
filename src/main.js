
import Model from './model';
import Controller from './controller';
import PointsTable from './points-table';

const pointTableContainer = document.querySelector(`.trip-points`);

const model = new Model();
const pointsTable = new PointsTable(model, pointTableContainer);
const controller = new Controller(model, pointsTable);
controller.init();

