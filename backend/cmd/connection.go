package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"reflect"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	CheckOrigin: func(r *http.Request) bool { return true },
}

var rpc = map[string]interface{}{
	"signup": signup,
	"signin": signin,
}

func connect() {
	fmt.Println("start connecting...")
	setupRoutes()
	http.ListenAndServe(":8888", nil)
}

func setupRoutes() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Simple Server")
	})

	http.HandleFunc("/ws", serve)
}

func reader(conn *websocket.Conn) {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		fmt.Println("read socket: ", string(p))
		rpc := strings.Split(string(p), ",")
		method := rpc[0]
		param := make([]interface{}, len(rpc[1:]))
		for i, v := range rpc[1:] {
			param[i] = v
		}
		call(method, param)

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}

func serve(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Host)

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	reader(ws)
}

func call(funcName string, params []interface{}) (result interface{}, err error) {
	fmt.Println("rpc: ", funcName, ", params: ", params)
	f := reflect.ValueOf(rpc[funcName])
	if len(params) != f.Type().NumIn() {
		err = errors.New("The number of params is out of index.")
		return
	}
	in := make([]reflect.Value, len(params))
	for k, param := range params {
		in[k] = reflect.ValueOf(param)
	}
	var res []reflect.Value
	res = f.Call(in)
	result = res[0].Interface()
	return
}
