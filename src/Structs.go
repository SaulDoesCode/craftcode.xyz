package craftcode

import (
	//"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
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
	Status   string        `bson:"Status,omitempty"`
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
