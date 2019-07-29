// handles budget data
//budget module Immedieatt invokes function expression
var budgetController =( function(){
    
    var Expense = function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
    
        if(totalIncome>0){
             this.percentage = Math.round((this.value/totalIncome)*100);    
        }else{
            this.percentage = -1;
        }
      
        
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    
    
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        
        },
        budget:0,
        percentage: -1
    };
    
    var calculateTotal=function(type){
        
        var sum=0;
        
        data.allItems[type].forEach(function(current){
            sum=sum+current.value;
                                        
        });
        data.totals[type]=sum;
        
    }
    
    return {
        addItem:function(type,des,val){
            
            var newItem,ID;
            //Create new ID
            var arr=data.allItems[type];
           var len=arr.length;
          
           if(len>0)
           {
               ID=arr[len-1].id+1;
           }
           else{
               ID=0;
           }
            
            //Create new item based on inc or exp
            if(type==='exp'){
                newItem=new Expense(ID,des,val);
                
            }else if(type==='inc'){
                newItem=new Income(ID,des,val);
                
            }
            
            //push into our data ds
            data.allItems[type].push(newItem);
            
            //return this new created ele
            console.log(data);
            return newItem;
        },
        
        deleteItem: function(type,id){
            
            //map function returna a new array. 
            //it iterates through inc or exp array and returns all the ids of objects i array 
            
            ids=data.allItems[type].map(function(current){
                return current.id;
            });
            index=ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },
        calculateBudget: function(){
            // calculate total income and expenses
             calculateTotal('exp');
             calculateTotal('inc');
            
            //calculate the budget: income-expenses
             data.budget=data.totals.inc-data.totals.exp;
            
            //cal percentage of income spent
            if(data.totals.inc>0)
            {
                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else
            {
                data.percentage=-1;
            }
             
        },
        
        calculatePercentages: function(){
            
            data.allItems.exp.forEach(function(cur){
               cur.calcPercentage(data.totals.inc); 
            });
        },
        
        getPercentages: function(){
            
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            
            return allPerc;
            
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
                
            }
        },
        
        testing:function(){
        console.log(data);
        }
    }
    
})();



//UI Controlleer
var UIController=(function(){
    
    var DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel:'.budget__title--month'
        
    }
    
    var formatNumber = function(num, type){
           var numSplit,int,dec,sign;
            /* +/- before num, exactly 2 decimal points, comma seperating */
            
            
            num=Math.abs(num);
            //tofixed is a prototype function of number and res is string 
            num= num.toFixed(2);
            
            numSplit= num.split('.');
            int=numSplit[0];
            if(int.length>3){
                int = int.substr(0,int.length-3)+','+int.substr(int.length-3,3)
            }
            
            dec=numSplit[1];
            type==='exp'?sign='-' :sign ='+';
            
            return sign+' '+int+ '.'+dec;
        }
    
    var nodeListForEach = function(list, callback)  {
             for( var i=0;i<list.length;i++){
                 callback(list[i],i);
             }
         };
        
    return{
        getinput:function(){
            return {
                
            type:document.querySelector(DOMstrings.inputType).value, //will be inc or exp value of options
            description:document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
            
        },
        
        addListItem: function(obj,type){
            
            var html,newHtml,element;
            // create HTML String eth placeholder text
            
            if(type ==='inc'){
                element=DOMstrings.incomeContainer
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element=DOMstrings.expenseContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            }
            
            //Replace the placeholder tex with some actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            
            
            
            //Insert the HTML into Data
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        
        deleteListItem:function(selectedID){
            var el=document.getElementById(selectedID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function(){
          var fields, fieldsArr;
            fields=document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
            
            
          fieldsArr= Array.prototype.slice.call(fields);
          
          fieldsArr.forEach(function(current, index, array){
            current.value="";
          });
         fieldsArr[0].focus();
        },
        
        getDOMStrings:function(){
        return DOMstrings;
        },
        
        displayMonth : function(){
            
            var now=new Date();
            months =['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'];
            var year = now.getFullYear();
            var month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent=year+' '+ months[month];
;        },
        
        displayBudget: function(obj){
            var type;
            if(obj.budget>0)
                type='inc';
            else
                type='exp';
           document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
            
            document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber(obj.totalExp,'exp');
            
            
             
             if(obj.percentage>0){
                 document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';
             }else{
                 document.querySelector(DOMstrings.percentageLabel).textContent='--';
             }
            
        },
        changedType: function(){
           
            var fields= document.querySelectorAll(
            DOMstrings.inputType+','+
            DOMstrings.inputDescription+','+
            DOMstrings.inputValue);
            
            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
            
            
            
        },
        
        displayPercentages: function(percentages){
           
          //the output is a nodelist
          var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
          console.log(fields);
           
         nodeListForEach(fields, function(current,index){
             if(percentages[index]>0)
                current.textContent = percentages[index]+'%';
             else
                 current.textContent = '--';
         });
            
        }
        
        
        
    };
    
})();


//App controller interaction between budget and UI
var controller=(function(budgetCtrl,UICtrl){
    
    var setupEventListeners=function(){
   
        var DOM=UICtrl.getDOMStrings(); 

        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){

            if(event.keyCode===13)
                ctrlAddItem();
            });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
    };
    
    
    var ctrlAddItem =function(){
        
        var input,newItem;
        //1. get the fieldinput data
        input=UICtrl.getinput();
        
        
        if(input.description!=="" && !isNaN(input.value) && input.value>0){
            
            //2. add item to budget controller
            newItem=budgetCtrl.addItem(input.type,input.description,input.value);
            
            //3. add new item to UI
            UICtrl.addListItem(newItem,input.type);

            //4 clear the fields
            UICtrl.clearFields();

            //5 calculate and update budget
            updateBudget();
            
            //6 calculate and update percentages
            updatePercentages();
        }        
        
    };
    
    var updatePercentages = function() {
        
        // 1. cal percentages
        budgetCtrl.calculatePercentages();
        //2. read them from budget controller
        var percentages = budgetCtrl.getPercentages();
        //3. update the UI with new percentages
        console.log(percentages);
        UICtrl.displayPercentages(percentages);
    } 
    var updateBudget = function(){
        
        var budget;
        //1. calculate budget
        budgetCtrl.calculateBudget();
        
        //2. return the budget
        budget= budgetCtrl.getBudget();
        
        //3. display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
    
    var ctrlDeleteItem=function(event){
       
       var itemID,splitID,type,ID; itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {
            splitID=itemID.split('-');
            type=splitID[0];
            ID=splitID[1];
            
            // 1. Delete Item from Data structure
            budgetCtrl.deleteItem(type,parseInt(ID));
            //2. delete item from UI
            UICtrl.deleteListItem(itemID);
            //3. update and show new budget
            updateBudget();
            //4. cal and update percentages
            updatePercentages();
            
            
        }
    };
    return{
        init: function(){
            console.log('Application has started:');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setupEventListeners();
        }
    };
 
})(budgetController,UIController);


controller.init();