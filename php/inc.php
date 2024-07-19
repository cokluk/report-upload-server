<?php

if($use_domain) { $host = $domain; }

if($ssl) {
    $host = "https://".$host."/";
} else {
    $host = "http://".$host."/";
}

if(isset($_FILES)) {
    
    $file = $_FILES['files'];
 
    $target_dir = "public/";

    $target_file = $target_dir . $file['name'][0];
 
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    $tempfilename = "public/".genRandom().".".$imageFileType;
 
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" && $imageFileType != "webm" ) {
        echo "not allowed filetype";
        $uploadOk = 0;
    }

    if ($uploadOk == 0) {
        echo "file not uploaded.";
    } else {
        if (move_uploaded_file($file["tmp_name"][0], $tempfilename)) {
            $response = new stdClass();
            $response->attachments = array();
            $response->attachments[0] = new stdClass();
            $response->attachments[0]->proxy_url = $host."/".$tempfilename;
            $response->attachments[0]->url =  $host."/".$tempfilename;
            echo json_encode($response);
        } else {
            echo "error uploading your file.";
        }
    }
 
}
 
function genRandom() {
    return "s4-".substr(md5(rand()), 0, 100)."-".rand(1000000000,9999999999);
}
