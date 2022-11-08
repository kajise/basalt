import { Lotus } from '../Lotus';
import { EventEmitter } from 'events';
import { LotusError } from '../LotusError';
import * as WebSocket from 'ws';
import { Dispatcher, Pool } from 'undici';

export class Node {
	/**
	 * The manager that instantiated this class
	 */
	public readonly manager: Lotus;

	/**
	 * A boolean that determines if the connection to this Node is closed.
	 */
	public readonly closed: boolean;

	/**
	 * The dynamic socket that this node instantiated.
	 */
	public socket: WebSocket | null = null;

	/**
	 * The dynamic socket that this node instantiated.
	 */
	public pool: Pool | null = null;

	/**
	 * The options that the node uses.
	 */
	public readonly options: NodeOptions;

	/**
	 * A boolean that determines if the connection to this Node is initialized.
	 */
	public get connected(): boolean {
		if (!this.socket) return false;
		return this.socket.readyState === WebSocket.OPEN;
	}

	/** Returns the address for this node. */
	public get address(): string {
		return `${this.options.hostname}:${this.options.port}`;
	}

	/**
	 * Creates an instance of Node.
	 * @param manager
	 * @param options
	 */
	constructor(manager: Lotus, options: NodeOptions) {
		this.manager = manager;
		if (!this.manager) throw new LotusError("LOTUS_NOT_INSTANTIATED");
		// this.players = new Map();

		this.options = {
			port: 2333, password: "youshallnotpass",
			...options
		};

		if (this.options.secureNode) {
			this.options.port = 443;
		}

		// booleans or static readonly datas
		this.closed = false;

		this.pool = new Pool(`http${this.options.secureNode ? "s" : ""}://${this.address}`, this.options.poolOptions);
	}

	public connect(): void {
		if (this.closed) throw new LotusError('NODE_ALREADY_CLOSED');
		if (this.connected) return;

		const connectionHeaders = {
			Authorization: this.options.password
		};

		this.socket = new WebSocket(`ws${this.options.secureNode ? "s" : ""}://${this.options.hostname}`, {
			headers: connectionHeaders
		});
	}

	/**
	 * Sends queried data to the node. Returns a boolean if request is successfully sent.
	 * @param data
	 */
	public send(data: unknown): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this.closed) return reject(new LotusError("NODE_ALREADY_CLOSED"));
			if (!this.connected) return reject(new LotusError("NODE_NOT_CONNECTED"));

			// Make sure is data is present, if it's a JSON make sure it's not malformed.
			if (!data || !JSON.stringify(data).startsWith("{")) return reject(false);

			// @ts-ignore
			this.socket.send(JSON.stringify(data), (error: Error) => {
				if (error) reject(error);
				else resolve(true);
			});
		});
	}
}

export interface NodeOptions {
	/** The host the node is gonna use (e.g: example-node.lotus.systems). */
	hostname: string;
	/** The port the node is gonna use (e.g: 443, 8080, 91202). */
	port?: number;
	/** The password for logging in to the node. */
	password?: string;
	/** If the node uses SSL. */
	secureNode?: boolean;
	/** Timeout for API calls, when timeout is reached. Request will throw an error. */
	requestTimeout: number;
	/** Options for the undici http pool used for http requests */
	poolOptions: Pool.Options
}