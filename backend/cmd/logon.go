package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
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

func signIn(account string, password string) error {
	fmt.Println("signIn: ", account, password)

	client, err := client()
	if err != nil {
		log.Fatalln(err)
		return err
	}

	errorCode := 2
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
				errorCode = 0
				fmt.Println("Login Successfully: ", account)
				token := generateToken(16)
				recordToken(doc.Ref.ID, account, token)
				if err := wsconn.WriteMessage(2, []byte("onSignIn,0,"+token)); err != nil {
					log.Fatalf("Failed writting rpc onSignIn: %v", err)
				}
			} else {
				errorCode = 1
				fmt.Println("Login Failed")
				if err := wsconn.WriteMessage(2, []byte("onSignIn,1")); err != nil {
					log.Fatalf("Failed writting rpc onSignIn: %v", err)
				}
			}
		}
	}

	if errorCode != 0 && errorCode != 1 {
		fmt.Println("Login Failed")
		if err := wsconn.WriteMessage(2, []byte("onSignIn,2")); err != nil {
			log.Fatalf("Failed writting rpc onSignIn: %v", err)
		}
	}

	defer client.Close()
	return nil
}

func signUp(firstName string, lastName string, account string, password string) error {
	fmt.Println("signUp: ", firstName, lastName, account, password)

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
		if wserr := wsconn.WriteMessage(2, []byte("onSignUp,1")); wserr != nil {
			log.Fatalf("Failed writting rpc onSignUp: %v", wserr)
		}
		return err
	} else {
		if wserr := wsconn.WriteMessage(2, []byte("onSignUp,0")); wserr != nil {
			log.Fatalf("Failed writting rpc onSignUp: %v", wserr)
		}
	}

	defer client.Close()
	return nil
}

func checkLogon(token string) error {
	fmt.Println("checkLogon: ", token)

	client, err := client()
	if err != nil {
		log.Fatalln(err)
		return err
	}

	errorCode := 2
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
		if doc.Data()["token"] == token {
			errorCode = 0
		}
	}

	if errorCode != 0 {
		fmt.Println("Login Failed")
		if err := wsconn.WriteMessage(2, []byte("onToken,1")); err != nil {
			log.Fatalf("Failed writting rpc onToken: %v", err)
		}
	} else {
		fmt.Println("Login Successfully")
		if err := wsconn.WriteMessage(2, []byte("onToken,0")); err != nil {
			log.Fatalf("Failed writting rpc onToken: %v", err)
		}
	}

	defer client.Close()
	return nil
}

func generateToken(length int) string {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return hex.EncodeToString(b)
}

func recordToken(id string, account string, token string) error {
	fmt.Println("record token: ", id, account, token)

	client, err := client()
	if err != nil {
		log.Fatalln(err)
		return err
	}

	_, err = client.Collection("users").Doc(id).Set(context.Background(), map[string]interface{}{
		"token": token,
	}, firestore.MergeAll)
	if err != nil {
		log.Fatalf("Failed setting alovelace: %v", err)
		return err
	}

	defer client.Close()
	return nil
}
