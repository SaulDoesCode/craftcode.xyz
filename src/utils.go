package craftcode

import (
	//"io"
	"io/ioutil"
	//"log"
	"os"
	"strings"
)

// ReadFile - Reads a file and returns it as String
func ReadFile(filename string) string {
	read, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	return strings.TrimSpace(string(read))
}

// ExistsAs - check if path exists returns "directory" if its a folder "file" if it's a file and "invalid" on everything else
func ExistsAs(name string) string {
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

// Check - panic on error nil
func Check(e error) {
	if e != nil {
		panic(e)
	}
}

// GetLocalpath Simple function to get Script/binary's Current path as string
func GetLocalpath() string {
	localpath, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	return localpath
}

// StringSliceIncludes checks if the given slice contains the given string
func StringSliceIncludes(slice []string, s string) bool {
	// checks if the given slice contains the given string
	for _, v := range slice {
		if v == s {
			return true
		}
	}
	return false
}
