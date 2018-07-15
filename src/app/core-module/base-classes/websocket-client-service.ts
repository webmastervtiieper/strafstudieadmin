import { ISignalRConnection, IConnectionOptions, SignalR } from 'ng2-signalr';
import { Subject } from 'rxjs/Rx';
export enum Status { connecting, connected, reconnecting, disconnected }

export class WebsocketClientService {
    private _connectionReady = false;
    // connectionStatus = new ConnectionStatus();
    private _hubName: string;

    private _connection: ISignalRConnection;
    private _isConnected: boolean = false;
    connectionStarted = new Subject<boolean>();
    constructor(private signalr: SignalR, private connectionOptions: IConnectionOptions, private autoStart = true) {
        this._connection = this.signalr.createConnection(this.connectionOptions);
        this._connection.status.subscribe((s) => {
            this._isConnected = false;
            switch (s.value) {
                case Status.connected: {
                    this._isConnected = true;
                    this.connectionStarted.next(true);
                    break;
                }
            }
        });
        if (this.autoStart) { this.startConnection() }
    }

    startConnection() {
        this._connection.start();
    }

    close() {
        this._connection.stop();
    }

    set hubName(value) { this._hubName = value; }
    get hubName() { return this._hubName }
    set isConnected(value) { this._isConnected = value; }
    get isConnected() { return this._isConnected }
    get connection() { return this._connection }
}