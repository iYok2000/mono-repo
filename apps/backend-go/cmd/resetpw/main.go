package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "host=127.0.0.1 port=5432 user=yok-test password=your_secure_password_here dbname=yok sslmode=disable"
	}

	newPassword := "Admin123!@#"
	if len(os.Args) > 1 {
		newPassword = os.Args[1]
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), 12)
	if err != nil {
		log.Fatal("hash error:", err)
	}
	fmt.Println("New hash:", string(hash))

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatal("db open error:", err)
	}
	defer db.Close()

	res, err := db.Exec(
		`UPDATE admin_users SET password_hash=$1, failed_login_attempts=0, locked_until=NULL WHERE username='superadmin'`,
		string(hash),
	)
	if err != nil {
		log.Fatal("update error:", err)
	}

	rows, _ := res.RowsAffected()
	fmt.Printf("Updated %d row(s). Password reset to: %s\n", rows, newPassword)
}
