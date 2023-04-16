<?php
try {
    $_POST['path'] = 'lenera.jpeg';
    $f = $_FILES['file_caricato']['type']; //Tipo file
    $nome = $_FILES['file_caricato']['name']; //Nome file
    $nome_tmp = $_FILES['file_caricato']['tmp_name']; //Percorso file
    if (($f == "image/jpeg") || ($f == "image/gif") || ($f == "image/png")) //Verifica se immagine
        //Caricamento file sul server nel percorso indicato come 2° parametro
        move_uploaded_file($nome_tmp, "../img/data/chats/" . $_POST['path']);
    else
        die('tuo padre');
} catch (Exception $e) {
    die($e);
}

?>