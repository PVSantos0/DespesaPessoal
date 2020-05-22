class expense {
    constructor(year,month, day, t, d, v){
        this.year = year
        this.month = month
        this.day = day
        this.model = t
        this.discretion = d
        this.price = v
    }
    
    okDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
                }   
            }
        return true
    }
}

function cadastrarDespesa() {
    let year = document.getElementById('ano')
    let month = document.getElementById('mes')
    let day = document.getElementById('dia')
    let t = document.getElementById('tipo')
    let d = document.getElementById('descricao')
    let v = document.getElementById('valor')

    let a = new expense (
        year.value, 
        month.value, 
        day.value, 
        t.value, 
        d.value, 
        v.value
    )
    
    if(a.okDados()){
        Dados.rec(a)
        
        document.getElementById('modalTitle').innerHTML = 'Adiciondo despesa'
        document.getElementById('modalColor').className = 'modal-header text-success'
        document.getElementById('modalBody').innerHTML = 'Foi cadastrado com sucesso a sua despesa.'
        document.getElementById('modalBtn').innerHTML = 'Voltar'
        document.getElementById('modalBtn').className = 'btn btn-success'
        
        $('#modalBase').modal('show')
        
        year.value = ''
        month.value = ''
        day.value = ''
        t.value = ''
        d.value = ''
        v.value = ''

    } else{
        document.getElementById('modalTitle').innerHTML = 'Falta preenchimento de campo'
        document.getElementById('modalColor').className = 'modal-header text-danger'
        document.getElementById('modalBody').innerHTML = 'Existem campos obrigatorios que não foram preenchidos.'
        document.getElementById('modalBtn').innerHTML = 'Voltar para corrigir'
        document.getElementById('modalBtn').className = 'btn btn-danger'
        
        $('#modalBase').modal('show')
    }
    
}


class Bd {
    constructor(){
        let id = localStorage.getItem('id')
        
        if (id === null){
            localStorage.setItem('id', 0)
        } 
    }
    
    getNextId(){
        let nextId = localStorage.getItem('id')
        return parseInt(nextId) + 1
    }
    
    rec (localS){
        let mais = this.getNextId()
        localStorage.setItem(mais, JSON.stringify(localS))
        localStorage.setItem('id', mais)
    }
    
    loadList() {
        let tbItem = Array()
         
        let lst =localStorage.getItem('id')
        
        //recuperar todos as despesas no localStorage
        for(let i = 1; i <= lst; i++){
            let itemLs  = JSON.parse(localStorage.getItem(i))
            
            //pular itens removidos
            if(itemLs === null){
                continue
            }

            itemLs.id = i
            tbItem.push(itemLs)
        }
        
        
        return tbItem
    }
    
    searchInList(searchObjet) {
        let searchReturn = Array()
        searchReturn = this.loadList()

        if(searchObjet.year !== ''){
            searchReturn = searchReturn.filter(d => d.year == searchObjet.year)
        }
        
        if(searchObjet.month !== ''){
            searchReturn = searchReturn.filter(d => d.month == searchObjet.month)
        }
        
        if(searchObjet.day !== ''){
            searchReturn = searchReturn.filter(d => d.day == searchObjet.day)
        }
        
        if(searchObjet.model !== ''){
            searchReturn = searchReturn.filter(d => d.model == searchObjet.model)
        }

        if(searchObjet.discretion !== ''){
            searchReturn = searchReturn.filter(d => d.discretion == searchObjet.discretion)
        }

        if(searchObjet.price !== ''){
            searchReturn = searchReturn.filter(d => d.price == searchObjet.price)
        }
        
        return searchReturn
    }

    remove(id){
        localStorage.removeItem(id)
    }
}

let Dados = new Bd()

function listExpense(tb = Array(), searchError = false) {
    
    if(tb.length == 0 && searchError == false){
        tb = Dados.loadList()
    }

    //selecionado a tabela
    itemTb = document.getElementById('tbHTML')
    itemTb.innerHTML = ''

    //lista despesas dinamica
    tb.forEach(function(d){
       //criar linhas
       let row = tbHTML.insertRow()
       //criar colunas
       row.insertCell(0).innerHTML = `${d.day}/${d.month}/${d.year}` 
       switch (parseInt(d.model)) {
           case 1:
               d.model = 'Alimentação'
               break;
            case 2:
               d.model = 'Educação'
               break;
            case 3:
               d.model = 'Lazer'
               break;
            case 4:
               d.model = 'Saúde'
               break;
            case 5:
               d.model = 'Transporte'
               break;
       }
       row.insertCell(1).innerHTML = d.model
       row.insertCell(2).innerHTML = d.discretion 
       row.insertCell(3).innerHTML = d.price
       //botão de exclusão
       let btn = document.createElement('button')
       btn.className = "btn btn-danger"
       btn.innerHTML = '<i class="fas fa-times"></i>'
       btn.id = d.id
       //btn.id = d.id
       btn.onclick = function() {
           Dados.remove(this.id)
           window.location.reload()
        }
       row.insertCell(4).append(btn) 
    })
}

//clicar ao botão de pesquisa
function searchExpense(){
    let year = document.getElementById('ano').value
    let month = document.getElementById('mes').value
    let day = document.getElementById('dia').value
    let t = document.getElementById('tipo').value
    let d = document.getElementById('descricao').value
    let v = document.getElementById('valor').value
    
    let searchObjet = new expense(year,month, day, t, d, v)
    
    let tb = Dados.searchInList(searchObjet)
    
    listExpense(tb, true)
}
