package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path"
	"regexp"
	"strings"

	"github.com/gocolly/colly"
)

type Apple struct {
	Logo string `logo`
}

func downloadFile(url string) {
	r := regexp.MustCompile(`\?(.*)`)
	fileName := path.Base(url)
	fileName = strings.Replace(fileName, r.FindString(fileName), "", -1)
	response, e := http.Get(url)
	fmt.Println(fileName)
	if e != nil {
		log.Fatal(e)
	}
	defer response.Body.Close()

	os.MkdirAll("./tmp/", os.ModeDevice.Perm())
	file, err := os.Create("./tmp/" + fileName)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	_, err = io.Copy(file, response.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("File downloaded!")
}

func request() {
	r := regexp.MustCompile(`\{(?:[^{}]|(\{(?:[^{}]|())*\}))*\}`)
	c := colly.NewCollector()
	c.OnHTML(".ac-gf-content", func(e *colly.HTMLElement) {
		// fmt.Println(r.FindString(e.Text))
		apple := Apple{}
		jsonString := r.FindString(e.Text)
		err := json.Unmarshal([]byte(jsonString), &apple)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Printf("%+v\n", apple)
		downloadFile(apple.Logo)
	})
	c.OnResponse(func(r *colly.Response) {
		// fmt.Println(string(r.Body))
	})
	c.OnRequest((func(r *colly.Request) {
		// r.Headers.Set("User-Agent", "...")
	}))
	c.Visit("https://www.apple.com/tw") // robots.txt -> User-agent: *
}
