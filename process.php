<?php
// Koneksi ke database
$conn = new mysqli("localhost", "root", "", "db_contact");

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Proses data jika form dikirim
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $message = $_POST["message"];

    // Masukkan ke database
    $sql = "INSERT INTO contacts (name, email, phone, message) VALUES ('$name', '$email', '$phone', '$message')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Pesan berhasil dikirim!');</script>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
