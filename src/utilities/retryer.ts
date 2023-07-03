import { DataTransformation } from '@itablera/wrap-common';
import { Command } from '../types/Command';
import { Policy } from '../types/Policy';
import { ResultOrError } from '@itablera/wrap-common';
import { delay } from './delay';

export async function retryer<ExpectedResult, ErrorType = any>(command: Command<ExpectedResult>, policy: Policy, until?: { path: string, expectedValue: any }): Promise<ResultOrError<ExpectedResult, ErrorType>> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            policy.incrementTry();
            const result = await command.execute();
            
            if( until && DataTransformation.getPropertyFromPath(result, until.path) !== until.expectedValue ) {  
                throw new Error('Unexpected value');
            }

            return ResultOrError.ok<ExpectedResult>(result);
        } catch (error) {
            if (policy.shouldRetry(error)) {
                await delay(policy.currentWait);
            } else {
                console.log(error);
                return ResultOrError.fail<ErrorType>(error);
            }
        }
    }
}