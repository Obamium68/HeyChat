<?php
// try {
//     session_start();
//     echo 'i in';
//     $f = $_FILES['file_caricato']['type']; //Tipo file
//     $nome = $_FILES['file_caricato']['name']; //Nome file
//     $nome_tmp = $_FILES['file_caricato']['tmp_name']; //Percorso file
//     if (($f == "image/jpeg") || ($f == "image/gif") || ($f == "image/png")) //Verifica se immagine
//         //Caricamento file sul server nel percorso indicato come 2° parametro
//         move_uploaded_file($nome_tmp, "../img/data/chats/" . $_SESSION['path']);
//     else
//         die();
// } catch (Exception $e) {
//     die($e);
// }

if(isset($_POST['image']) && isset($_POST['name'])) {
    $imageData = $_POST['image'];
    $imageName = $_POST['name'];
  
    // Rimuovi il prefisso "data:image/png;base64," dalla stringa di dati dell'immagine.
    $imageData = str_replace('data:image/png;base64,', '', $imageData);
    $imageData = str_replace(' ', '+', $imageData);
  
    // Decodifica la stringa di dati dell'immagine e salvala nella cartella "img".
    $decodedImage = base64_decode($imageData);
    $filename = 'D:\xampp\htdocs\GitHub\HeyChat\img\data\chats\\' . $imageName . '.png';
    
    /*!!!!ANDRE SICURAMENTE QUI DEVI CAMBIARE CON LA TUA PATH!!!!
    - Presumibilmente dovrebbe essere quella che ho inserito.
    - Ricordati di creare la cartella chats in data (se Github non l'ha fatto)
    */
    //$filename = 'C:\xampp\htdocs\heyChat\img\data\chats\\' . $imageName . '.png';
    try{
        file_put_contents($filename, $decodedImage);
    }catch(PDOException $e){
        echo $e;
    }
}

?>