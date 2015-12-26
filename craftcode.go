package main

import (
	"compress/gzip"
	"encoding/json"
	"fmt"
	"github.com/jeffail/gabs"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/net/http2"
	"golang.org/x/net/websocket"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"
	//"golang.org/x/oauth2/google"
	"github.com/dgrijalva/jwt-go"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Post : defines a Blog Post
type Post struct {
	id          bson.ObjectId `bson:"_id"`
	title       string        `bson:"title"`
	content     string        `bson:"content"`
	author      string        `bson:"author"`
	description string        `bson:"description"`
	created     time.Time     `bson:"created"`
}

// User : defines a new user
type User struct {
	ID       bson.ObjectId `bson:"_id"`
	Username string        `bson:"Username"`
	Name     string        `bson:"Name"`
	Email    string        `bson:"Email"`
	Hash     string        `bson:"Hash"`
	Time     time.Time     `bson:"Time"`
	Online   bool          `bson:"Online"`
	Status   string        `bson:"Online,omitempty"`
	Token    string        `bson:"Token"`
}

// Permissions : defines User/Admin/Moderator permisions
type Permissions struct {
	CreatePost bool `bson:"CreatePost,omitempty"`
	DeletePost bool `bson:"DeletePost,omitempty"`
	Ban        bool `bson:"Ban,omitempty"`
	Moderate   bool `bson:"Moderate,omitempty"`
	FullPerms  bool `bson:"FullPerms,omitempty"`
}

// Admin : defines a new Administrator
type Admin struct {
	ID       bson.ObjectId `bson:"_id"`
	Username string        `bson:"Username"`
	Perms    Permissions   `bson:"Perms"`
}

//var googleClientID = readFile("./private/google-key")
//var googleSecret = readFile("./private/google-secret")
var jwtkey = readFile("./private/jwt.rsa")
var jwtpubkey = readFile("./private/jwt.rsa.pub")

func main() {

	var srv http.Server
	srv.Addr = ":3443"
	http2.ConfigureServer(&srv, nil)

	/*conf := &oauth2.Config{
	    ClientID:     googleClientID,
	    ClientSecret: googleSecret,
	    RedirectURL:  "/signin",
	    Scopes: []string{
	        "https://www.googleapis.com/auth/userinfo.profile",
	        "https://www.googleapis.com/auth/userinfo.email",
	    },
	    Endpoint: google.Endpoint,
	  }
	  // Redirect user to Google's consent page to ask for permission
	  // for the scopes specified above.
	  url := conf.AuthCodeURL("state")
	  fmt.Printf("Visit the URL for the auth dialog: %v", url)

	  // Handle the exchange code to initiate a transport.
	  tok, err := conf.Exchange(oauth2.NoContext, "authorization-code")
	  if err != nil {
	      log.Fatal(err)
	  }
	  client := conf.Client(oauth2.NoContext, tok)
	  client.Get("...")*/

	session, err := mgo.Dial("127.0.0.1")
	check(err)
	session.SetSafe(&mgo.Safe{})
	defer session.Close()
	postbase := session.DB("craftcode").C("posts")
	userbase := session.DB("craftcode").C("users")

	var admins []Admin
	session.DB("craftcode").C("admins").Find(nil).All(&admins)

	if postbase.EnsureIndex(mgo.Index{
		Key:    []string{"title", "content"},
		Unique: true,
	}) != nil {
		fmt.Printf("Duplicate Username Entry: %v\n", err)
	}

	if userbase.EnsureIndex(mgo.Index{
		Key:    []string{"Username", "Email"},
		Unique: true,
	}) != nil {
		fmt.Printf("Duplicate Username Entry: %v\n", err)
	}

	var fileMux = http.NewServeMux()                                                  // Create a separate ServeMux for the static files
	fileMux.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./public")))) // Handle and Serve Static files from the fileMux ServeMux

	http.HandleFunc("/", serveGZIP(func(res http.ResponseWriter, req *http.Request) {

		res.Header().Set("Cache-Control", "public,must-revalidate,max-age=86400")
		res.Header().Set("Expires", "Mon, 25 Jun 2016 21:31:12 GMT")
		//res.Header().Set("Last-Modified", "Mon, 03 Jan 2015 21:31:12 GMT")

		if strings.Contains(req.URL.Path, ".") {
			fileMux.ServeHTTP(res, req)
		} else if req.URL.Path == "/" {
			res.Header().Set("Content-Type", "text/html")
			readCopyServe("./views/index.html", res, req)
		} else {
			errorCodeHandler(res, req, http.StatusNotFound)
		}

	}))

	http.HandleFunc("/admin", func(res http.ResponseWriter, req *http.Request) {
		if checkAdminStatus(req.Cookies(), admins) {
			res.Header().Set("Content-Type", "text/html")
			readCopyServe("./views/admin.html", res, req)
		} else {
			http.Redirect(res, req, "/", 303)
		}
	})

	http.Handle("/admin-channel", websocket.Handler(func(ws *websocket.Conn) {
		var err error

		if checkAdminStatus(ws.Request().Cookies(), admins) {
			for {

				var responseJSON string
				if err = websocket.Message.Receive(ws, &responseJSON); err != nil {
					fmt.Println(err.Error())
					break
				}

				parsed := parseJSON([]byte(responseJSON))
				querytype := parsed.Path("querytype").Data().(string)
				if querytype == "newpost" {
					postbase.Insert(&Post{
						id:          bson.NewObjectId(),
						title:       parsed.Path("post.title").Data().(string),
						content:     parsed.Path("post.content").Data().(string),
						author:      parsed.Path("post.author").Data().(string),
						description: parsed.Path("post.description").Data().(string),
						created:     time.Now(),
					})
				} else if querytype == "editpost" {

				} else if querytype == "newadmin" {
					session.DB("craftcode").C("admins").Insert(&Admin{
						Username: parsed.Path("admin.username").Data().(string),
						Perms: Permissions{
							CreatePost: parsed.Path("admin.perms.CreatePost").Data().(bool),
							DeletePost: parsed.Path("admin.perms.DeletePost").Data().(bool),
							Ban:        parsed.Path("admin.perms.Ban").Data().(bool),
							Moderate:   parsed.Path("admin.perms.Moderate").Data().(bool),
							FullPerms:  parsed.Path("admin.perms.FullPerms").Data().(bool),
						},
					})
				}

				if err = websocket.Message.Send(ws, responseJSON); err != nil {
					fmt.Println("Can't send")
					break
				}
			}
		}
	}))

	http.Handle("/signup", websocket.Handler(func(ws *websocket.Conn) {
		for {
			var responseMap = make(map[string]string)
			var reply string

			websocket.Message.Receive(ws, &reply)

			var token string
			for _, cookie := range ws.Request().Cookies() {
				if cookie.Name == "jwt" || cookie.Name == "JWT" {
					token = cookie.Value
					break
				}
			}
			if token != "" && tokenValid(token) {
				websocket.Message.Send(ws, "All ready Signed Up ")
			}

			success, msg := SignUp([]byte(reply), userbase)
			if success == true {
				responseMap["success"] = "true"
			} else {
				responseMap["success"] = "false"
			}
			responseMap["msg"] = msg

			response, _ := json.Marshal(responseMap)

			websocket.Message.Send(ws, string(response))

		}
	}))

	http.Handle("/queryonline", websocket.Handler(func(ws *websocket.Conn) {
		var token string
		for _, cookie := range ws.Request().Cookies() {
			if cookie.Name == "jwt" || cookie.Name == "JWT" {
				token = cookie.Value
				break
			}
		}
		if tokenValid(token) {
			for {
				var reply string
				websocket.Message.Receive(ws, &reply)

				username := getUsernameFromJWT(ws.Request().Cookies())
				if reply != "" {
					userbase.Update(bson.M{"Username": username}, bson.M{"$set": bson.M{"Online": true, "Status": reply}})
				} else if reply == "offline" {
					fmt.Printf("User went Offline")
					userbase.Update(bson.M{"Username": username}, bson.M{"$set": bson.M{"Online": false, "Status": "Offline"}})
				} else {
					userbase.Update(bson.M{"Username": username}, bson.M{"$set": bson.M{"Online": true, "Status": "Online"}})
				}

				websocket.Message.Send(ws, "status set")
			}
		}
	}))

	http.HandleFunc("/signin", serveGZIP(func(res http.ResponseWriter, req *http.Request) {
		if req.Method == "POST" {
			requestData, err := ioutil.ReadAll(req.Body)
			check(err)

			var responseMap = make(map[string]string)

			success, token, username := SignIn(requestData, userbase)
			if success {
				responseMap["msg"] = "Welcome " + username + " successfully Signed in"
				responseMap["username"] = username
				responseMap["success"] = "true"
				fmt.Printf(token)
				cookie := http.Cookie{Name: "JWT", Value: token, Expires: time.Now().Add(100 * 24 * time.Hour), HttpOnly: true, MaxAge: 0, Path: "/"}
				http.SetCookie(res, &cookie)
				//userbase.Find(bson.M{"Username" : username}).One(bson.M{"ProfilePic" :})
			} else {
				responseMap["success"] = "false"
				if token == "404" {
					responseMap["msg"] = "User " + username + " not found on system please check your details or sign up"
				} else {
					responseMap["msg"] = "Sorry " + username + " Could not Sign In check details"
				}
			}

			response, _ := json.Marshal(responseMap)

			res.Header().Set("Content-Type", "text/json")

			res.Write([]byte(response))

		} else if req.Method == "GET" {
			res.Header().Set("Content-Type", "text/html")
			readCopyServe("./views/signup.html", res, req)
		}
	}))

	go func() {
		err := http.ListenAndServe(":3003", http.RedirectHandler("https://192.168.10.108:3443", http.StatusFound))
		check(err)
	}()

	// Listen on Chosen Port and check for errors
	//errHTTP := http.ListenAndServeTLS(":3000","./private/server-cert.pem", "./private/server-key.pem", nil)
	log.Fatal(srv.ListenAndServeTLS("./private/craftcode.crt", "./private/craftcode.key"))
	//errHTTP := http.ListenAndServe(":3000", nil)
	//check(errHTTP)
	fmt.Println("Server Running on port 3443")
}

// SignUp : creates a new user entry
func SignUp(userJSON []byte, userbase *mgo.Collection) (bool, string) {
	jsonParsed := parseJSON(userJSON)

	pswdhash, err := bcrypt.GenerateFromPassword([]byte(jsonParsed.Path("Password").Data().(string)), 9)
	if err != nil {
		fmt.Printf("Error Hashing Password: " + err.Error())
	}

	newEntry := &User{
		ID:       bson.NewObjectId(),
		Username: jsonParsed.Path("Username").Data().(string),
		Name:     jsonParsed.Path("Name").Data().(string),
		Email:    jsonParsed.Path("Email").Data().(string),
		Hash:     string(pswdhash),
		Time:     time.Now(),
	}

	mgoerr := userbase.Insert(newEntry)
	if mgoerr != nil {
		if mgo.IsDup(mgoerr) {
			return false, "Username or Email you've entered already is already registered please try again "
		}
		fmt.Printf(mgoerr.Error())
		return false, "An Error has occured could not create account."
	}
	return true, "Account created thank you " + jsonParsed.Path("Username").Data().(string)
}

// SignIn : signs in an existing user
func SignIn(userJSON []byte, userbase *mgo.Collection) (bool, string, string) {
	jsonParsed := parseJSON(userJSON)
	username := jsonParsed.Path("Username").Data().(string)
	user, err := getUser(username, userbase)
	if err != nil {
		return false, "404", username
	}
	hash := []byte(user.Hash)
	pass := []byte(jsonParsed.Path("Password").Data().(string))

	if bcrypt.CompareHashAndPassword(hash, pass) == nil {
		if tokenValid(user.Token) {
			userbase.Update(bson.M{"Username": username}, bson.M{"$set": bson.M{"LastSignIn": time.Now()}})
			return true, user.Token, username
		}
		newtoken := makeToken(user)
		userbase.Update(bson.M{"Username": username}, bson.M{"$set": bson.M{"LastSignIn": time.Now(), "Token": newtoken}})
		return true, newtoken, username
	}
	return false, "", username
}

func getUsernameFromJWT(cookies []*http.Cookie) string {
	var username string
	for _, cookie := range cookies {
		if cookie.Name == "jwt" || cookie.Name == "JWT" {
			token := cookie.Value
			if Token, _ := jwt.Parse(token, nil); Token != nil {
				if Token.Claims["username"] != nil {
					username = Token.Claims["username"].(string)
				}
			}
			break
		}
	}
	return username
}

func checkAdminStatus(cookies []*http.Cookie, admins []Admin) bool {
	var isAdmin = false
	var token string
	for _, cookie := range cookies {
		if cookie.Name == "jwt" || cookie.Name == "JWT" {
			fmt.Printf("\n Admin Accessed \n")
			token = cookie.Value
			if Token, _ := jwt.Parse(token, nil); Token != nil {
				if Token.Claims["username"] != nil {
					username := Token.Claims["username"].(string)
					if username == "SaulDoesCode" {
						isAdmin = true
					} else {
						for _, admin := range admins {
							if username == admin.Username {
								isAdmin = true
							}
						}
					}
				}
			}
			break
		}
	}
	return isAdmin && tokenValid(token)
}

func getUser(usernameOrEmail string, userbase *mgo.Collection) (User, error) {
	var err error
	result := User{}
	if validateEmail(usernameOrEmail) {
		err = userbase.Find(bson.M{"Email": usernameOrEmail}).One(&result)
	} else {
		err = userbase.Find(bson.M{"Username": usernameOrEmail}).One(&result)
	}
	if err != nil {
		fmt.Printf(err.Error())
	}
	return result, err
}
func tokenValid(Token string) bool {
	token, err := jwt.Parse(Token, func(token *jwt.Token) (interface{}, error) { return []byte(jwtpubkey), nil })
	if err == nil && token.Valid {
		return true
	}
	return false
}

func makeToken(user User) string {
	// Create the token
	token := jwt.New(jwt.GetSigningMethod("RS256"))
	// Set some claims
	token.Claims["username"] = user.Username
	token.Claims["iss"] = "craftcode.xyz"
	token.Claims["iat"] = time.Now()
	token.Claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
	// Sign and get the complete encoded token as a string
	tokenString, err := token.SignedString([]byte(jwtkey))
	if err != nil {
		fmt.Println(err.Error())
	}
	return tokenString
}

func validateEmail(email string) bool {
	Re := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return Re.MatchString(email)
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

// getLocalpath Simple function to get Script/binary's Current path as string
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

func readFile(filename string) string {
	read, err := ioutil.ReadFile(filename)
	check(err)
	return strings.TrimSpace(string(read))
}

func readJSONfile(filename string) *gabs.Container {
	return parseJSON([]byte(readFile(filename)))
}

func parseJSON(jsonstring []byte) *gabs.Container {
	jsonparsed, err := gabs.ParseJSON(jsonstring)
	check(err)
	return jsonparsed
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
