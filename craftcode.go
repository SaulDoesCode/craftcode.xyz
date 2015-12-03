package main

import (
	"compress/gzip"
	//"encoding/base64"
	"fmt"
	"io"
	//"io/ioutil"
	"net/http"
	"os"
	"strings"
	//"time"

	//"github.com/jeffail/gabs"
	//"golang.org/x/crypto/bcrypt"
	//"golang.org/x/net/websocket"
	//"gopkg.in/mgo.v2"
	//"gopkg.in/mgo.v2/bson"
	//"github.com/dgrijalva/jwt-go"
)


func main() {

	var fileMux = http.NewServeMux()                                                  // Create a separate ServeMux for the static files
	fileMux.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./public")))) // Handle and Serve Static files from the fileMux ServeMux

	http.HandleFunc("/", serveGZIP(func(res http.ResponseWriter, req *http.Request) {

		res.Header().Set("Cache-Control", "public  ,max-age=0")

		if strings.Contains(req.URL.Path, ".") {
			fileMux.ServeHTTP(res, req)
		} else if req.URL.Path == "/" {
			res.Header().Set("Content-Type", "text/html")
			readCopyServe("./views/index.html", res, req)
		} else {
			errorCodeHandler(res, req, http.StatusNotFound)
		}

	}))

	http.HandleFunc("/admin", serveGZIP(func(res http.ResponseWriter, req *http.Request) {
    res.Header().Set("Content-Type", "text/html")
    readCopyServe("./views/admin.html", res, req)
  }))

	// Listen on Chosen Port and check for errors
	errHTTP := http.ListenAndServeTLS(":3000","./certs/server-cert.pem", "./certs/server-key.pem", nil)
	//errHTTP := http.ListenAndServe(":3000", nil)
	check(errHTTP)
  fmt.Println("Server Running on port 3000")
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

// getLocalpath Simple function to get the Script/binarry's Current Directory path  as a String
func getLocalpath() string {
	localpath, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	return localpath
}

func exists(name string) bool {
	if _, err := os.Stat(name); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}

func existsAS(name string) string {
	Stat, err := os.Stat(name)
	if err == nil && !os.IsNotExist(err) {
		if Stat.Mode().IsDir() {
			return "directory"
		} else if Stat.Mode().IsRegular() {
			return "file"
		}
	}
	return "invalid"
}

func readCopyServe(filename string, res http.ResponseWriter, req *http.Request) {
	file, err := os.Open(filename)
	if err != nil {
		errorCodeHandler(res, req, http.StatusNotFound)
	}
	io.Copy(res, file)
	file.Close()
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
	if "" == w.Header().Get("Content-Type") {
		// If no content type, apply sniffing algorithm to un-gzipped body.
		w.Header().Set("Content-Type", http.DetectContentType(b))
	}
	return w.Writer.Write(b)
}

func serveGZIP(fn http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		if !strings.Contains(req.Header.Get("Accept-Encoding"), "gzip") {
			fn(res, req)
			return
		}
		res.Header().Set("Content-Encoding", "gzip")
		gz := gzip.NewWriter(res)
		defer gz.Close()
		gzr := gzipResponseWriter{Writer: gz, ResponseWriter: res}
		fn(gzr, req)
	})
}

func errorCodeHandler(res http.ResponseWriter, r *http.Request, status int) {
	res.WriteHeader(status)
	if status == http.StatusNotFound {
		res.Write([]byte("Error 404 , What you're lookin for... , well it ain't here"))
	}
}
