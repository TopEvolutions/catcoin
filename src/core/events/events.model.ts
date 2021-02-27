import { EventEmitter } from 'events';
import { SysEvents } from '../enums/sys-events.enum';

export class SystemEventsManager {
    private static readonly _emitter = new EventEmitter();

    static emit(event: SysEvents): void {
        SystemEventsManager._emitter.emit(event);
    }

    static on(event: SysEvents, cb: () => void): void {
        SystemEventsManager._emitter.on(event, cb.bind(this));
    }
}