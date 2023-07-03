import { Policy } from "../types/Policy";

export class ExpoPolicy implements Policy {
    private retryCount: number;
    constructor(public maxTries: number = 5, private initWaitTime: number = 500) {
        this.retryCount = 0;
    }
    currentWait(): number {
        return Math.pow(this.initWaitTime, this.retryCount);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    shouldRetry(err: any): boolean {
        if (err.response && err.response.status >= 400) {
            return false;
        } else if (this.retryCount < this.maxTries) {
            return true;
        }
        return false;
    }
    incrementTry(): void {
        this.retryCount++;
    }
}
