const Messages = {
      // Node related error messages
      NODE_ALREADY_CLOSED: `You cannot re-use (connect to) a destroyed node. Please add this node again.`,
      NODE_NOT_CONNECTED: `Cannot proceed action, node must be in a state of being connected to peer WebSocket.`,

      // Lotus related error messages
      LOTUS_NOT_INSTANTIATED: `Lotus must be instantiated first.`
};

type ErrorKeys = keyof typeof Messages;

export class LotusError extends Error {
      public code: string;
      public name: string;

      constructor(key: ErrorKeys, ...args: any[]) {
            if (!Messages[key]) throw new TypeError(`The error key '${key}' doesn't exist.`);
            // @ts-ignore
            const message = typeof Messages[key] === 'function' ? Messages[key](...args) : Messages[key];

            super(message);
            this.code = key;
            this.name = `LotusError [${this.code}]`;
      }
}