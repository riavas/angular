interface BroadcastChannel {
    postMessage(message: any): void;
    close(): void;
    onmessage: (event: MessageEvent) => void;
  }
  
  declare var BroadcastChannel: {
    prototype: BroadcastChannel;
    new(name: string): BroadcastChannel;
  };