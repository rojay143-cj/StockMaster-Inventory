<?php 
    require '../connection/connection.php';
    echo '<script src="../api/datatables.js"></script>
    <link rel="stylesheet" href="../api/datatables.css">';
?>



<?php 
    /*  CODE FOR ITEM */
    $getItem = "SELECT * FROM item JOIN supplier ON item.supplier_id = supplier.supplier_id";
    $getItem = mysqli_query($conn, $getItem);
    while($rowItem = $getItem -> fetch_assoc()){
        $dataItem[] = $rowItem;
    }

    if(isset($_POST['add_item'])){
        $txtItemname = $_POST['txtItemname'];
        $txtItemprice = $_POST['txtItemprice'];
        $txtItemquantity = $_POST['txtItemquantity'];
        $reorder = 15;
        $supCat = $_POST['supCat'];
        $barcode = rand(1,999999999);
        $txtItemdes = $_POST['txtItemdes'];

        if(empty($txtItemname && $txtItemprice && $txtItemquantity && $supCat && $barcode)){
            echo "
                <script>
                    $(document).ready(function(){
                        alert('Failed To Add The Item (Fill-up the form)!');
                    })
                </script>
            ";
        }else{
            $sqlinsertItem = "INSERT INTO item (item_name, unit_price, quantity, reorder_point, barcode, description, supplier_id) 
            VALUES ('$txtItemname','$txtItemprice','$txtItemquantity', '$reorder','$barcode', '$txtItemdes','$supCat')";
            $sqlinsertItem = mysqli_query($conn, $sqlinsertItem);
        }
    }
?>

<?php
/* CODE FOR SUPPLIER */
    $getSup= "SELECT * FROM supplier";
    $getSup = mysqli_query($conn, $getSup);
    while($rowSup = $getSup -> fetch_assoc()){
        $supData[] = $rowSup;
    }

    if(isset($_POST['reg_sup'])){
        $txtSupname = $_POST['txtSupname'];
        $txtSupconname = $_POST['txtSupcontactname'];
        $txtSupemail = $_POST['txtSupemail'];
        $txtSupphone = $_POST['txtSupphone'];
        $txtAddress = $_POST['txtSupaddress'];
        if(!empty($txtSupname) && !empty($txtSupconname) && !empty($txtSupemail) && !empty($txtSupphone) && !empty($txtAddress)){
            $sqlInsertSup = "INSERT INTO supplier (supplier_name, contact_name, contact_email, contact_phone, address) 
            VALUES ('$txtSupname','$txtSupconname','$txtSupemail','$txtSupphone','$txtAddress')";
            $sqlInsertSup = mysqli_query($conn, $sqlInsertSup);
            echo "
                <script>
                    $(document).ready(function(){
                        alert('Successfully Registered');
                    })
                </script>
            ";
        }else{
            echo "
            <script>
                $(document).ready(function(){
                    alert('Supplier Registration Unsuccesfull (Fill-up the form)');
                })
            </script>
        ";
        }
    }
?>