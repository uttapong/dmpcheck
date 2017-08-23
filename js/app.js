

$.fn.datepicker.language['en'] = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'mm/dd/yyyy',
    timeFormat: 'hh:ii aa',
    firstDay: 0
};

$(document).ready(function(){
    if(isCompleted()){
        $('#gender-block').hide();
        $('#thanks-block').show();
        $('.middle>h1').hide();
        return;
    }
    $('#gender-block').show(); 
   datepicker= $('#birthdate').datepicker({
        language:'en',
        inline:true,
        dateFormat: "d MM yyyy",
        onSelect:function(format,dateObj){
            $('#selected_date').html(moment(dateObj.toString()).format("Do MMM YYYY"));
        }
    })

    $('#gender_confirm').click(
        function(){
           
            $('#gender-block').hide();
            // $('.calendar').addClass('slideInRight');
            $('.calendar').show();
        });
    $('#birthdate_confirm').click(
        function(){
            if( $('#selected_date').html()==""){
                $('#selected_date').html("<span class='alert'>Please select your birthdate!</span>");
                return;
            }

            $('#birthdate-block').hide();
            // $('.calendar').addClass('slideInRight');
            $('#name-block').show();
        });
    
        $('#name_confirm').click(
            function(){
                if( $.trim($('#fullname').val()) ==""){
                    $("#error").html("<span class='alert'>Please fill in your name!</span>");
                    return;
                }

                
                $('#name-block').hide();
                // $('.calendar').addClass('slideInRight');
                $('.middle>h1').hide();
                $('#thanks-block').show();
                $.cookie('dmp_collector',"done");
            });
});

function isCompleted(){
    if($.cookie('dmp_collector')){
        return true;
    }
    else return false;
}
