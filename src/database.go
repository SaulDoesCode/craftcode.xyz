package craftcode

import (
	"gopkg.in/mgo.v2"
)

// GetSession : Gets a MongoDB Session
func GetSession(url string) *mgo.Session {
	session, err := mgo.Dial(url)
	if err != nil {
		panic(err)
	}
	session.SetSafe(&mgo.Safe{})
	defer session.Close()
	return session
}
