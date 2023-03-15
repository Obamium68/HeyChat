$( document ).ready(function() {
    $( ".checkbutton" ).click(function() {
        if($(this).data("active")=='0'){
            $(this.children[0]).removeClass("mostra");
            $(this.children[0]).addClass("nascondi");
    
            $(this.children[1]).removeClass("nascondi");
            $(this.children[1]).addClass("mostra");
            $(this.children[1]).addClass("square-click");
            $(this.children[1].lastElementChild).addClass("spunta-click");
            $(this).data({"active":"1"});
        }else{
            $(this.children[1].lastElementChild).removeClass("spunta-click");
            $(this.children[1]).removeClass("square-click");

            $(this.children[1]).removeClass("mostra");
            $(this.children[1]).addClass("nascondi");
            
            $(this.children[0]).removeClass("nascondi");
            $(this.children[0]).addClass("mostra");

            $(this).removeClass("remove-item");
            $(this.children[2]).addClass("nascondi");
            $(this.children[2]).removeClass("mostra"); 
            $(this).data({"active":"0"});
        }
    });

    $( ".checkbutton" ).hover(
        function() {
            console.log($(this.children[1]));
            if($(this).data("active")=='1'){
                $(this).addClass("remove-item");

                $(this.children[1]).addClass("nascondi");
                $(this.children[1]).removeClass("mostra");
                
                $(this.children[2]).addClass("mostra");
                $(this.children[2]).removeClass("nascondi");
                
            }   
        }, function() {
            if($(this).data("active")=='1'){

                $(this).removeClass("remove-item");

                $(this.children[1]).addClass("mostra");
                $(this.children[1]).removeClass("nascondi");
                
                $(this.children[2]).addClass("nascondi");
                $(this.children[2]).removeClass("mostra");            
            }
        });
});

