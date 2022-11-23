export class Connection {
  public static inst: Connection
  public socket = new WebSocket('ws://localhost:8888/ws')
  public rpcTable: Map<string, Function> = new Map()
  public rpcQueue: { method: string; args: any[] }[] = []

  public constructor() {
    Connection.inst = this
  }

  public connect(): void {
    console.log('Attempting Connection...')

    this.socket.onopen = () => {
      console.log('Connected Successfully')
      this.sendRpcInQueue();
    }

    this.socket.onmessage = (msg) => {
      this.blobToBase64(msg.data).then((data) => {
        if (data && typeof data === 'string') {
          const rpc = atob(data.split(',')[1])
          console.log('onmessage: ', rpc)
          const r = rpc.split(',');
          this.onRpc(r[0], r.slice(1))
        }
      })
    }

    this.socket.onclose = (event) => {
      console.log('Socket Closed: ', event)
    }

    this.socket.onerror = (error) => {
      console.log('Socket Error: ', error)
    }
  }

  public rpc(rpc: string, ...args: any[]): void {
    if (this.socket.readyState != this.socket.OPEN) {
      this.rpcQueue.push({ method: rpc, args: args })
      return
    }
    console.log('write socket: ', rpc, args)
    var uint8array = new TextEncoder().encode(rpc + ',' + args)
    this.socket.send(uint8array)
  }

  public onRpc(methodName: string, ...args: any[]): void {
    if (!this.rpcTable.has(methodName)) return
    this.rpcTable.get(methodName)?.apply(this, ...args)
  }

  public register(methodName: string, method: Function): void {
    this.rpcTable.set(methodName, method)
  }

  public unregister(methodName: string): void {
    this.rpcTable.delete(methodName)
  }

  private sendRpcInQueue(): void {
    while (this.rpcQueue.length > 0) {
        const rpc = this.rpcQueue.shift();
        if (!rpc) continue;
        this.rpc(rpc.method, rpc.args);
    }
  }

  private blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, _) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }
}
