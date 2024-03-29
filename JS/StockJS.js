$(document).ready(function(){
    var item_array = [];
    $('#btn_order_item').on('click',function(){
            let cusName = $('#cusName').val();
            let tend_amount = $('#tend_amount').val();
            let cusMob = $('#cusMob').val();
            let payType = $('#payType :selected').val();
            let totalAmount = $('#total_amount').text()
            let changeAmount = tend_amount - totalAmount;
            let number = Math.floor(Math.random() * 99999999) + 1;
            let ourDate = new Date().toISOString().split('T')[0];
            let prefix = "MSTR-";
            let refNumber = prefix + ourDate + number;
            let order_status = "In Progress";
            item_list = {
                'customer_name': cusName,
                'tend_amount': tend_amount,
                'total_amount':totalAmount,
                'change_amount': changeAmount,
                'customer_mobile': cusMob,
                'pay_type': payType,
                'ref_number': refNumber,
                'order_stat': order_status
            };
            item_array.push(item_list);
            if(($('#cusName').val() != null && $('#cusName').val() != '' ) && ($('#tend_amount').val() != null && $('#tend_amount').val() != '')){
                $.ajax({
                    type: 'POST',
                    url: '../source/code.php',
                    data:{item_array:JSON.stringify(item_array)},
                    success: function(){
                        item_array = [];
                        alert("Order placed");
                    },
                    error: function(){
                        alert('Failed to Send data!');
                    }
                });
            }else{
                alert('Please Enter fill-up the form!');
            }
    });
    $('.btn_buy').on('click', function () {
        $('#display_item').empty();
        var card = $(this).closest('.card-body');
        let item_name = card.find('.item_name').text();
        let item_price = parseInt(card.find('.item_price').val());
        let item_quantity = parseInt(card.find('.item_quantity').val());
        let item_id = card.find('.item_id').val();

        var existingItem = item_array.find(item => item.item_id === item_id);
        if (existingItem) {
            existingItem.item_quantity += item_quantity;
        } else {
            item_list = {
                'item_name': item_name,
                'item_price': item_price,
                'item_quantity': item_quantity,
                'item_id': item_id,
            };
            item_array.push(item_list);
        };
        displayItems();
    });
    function displayItems() {
        $('#display_item').empty();
        for (var i = 0; i < item_array.length; i++) {
            var items = '<div class="d-flex justify-content-center border m-2">';
            items += '<div class="col-sm-6 mt-2 mb-2">';
            items += '<span id="item_name">' + item_array[i].item_name + ': </span>';
            items += '<span id="item_price">₱' + item_array[i].item_price + ' </span>';
            items += '</div>';
            items += '<div class="col-sm-6">';
            items += '<button class="btn btn-dark btn-minus" data-index="' + i + '">-</button><input type="text" class="w-25 mx-2 text-center text-truncate border-0 item-quantity" value="' + item_array[i].item_quantity + '" disabled><button class="btn btn-dark btn-plus" data-index="' + i + '">+</button>';
            items += '</div></div>';
            $('#display_item').append(items);
        }
    }
    $(document).on('click', '.btn-minus', function () {
        var index = $(this).data('index');
        item_array[index].item_quantity--;
        if(item_array[index].item_quantity == 0){
            item_array.splice(index, 1);
        }
        displayItems();
    });
    $(document).on('click', '.btn-plus', function () {
        var index = $(this).data('index');
        item_array[index].item_quantity++;
        displayItems();
    });
    function modaltable() {
        $('#order_record').empty();
        let total_amount = 0;
        for (var i = 0; i < item_array.length; i++) {
            var row = '<tr>';
            row += '<td>' + item_array[i].item_name + '</td>';
            row += '<td>₱' + item_array[i].item_price + '</td>';
            row += '<td>' + item_array[i].item_quantity + ' qty</td>';
            var subtotal = item_array[i].item_price * item_array[i].item_quantity;
            row += '<td>₱' + subtotal + '</td>';
            row += '</tr>';
            total_amount += subtotal;
            $('#order_record').append(row);
        }
        $('#total_amount').html(
            total_amount
        );
        $('.total_amount').val(total_amount);
    }
    $('#btn_modal').on('click', function(){
        $('#exampleModal').modal('show');
        modaltable();
    });
    $('#tend_amount').on('blur',function(){
        let total_amount = parseFloat($('.total_amount').val());
        let tend_amount = $(this).val();

        if(tend_amount < total_amount){
            $('.error').text('Invalid Amount').css({'color':'red','font-size':'1.2rem'});
        }else if(isNaN(tend_amount) || isNaN (total_amount)){
            $('.error').text('Invalid Input');
        }else{
            $('.error').text('');
        }
    });
    $('#orderSummary').on('click',function(){
        $('#summaryModal').modal('show');
        $('#exampleModal').modal('hide');
        let cusName = $('#cusName').val();
        let tend_amount = $('#tend_amount').val();
        let cusMob = $('#cusMob').val();
        let payType = $('#payType').val();
        let total = $('.total_amount').val();

        $('#summary_name').val(cusName);
        $('#summary_cash').val(tend_amount);
        $('#summary_mob').val(cusMob);
        $('#summary_pay').val(payType);
        $('.summary_total_amount').val(total);
        $('#summary_total_amount').html(total);

        let orders = $('#order_record').html();
        $('#order_summary').html(orders);
        $('.btn-back').on('click',function(){
            $('#exampleModal').modal('show');
            $('#summaryModal').modal('hide');
        });
    });
});

// Sales Report CODE:

$(document).ready(function(){
    $.getJSON('../source/ajax.php', function(data) {
        const xValues = data.xValues;
        const yValues = data.yValues;
        const barColors = ["green", "black", "pink", "blue", "brown", "red", "yellow"];

        new Chart("sales-chart", {
            type: "bar",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "StockMaster Sales Report"
                }
            }
        });
    });
    $('#startDate, #endDate').datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function(selectedDate) {
            const $this = $(this);
            const otherDatepicker = $this.is('#startDate') ? $('#endDate') : $('#startDate');
            otherDatepicker.datepicker("option", "minDate", selectedDate);
            otherDatepicker.datepicker("option", "maxDate", selectedDate);
        }
    });
});
