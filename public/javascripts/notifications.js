

$(document).ready(function(){
    var down = false;
    
    $('#bell').click(async function(e){
   
    var color = $(this).text();
    if(down){
        
    $('#box').css('height','0px');
    $('#box').css('opacity','0');
    down = false;
    }else{
    
    $('#box').css('height','auto');
    $('#box').css('opacity','1');
    down = true;
    
    }
    });
    
    });
 
    