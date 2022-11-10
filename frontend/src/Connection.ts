export class Connection {
  public static inst: Connection
  private socket = new WebSocket('ws://localhost:8888/ws')

  public constructor() {
    Connection.inst = this
  }

  public connect(): void {
    console.log('Attempting Connection...')

    this.socket.onopen = () => {
      console.log('Connected Successfully')
    }

    this.socket.onmessage = (msg) => {
      console.log(msg)
    }

    this.socket.onclose = (event) => {
      console.log('Socket Closed: ', event)
    }

    this.socket.onerror = (error) => {
      console.log('Socket Error: ', error)
    }
  }

  public rpc(rpc: string, ...args: any[]): void {
    console.log('write socket: ', rpc, args)
    var uint8array = new TextEncoder().encode(rpc + "," + args);
    this.socket.send(uint8array)
  }
}
