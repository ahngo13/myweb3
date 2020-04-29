$(document).ready(function () {
	$("#error_query").hide();
	$("#success_create").hide();
	$("#success_holder").hide();

	$("#transferSubmit").click( function(){
		var owner = {'car_id': $("#car_id2").val() ,'car_owner': $("#car_owner2").val() };
		if(confirm(JSON.stringify( owner )+'\n 소유주 변경 정보가 맞습니까?')){
    	
            $.post({
                traditional: true,
                url: '/fabcar_network/change_owner/',
                contentType: 'application/json',
                data: JSON.stringify( owner ),
                dataType: 'json',
                success: function(data){                 
                    alert(data.msg);
                    if(data.code=='1'){
                        $("#success_holder").show().html(`Success! Tx ID: ${data.msg}`);
                    }else{
                        $("#success_holder").show().html(`Fail! please retry: ${data.msg}`).css('color','red');
                    }
                }
            } );
        }
	});


	$("#createSubmit").click( function(){
        var car = {'car_id':$("#car_id").val(),
                    'car_color': $("#car_color").val(),
                    'car_make' : $("#car_make").val() ,
                    'car_model': $("#car_model").val() ,
                    'car_owner' : $("#car_owner").val()};
		if(confirm('[입력 차량 정보]\n'+JSON.stringify( car )+'\n가 맞습니까?')){
    	
            $.post({
                traditional: true,
                url: '/fabcar_network/add_car/',
                contentType: 'application/json',
                data: JSON.stringify( car ),
                dataType: 'json',
                success: function(data){                 
                    alert(data.msg);
                    if(data.code=='1'){
                        $("#success_create").show().html(`Success! Tx ID: ${data.msg}`);
                    }else{
                        $("#success_create").show().html(`Fail! please retry: ${data.msg}`).css('color','red');
                    }
                }
            } );	
        }
	});

	$("#querySubmit").click( function(){

        var id = $("#queryName").val();  
        alert( id +' 정보를 조회합니다');      

        $.post({
            traditional: true,
            url: '/fabcar_network/get_car/',
            contentType: 'application/json',
            data: JSON.stringify( {'queryName' : id} ),
            dataType: 'json',
            success: function(data){ 
                console.log( data );                                  
                let content;
                try{
                    let _data=JSON.parse(data.queryCar); 
                    content=`<td>${_data.colour}</td>`
                                  +`<td>${_data.make}</td>`
                                  +`<td>${_data.model}</td>`
                                  +`<td>${_data.owner}</td>`;
                    
                    $("#error_query").hide();
                }catch(e){
                    alert(id+ " 정보는 존재하지 않습니다");
                    content='<td>undefined</td><td>undefined</td><td>undefined</td><td>undefined</td>';
                    $("#error_query").show();
                }               
                                
                $("#query_car").html(content);
            }
        } );		
	});
	
    $('#queryAllCar').click(function () {        
        alert('모든 차 정보를 조회합니다');
        
        $.get("/fabcar_network/get_all_car/",function (data,status) {
            var result=JSON.parse(data.queryAllCars);
            console.log(result.length);
			var array = [];
			for (var i = 0; i <result.length; i++){
				result[i].Record.Key = result[i].Key;
				array.push(result[i].Record);
			}
			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});
			

			var content='<table id="all_car" class="table" align="center">'
			+'<tr><th>ID</th><th>Color</th><th>Make</th><th>Model</th><th>Owner</th></tr>';
			array.forEach((car)=>{
				content += `<tr><td>${car.Key}</td><td>${car.color}</td><td>${car.make}</td> <td>${car.model}</td> <td>${car.owner}</td></tr>`;
			});
        
			content += '</table>';
			//alert(content);
			$('#all_car').html(content);
			
        });
    });
});
