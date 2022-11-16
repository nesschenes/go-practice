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
      this.blobToBase64(msg.data).then((data) => {
        if (data && typeof data === "string") {
            const rpc = atob(data.split(",")[1]);
            console.log("onmessage: ", rpc)
            this.onRpc(rpc.split(",")[0], rpc.split(",")[1]);
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
    console.log('write socket: ', rpc, args)
    var uint8array = new TextEncoder().encode(rpc + "," + args);
    this.socket.send(uint8array)
  }

  public onRpc(methodName: string, ...args: any[]): void {

  }

  private blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
}
