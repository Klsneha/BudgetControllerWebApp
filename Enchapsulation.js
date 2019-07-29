// handles budget data
//budget module Immedieatt invokes function expression
var budgetController =( function(){
    var x=23;
    var add=function(a){
        return x+a;
    }
    
    return{
        publicTest: function(b){
           return add(b);
        }
    }
})();



//UI Controlleer

var UIController=(function(){
    
})();


var controller=(function(budgetCtrl,UICtrl){
    
    var z=budgetCtrl.publicTest(10);
    return {
        anotherPublic: function(){
            console.log(z);
        }
    }
    
    
})(budgetController,UIController);