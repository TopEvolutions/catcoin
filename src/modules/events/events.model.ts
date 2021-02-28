import { EventEmitter } from 'events';
import { SysEvents } from './sys-events.enum';

export class SystemEventsManager {
    private static readonly _emitter = new EventEmitter();

    static emit(event: SysEvents, data?: any): void {
        SystemEventsManager._emitter.emit(event, data);
    }

    static on(event: SysEvents, cb: (data?: any) => void): void {
        SystemEventsManager._emitter.on(event, cb.bind(this));
    }
}