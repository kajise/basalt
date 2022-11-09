import EventEmitter from "events";

export interface Lotus {
	/** Event that's emitted when Lotus successfully connects to a node. */
	on(event: "nodeConnect", listener: () => void): this;
	/** Event that's emitted when Lotus concludes the connection a node. Thus, preventing future requests to it. */
	on(event: "nodeDestroy", listener: () => void): this;
	/** Event that's emitted when Lotus received an error from a node. */
	on(event: "nodeError", listener: () => void): this;
	/** Event that's emitted when Lotus is reconnecting to a node. */
	on(event: "nodeReconnect", listener: () => void): this;
	/** Event that's emitted when a node disconnects from Lotus. */
	on(event: "nodeDisconnect", listener: () => void): this;
	/** Event that's emitted when a node sends an event packet to Lotus. */
	on(event: "nodeRecvPacket", listener: () => void): this;

	/** Event that's emitted when a player finishes a queue. */
	on(event: "queueFinish", listener: () => void): this;
	/** Event that's emitted when a player is created. */
	on(event: "playerSummon", listener: () => void): this;
	/** Event that's emitted when a player is destroyed. */
	on(event: "playerDestroy", listener: () => void): this;
	/** Event that's emitted when a player is moved from a different voice channel. */
	on(event: "playerMoveChannel", listener: () => void): this;
	/** Event that's emitted when a player is disconnected from a voice channel. */
	on(event: "playerDisconnect", listener: () => void): this;

	/** Event that's emitted when a track ends. */
	on(event: "trackEnd", listener: () => void): this;
	/** Event that's emitted when a track starts. */
	on(event: "trackStart", listener: () => void): this;
	/** Event that's emitted when a track experiences an error playing. */
	on(event: "trackError", listener: () => void): this;
	/** Event that's emitted when a track freezes in the middle of playback. */
	on(event: "trackFreeze", listener: () => void): this;
}

export class Lotus extends EventEmitter {
	constructor() {
		super();
	}
}