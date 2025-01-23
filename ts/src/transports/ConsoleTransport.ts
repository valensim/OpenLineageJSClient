import { Transport } from './TransportInterface';
import { BaseEvent } from '../events/BaseEvent';

export class ConsoleTransport implements Transport {
	async emit<T=void>(event: BaseEvent): Promise<T> {
		console.log(JSON.stringify(event, null, 2));
		return Promise.resolve() as Promise<T>;
	}
}