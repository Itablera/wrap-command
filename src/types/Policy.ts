export interface Policy {
    maxTries: number;
    currentWait: () => number;
    shouldRetry: (err: any) => boolean;
    incrementTry: () => void;
}