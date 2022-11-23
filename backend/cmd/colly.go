package main

import (
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

func getImage(url string) {
	fmt.Println("getImage: ", url)
	result := []string{}
	c := colly.NewCollector()
	c.OnHTML("img[src]", func(e *colly.HTMLElement) {
		// fmt.Println(r.FindString(e.Text))
		src := e.Attr("src")
		if src == "" {
			return
		}
		result = append(result, src)
		// apple := Apple{}
		// jsonString := r.FindString(e.Text)
		// err := json.Unmarshal([]byte(jsonString), &apple)
		// if err != nil {
		// 	fmt.Println(err)
		// }
		// fmt.Printf("%+v\n", apple)
		// // downloadFile(apple.Logo)
		// if err := wsconn.WriteMessage(2, []byte("onGetImage,"+apple.Logo)); err != nil {
		// 	log.Fatalf("Failed writting rpc onGetImage: %v", err)
		// }
	})
	c.OnResponse(func(r *colly.Response) {
		// fmt.Println(string(r.Body))
	})
	c.OnRequest((func(r *colly.Request) {
		// r.Headers.Set("User-Agent", "...")
	}))
	c.OnScraped((func(r *colly.Response) {
		fmt.Println(result)
		if err := wsconn.WriteMessage(2, []byte("onGetImage,"+strings.Join(result, " "))); err != nil {
			log.Fatalf("Failed writting rpc onGetImage: %v", err)
		}
	}))
	c.Visit(url) // robots.txt -> User-agent: *
}

// func getImage(url string) {
// 	fmt.Println("getImage")
// 	r := regexp.MustCompile(`\{(?:[^{}]|(\{(?:[^{}]|())*\}))*\}`)
// 	c := colly.NewCollector()
// 	c.OnHTML(".ac-gf-content", func(e *colly.HTMLElement) {
// 		// fmt.Println(r.FindString(e.Text))
// 		apple := Apple{}
// 		jsonString := r.FindString(e.Text)
// 		err := json.Unmarshal([]byte(jsonString), &apple)
// 		if err != nil {
// 			fmt.Println(err)
// 		}
// 		fmt.Printf("%+v\n", apple)
// 		// downloadFile(apple.Logo)
// 		if err := wsconn.WriteMessage(2, []byte("onGetImage,"+apple.Logo)); err != nil {
// 			log.Fatalf("Failed writting rpc onGetImage: %v", err)
// 		}
// 	})
// 	c.OnResponse(func(r *colly.Response) {
// 		// fmt.Println(string(r.Body))
// 	})
// 	c.OnRequest((func(r *colly.Request) {
// 		// r.Headers.Set("User-Agent", "...")
// 	}))
// 	c.Visit(url) // robots.txt -> User-agent: *
// }
