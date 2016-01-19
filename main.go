package main

import (
	"craftcode.xyz/src"
	"fmt"
	"github.com/julienschmidt/httprouter"
	ws "golang.org/x/net/websocket"
	"net/http"
	//"strings"
)

func main() {
	//dbSession := craftcode.GetSession("127.0.0.0")
	router := httprouter.New()
	// Serve the Static files at ./public
	router.ServeFiles("/src/*filepath", http.Dir("./public"))

	router.GET("/", func(res http.ResponseWriter, req *http.Request, ps httprouter.Params) {
		res.Header().Set("Cache-Control", "public,must-revalidate,max-age=86400")
		res.Header().Set("Expires", "Mon, 25 Jun 2016 21:31:12 GMT")
		fmt.Println("GET AT : " + req.URL.Path)

		http.ServeFile(res, req, "./views/index.html")

	})

	router.Handler("GET", "/socket", ws.Handler(func(sock *ws.Conn) {
		var response string
		for {
			ws.Message.Receive(sock, &response)
			fmt.Println(response)
			ws.Message.Send(sock, response)
		}
	}))

	craftcode.StartServer(router, "3003", "3443")
}
