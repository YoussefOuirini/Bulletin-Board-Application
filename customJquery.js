$(document).ready(function(){
    var suggestionFinder = function () {
        var time= Date.now();
        $("#user").keyup(function(){
            if (time+300 < Date.now()) { // Part 2: added timer
                time=Date.now();
                $.post('/search', {
                    typedIn: $("#user").val()
                }, 
                (data, status) => {
                    console.log(data)
                    if (data[0]===undefined) {
                        $("#suggestion1").hide()
                    } else {
                        $("#suggestion1").val(data[0])
                    }
                    if (data[1] === undefined) {
                        $("#suggestion2").hide()
                    } else {
                        $("#suggestion2").val(data[1])
                    }
                });
            }
        });
    };
    suggestionFinder();
});