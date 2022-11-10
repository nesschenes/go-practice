package main

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
)

func app() (*firebase.App, error) {
	ctx := context.Background()
	conf := &firebase.Config{ProjectID: "go-react-album"}
	app, err := firebase.NewApp(ctx, conf)
	if err != nil {
		log.Fatalln(err)
		return nil, err
	}
	return app, nil
}

func client() (*firestore.Client, error) {
	ctx := context.Background()
	conf := &firebase.Config{ProjectID: "go-react-album"}
	app, err := firebase.NewApp(ctx, conf)
	if err != nil {
		log.Fatalln(err)
		return nil, err
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalln(err)
		return nil, err
	}
	return client, nil
}

func signin(account string, password string) error {
	fmt.Println("signin: ", account, password)

	client, err := client()
	if err != nil {
		log.Fatalln(err)
		return err
	}

	iter := client.Collection("users").Documents(context.Background())
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("Failed to iterate: %v", err)
		}
		fmt.Println(doc.Data())
		if doc.Data()["account"] == account {
			if doc.Data()["password"] == password {
				fmt.Println("Login Successfully: ", account)
			} else {
				fmt.Println("Login Failed")
			}
		} else {
			fmt.Println("Login Failed")
		}
	}

	defer client.Close()
	return nil
}

func signup(firstName string, lastName string, account string, password string) error {
	fmt.Println("signup: ", firstName, lastName, account, password)

	client, err := client()
	if err != nil {
		log.Fatalln(err)
		return err
	}

	_, _, err = client.Collection("users").Add(context.Background(), map[string]interface{}{
		"firstName": firstName,
		"lastName":  lastName,
		"account":   account,
		"password":  password,
	})
	if err != nil {
		log.Fatalf("Failed adding alovelace: %v", err)
		return err
	}

	defer client.Close()
	return nil
}
