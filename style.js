document.addEventListener('DOMContentLoaded', function() {

    const currentBalance=document.getElementById("current-balance").lastElementChild,
    income=document.getElementById("income").lastElementChild,
    expense=document.getElementById("expense").lastElementChild,
    historyContainer=document.getElementById("transaction-history"),
    inputTransactionText=document.getElementById("input-text"),
    transactionType=document.getElementById("transaction-type").getElementsByTagName("input"),
    inputTransactionAmount=document.getElementById("input-amount"),
    button=document.getElementById("submit-button"),
     warningHide=document.getElementById("warning-hide"),
    expenseWarning=document.getElementById("expense-warning"),
    clearHistory=document.getElementById("clear-history-button");
    
    
    let fieldEnter, deleteElement, incomeAmount=0, expenseAmount=0, signedCurrentBalance=0;
    
    
    const storeLocally=()=>{
        if(inputTransactionText.value!="" && inputTransactionAmount.value!=""){
                fieldEnter=true;
        }
    
            if(fieldEnter){
                let transactionName;
                        transactionType[0].checked && (transactionName=transactionType[0].id);
                        transactionType[1].checked && (transactionName=transactionType[1].id);
                const dataObject={
                        text:`${inputTransactionText.value}`,
                        amount:`${inputTransactionAmount.value}`,
                        checked:`${transactionName}`
                }
                fieldEnter=false;
                inputTransactionAmount.value="";
                inputTransactionText.value="";
                storeToLocalStorage(dataObject);
                alert("data added");
                getDataFromLocalStorage();
            }else{
                alert("please fill all fields");
            }
    }
    
    function storeToLocalStorage(newData){
        const existingData=JSON.parse(localStorage.getItem('myData')) || [];
        existingData.push(newData);
        localStorage.setItem('myData', JSON.stringify(existingData));
    }
    
    function getDataFromLocalStorage(){
       incomeAmount=0;
       expenseAmount=0;
       signedCurrentBalance=0;
     historyContainer.innerHTML=`
     <h2
     style="
       text-align: start;
       font-size: 20px;
       padding-bottom: 5px;
       border-bottom: 2px solid rgb(35, 35, 35, 0.2);
     "
    >
     History
    </h2>
     `
        let dataHistory=JSON.parse(localStorage.getItem('myData')) || [];//this is done because there might not be any data added to localStorage yet.
            dataHistory.forEach((element)=>{
                    let historyDiv=document.createElement("div")
                    historyDiv.setAttribute("class", "history");
                    let signedTransactionAmount;
                    if(element.checked==="income"){
                        signedTransactionAmount=`+ ${element.amount}`
                        incomeAmount+=Number(element.amount)
                    }
                    if(element.checked==="expense"){
                        signedTransactionAmount=`- ${element.amount}`
                        expenseAmount+=Number(element.amount)
                    }
                    historyDiv.innerHTML=`
                    <img src="delete.png" class="delete"/>
                    <span id="text">${element.text}</span>
                    <span id="amount">${signedTransactionAmount}</span>
                    `
                    if(element.checked==="income"){
                        historyDiv.classList.add("income-color")
                    }
                    if(element.checked==="expense"){
                        historyDiv.classList.add("expense-color")
                    }
                    historyContainer.appendChild(historyDiv);
                   
            })
             deleteElement=document.getElementsByClassName("delete");
                for(const item of deleteElement){
                    item.addEventListener("click", handleDeleteItem)
                }

                 income.innerHTML=`$${incomeAmount}.00`;
                 expense.innerHTML=`$${expenseAmount}.00`;

                 let signIndicator;
                  signedCurrentBalance=incomeAmount - expenseAmount;
                  signedCurrentBalance < 0 ?signIndicator=false:signIndicator=true;

                  signedCurrentBalance=Math.abs(signedCurrentBalance);

                  if(signIndicator){
                     currentBalance.innerHTML=`$${signedCurrentBalance}.00`;
                     currentBalance.style.color="";
                    
                 }else{
                    currentBalance.innerHTML=`-$${signedCurrentBalance}.00`;
                    currentBalance.style.color="rgb(207 0 0)";
                    // expenseWarning.setAttribute("hidden", false);  cannot do this way as it is boolean attribute so even if you provide any boolean value it will still read as true.
                    expenseWarning.hidden=false;
                 }
    }
    
    getDataFromLocalStorage();
    button.addEventListener("click", storeLocally);
    
    function deleteData(clickedItem){
        let indexValue;
        let initialData=JSON.parse(localStorage.getItem('myData')) || [];
        initialData.forEach((element, index)=>{
            if(clickedItem.nextElementSibling.innerHTML===element.text){
                indexValue=index;
            }
        })
       initialData.splice(indexValue, 1);
       localStorage.setItem('myData', JSON.stringify(initialData));
    
       setTimeout(() => {//set timeout is done so that there would be no asynchronous like event while fetching from local storage.
        getDataFromLocalStorage();
       }, 100);
    } 


    function handleDeleteItem(event){
            deleteData(event.target);//remember this technique for using a function reference to attach event listener. here event.target can be used to get the item from above without need to pass it as argument.this is a good approach to removeeventlistener.
    }
  
    warningHide.addEventListener("click", ()=>{
        expenseWarning.hidden=true;
    })

    clearHistory.addEventListener("click", ()=>{
        let clearedData=JSON.parse(localStorage.getItem('myData')) || [];
        clearedData=null;
        localStorage.setItem('myData', clearedData);
        setTimeout(() => {
                getDataFromLocalStorage();
        }, 200);
    })
});
