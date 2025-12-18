import { Router } from "express";
import {
  yearWise, specificMonth, upcomingHolidays, specificDays, holidaysType } from "../controllers/api.controller.js";

const apiRouter = Router();

apiRouter.get("/api/holidays/upcoming", upcomingHolidays);
apiRouter.get("/api/holidays/check/:date", specificDays);
apiRouter.get("/api/holidays/:year/types", holidaysType);
apiRouter.get("/api/holidays/:year/:month", specificMonth);
apiRouter.get("/api/holidays/:year", yearWise);

export default apiRouter;
