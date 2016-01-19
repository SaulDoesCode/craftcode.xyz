package craftcode

import (
	"fmt"
	"github.com/gorilla/handlers"
	"os"
	//"github.com/julienschmidt/httprouter"
	"golang.org/x/net/http2"
	//"golang.org/x/net/websocket"
	"io"
	//"io/ioutil"
	"log"
	"net/http"
)

// StartServer - Listen on Chosen Port and check for errors
func StartServer(handler http.Handler, redirectHTTPport string, port string) {
	go func() {
		err := http.ListenAndServe(":"+redirectHTTPport, http.RedirectHandler("https://192.168.10.108:"+port, http.StatusFound))
		if err != nil {
			panic(err)
		}
	}()

	server := &http.Server{
		Addr:    ":" + port,
		Handler: handlers.CompressHandlerLevel(handler, 9),
	}

	http2.ConfigureServer(server, &http2.Server{})
	log.Fatal(server.ListenAndServeTLS("./private/craftcode.crt", "./private/craftcode.key"))
	fmt.Println("Server Running on port :" + port)
}

// ReadCopyServe - Efficiently read and serve a file
func ReadCopyServe(filename string, res http.ResponseWriter, req *http.Request) {
	file, err := os.Open(filename)
	if err != nil {
		HTTPErrorHandler(res, req, http.StatusNotFound)
	}
	io.Copy(res, file)
	file.Close()
}

// HTTPErrorHandler - handles http errors
func HTTPErrorHandler(res http.ResponseWriter, r *http.Request, status int) {
	res.WriteHeader(status)
	if status == http.StatusNotFound {
		res.Write([]byte("Error 404 , What you're lookin for... , well it ain't here"))
	}
}
