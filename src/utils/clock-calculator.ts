import {
  ClockType,
  ClockEntity,
} from '../clockwise/persistence/entities/clock.entity';

export class ClockCalculator {
  static getWorkedTimeAmount(clocks: ClockEntity[]): string {
    const timeInMillis = this.calculateTime(clocks, ClockType.CLOCK_IN);

    return this.formatTime(timeInMillis);
  }

  static getInterval(clocks: ClockEntity[]): string {
    const timeInMillis = this.calculateTime(clocks, ClockType.CLOCK_OUT);

    return this.formatTime(timeInMillis);
  }

  private static calculateTime(
    clocks: ClockEntity[],
    clockType: ClockType,
  ): number {
    let timeInMillis = 0;
    const adjustment = (index: number) =>
      index + (clockType === ClockType.CLOCK_IN ? 0 : 1);

    for (let i = adjustment(0); i < clocks.length - 1; i += 2) {
      const start = new Date(clocks[i].time);
      const end = new Date(clocks[i + 1].time);
      timeInMillis += end.getTime() - start.getTime();
    }

    if (this.shouldCalculateLastClock(clocks, clockType)) {
      const lastClock = new Date(clocks[clocks.length - 1].time);
      timeInMillis += this.getCurrentTime().getTime() - lastClock.getTime();
    }

    if (
      clocks[clocks.length - 1] &&
      !this.isSameDateAsToday(clocks[clocks.length - 1].time) &&
      clockType === ClockType.CLOCK_OUT
    ) {
      const lastClockTime = new Date(clocks[clocks.length - 1].time);
      const endOfDay = new Date(lastClockTime);
      endOfDay.setHours(23, 0, 0, 0);
      const offset = -3 * 60;

      endOfDay.setMinutes(endOfDay.getMinutes() + offset);

      const difference = endOfDay.getTime() - lastClockTime.getTime();
      timeInMillis -= difference;
    }

    return timeInMillis < 0 ? 0 : timeInMillis;
  }

  /**
   * Calculates the time difference when:
   * 1. Clocks' length is even and last clock is 'clock out'
   * 2. Clocks' length is odd and last clock is 'clock in'
   * */
  private static shouldCalculateLastClock(
    clocks: ClockEntity[],
    clockType: ClockType,
  ): boolean {
    return (
      clocks.length % 2 !== 0 &&
      clocks[clocks.length - 1].clockType === clockType &&
      this.isSameDateAsToday(clocks[clocks.length - 1].time)
    );
  }

  private static formatTime(timeInMillis: number): string {
    const seconds = timeInMillis / 1000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Returns 'true' if the time passed is equal to the current date.
   */
  private static isSameDateAsToday(time: Date): boolean {
    const currentDate = new Date();
    const offset = -3 * 60;

    currentDate.setMinutes(currentDate.getMinutes() + offset);

    return (
      time.getFullYear() === currentDate.getFullYear() &&
      time.getMonth() === currentDate.getMonth() &&
      time.getUTCDate() === currentDate.getUTCDate()
    );
  }

  /**
   * Return current time and fix "GMT -3" timezone:
   **/
  private static getCurrentTime() {
    const currentTime = new Date();
    const offset = -3 * 60;
    currentTime.setMinutes(currentTime.getMinutes() + offset);
    return currentTime;
  }
}
