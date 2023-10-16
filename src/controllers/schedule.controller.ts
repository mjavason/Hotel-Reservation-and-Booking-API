import { scheduleService } from '../services';
import { roomController } from './room.controller';

// export const startSecondsJob = scheduleService.startEverySecond(() => logme());
// export const startEveryMinuteJob = scheduleService.startEveryMinute(() => payHourlySalaries());
// export const startHourlyJob = scheduleService.startHourly(() => payHourlySalaries());
// export const startDailyJob = scheduleService.startDaily(() => payDailySalaries());
// export const startWeeklyJob = scheduleService.startWeekly(() => payWeeklySalaries());
// export const startMonthlyJob = scheduleService.startMonthly(() => payMonthlySalaries());
// export const startYearlyJob = scheduleService.startYearly(() => payYearlySalaries());

function sayHello() {
  console.log('Hello at', new Date());
}

class Controller {
  // startEverySecond() {
  //   scheduleService.startEverySecond(async () => {
  //     sayHello();
  //   });
  // }

  // startEveryMinute() {
  //   scheduleService.startEveryMinute(async () => {
  //     sayHello();
  //   });
  // }

  // startEvery10thMinute() {
  //   scheduleService.startEvery10thMinute(() => {});
  // }

  // startEvery30thMinute() {
  //   scheduleService.startEvery30thMinute(() => {});
  // }

  // startHourlyJobs() {
  //   scheduleService.startHourly(async () => {});
  // }

  startDailyJobs() {
    scheduleService.startDaily(async () => {
      roomController.remindReservationHolders(24);
      roomController.markRoomsAsDone();
    });
  }

  // startWeeklyJobs() {
  //   scheduleService.startWeekly(async () => {});
  // }

  // startMonthlyJobs() {
  //   scheduleService.startMonthly(async () => {});
  // }

  // startYearlyJobs() {
  //   scheduleService.startYearly(async () => {});
  // }
}

export const scheduleController = new Controller();
