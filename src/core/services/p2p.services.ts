import { ItalChain } from '../chain/chain.model';
import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { SysEvents } from '../enums/sys-events.enum';
import { SystemEventsManager } from '../events/events.model';

export enum SocketMessages {
    blockchain = 'blockchain',
}

export type P2PMessageType = {
    payload: any;
    message: SocketMessages;
}

export const P2PMessage = (message: SocketMessages, payload: any) => JSON.stringify({
    message,
    payload,
} as P2PMessageType);

export class P2PServices {

    private _peers: WebSocket[] = [];
    private _server: WebSocket.Server;

    constructor(
        private readonly _port: number,
        private readonly _blockchain: ItalChain,
        private readonly _peersAddresses: string[],
    ) {
        this._server = new WebSocket.Server({ port: this._port });
        this.connectToPeers();
        this.listenToSysEvents();
    }

    start(): void {
        this._server.on(
            'connection',
            (socket: WebSocket) => this.handlePeerConnection(socket),
        );
        process.on('SIGINT', () => this._server.close());
        console.log(`WS Server listening for connections on port [${this._port}]`);
    }

    private handlePeerConnection(socket: WebSocket): void {
        console.log(`New peer connected`);
        this._peers.push(socket);
        socket.send(P2PMessage(
            SocketMessages.blockchain,
            this._blockchain.chain,
        ));
        socket.on(
            'message',
            (message: string) => this.handlePeerMessage(message),
        );
    }

    private handlePeerMessage(message: string): void {
        if (!message) return;

        let decodedMessage: P2PMessageType;
        try {
            decodedMessage = JSON.parse(message) as P2PMessageType;
        } catch (e) {
            console.log('Could not decode message from peer');
            return;
        }

        switch (decodedMessage.message) {
            case SocketMessages.blockchain:
                this._blockchain.replaceChain(decodedMessage.payload);
                break;
            default:
                console.log('Unknown message type received from peer.');
                return;
        }
    }

    private connectToPeers() {
        if (!this._peersAddresses || !this._peersAddresses.length) {
            console.log('No peers to connect to');
            return;
        }

        this._peersAddresses.forEach((addr, idx) => {
            const peer = new WebSocket(addr);
            peer.on('open', () => {
                this.connectPeer(peer);
                console.log(`Connected peer ${idx}`);
            });

            peer.on(
                'message',
                (message: string) => this.handlePeerMessage(message),
            );
        });
    }

    private connectPeer(peer: WebSocket) {
        this._peers.push(peer);
        const msg = P2PMessage(
            SocketMessages.blockchain,
            this._blockchain.chain,
        );

        peer.send(msg);
    }

    private listenToSysEvents() {
        SystemEventsManager.on(SysEvents.newBlockAddedToChain, () => {
            this.syncChain();
        });
    }

    private syncChain(): void {
        this._peers.forEach(peer => {
            peer.send(P2PMessage(SocketMessages.blockchain, this._blockchain.chain));
        });
    }
}