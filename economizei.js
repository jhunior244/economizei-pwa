let gastos = [];

onload = () => {
    aux = JSON.parse(localStorage.getItem('gastos'));

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    month = month > 9 ? month : '0' + month.toString();
    var ano = dateObj.getFullYear();
    document.getElementById("mes-ano-filtro").value = ano.toString() + '-' + month.toString();
    if (aux) {
        gastos = aux;
        if (window.location.pathname === "/index.html") {
            filtraListaGastosMes();
        }
    }
}


function adicionar() {
    var descricao = document.getElementById("descricao").value;
    var valor = document.getElementById("valor").value;
    var data = document.getElementById("data").value;
    var tipo = document.getElementById("tipo-gasto").value;

    if (
        descricao != null && descricao != '' &&
        descricao != null && valor != '' &&
        data != null && data != '' &&
        tipo != null && tipo != ''
    ) {
        gastos.push({
            id: criaUUID(),
            descricao: descricao,
            valor: valor,
            ano: data.substring(0, 4),
            mes: data.substring(5, 7),
            dia: data.substring(9, 11)
        });
        localStorage.setItem('gastos', JSON.stringify(gastos));
        console.log(gastos);
        document.getElementById("descricao").value = null;
        document.getElementById("valor").value = null;
        document.getElementById("data").value = null;
    }
}

function criaUUID() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function filtraListaGastosMes(){
    let mes = document.getElementById("mes-ano-filtro").value.toString().substring(5, 7);
    let ano = document.getElementById("mes-ano-filtro").value.toString().substring(0, 4);
    gastosFiltrada = gastos.filter(gasto => {
        return gasto.mes === mes && gasto.ano === ano;
    });
    montaListaGastos(gastosFiltrada);
    calculaTotalMes(gastosFiltrada);
}

function montaListaGastos(gastosFiltrada) {
    let i = 0;
    document.getElementById("gastos").innerHTML = '';
    if(gastosFiltrada != null && gastosFiltrada.length > 0){
        gastosFiltrada.forEach((gasto => {
            let cardGasto = document.createElement('div');
            // cardGasto.value = gasto.id;
            cardGasto.style.display = 'flex';
            cardGasto.style.alignItems = 'center';
            cardGasto.style.marginBottom = '10px';
    
            //div com descrição e valor
            let informacoesGasto = document.createElement('div');
            informacoesGasto.style.width = '80%';
            informacoesGasto.style.display = 'flex';
            informacoesGasto.style.flexFlow = 'column';
            informacoesGasto.style.paddingLeft = '10px';
    
            let descricaGasto = document.createElement('span');
            descricaGasto.textContent = gasto.descricao;
            descricaGasto.style.fontSize = '1.3rem';
            descricaGasto.style.color = 'white';
            descricaGasto.style.padding = '5px';
    
            let valorGasto = document.createElement('span');
            valorGasto.textContent = 'R$ ' + gasto.valor;
            valorGasto.style.padding = '5px';
    
            informacoesGasto.appendChild(descricaGasto);
            informacoesGasto.appendChild(valorGasto);
    
            //div com botão excluir
            let excluir = document.createElement('div');
            excluir.style.width = '20%';
            excluir.style.display = 'flex';
            excluir.style.justifyContent = 'center';
    
            let botaoExcluir = document.createElement('a');
            botaoExcluir.type = 'button';
            botaoExcluir.value = i;
            botaoExcluir.onclick = function () {
                var listaGastos = document.getElementById("gastos");
                var id = gasto.id;
                listaGastos.children[this.value].remove();
                var index = gastos.findIndex(g => { return g.id === id; });
                gastos.splice(index, 1);
                localStorage.setItem('gastos', JSON.stringify(gastos));
                filtraListaGastosMes();
            }
    
            let iconeBotaoExcluir = document.createElement('img');
            iconeBotaoExcluir.src = 'assets/delete.png';
            iconeBotaoExcluir.style.width = '25px';
            iconeBotaoExcluir.style.height = '25px';
    
            botaoExcluir.appendChild(iconeBotaoExcluir);
            excluir.appendChild(botaoExcluir);
    
            cardGasto.appendChild(informacoesGasto);
            cardGasto.appendChild(excluir);
    
            document.getElementById("gastos").appendChild(cardGasto);
    
            i++;
        }));
    } 
}

function calculaTotalMes(gastosFiltrada){
    document.getElementById("total").innerHTML = '';
    let total = 0;
    if(gastosFiltrada != null && gastosFiltrada.length > 0){
        gastosFiltrada.forEach(gasto => {
            total += Number.parseFloat(gasto.valor);
        });
    }
    let gastoTotal = document.createElement('span');
    gastoTotal.style.fontSize = '1.2rem';
    gastoTotal.style.width = '95%';
    gastoTotal.textContent = 'Total: '+ total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById("total").appendChild(gastoTotal);
}

function calculaMesAnterior(){
    let mes = Number.parseInt(document.getElementById("mes-ano-filtro").value.toString().substring(5, 7));
    
    let ano = Number.parseInt(document.getElementById("mes-ano-filtro").value.toString().substring(0, 4));
    if(mes === 1){
        mes = 12;
        ano = ano - 1;
    } else {
        mes = mes -1;
    }

    mes = mes > 9 ? mes : '0' + mes.toString();
    document.getElementById("mes-ano-filtro").value = ano.toString() + '-' + mes.toString();
    filtraListaGastosMes();
}

function calculaMesPosterior(){
    let mes = Number.parseInt(document.getElementById("mes-ano-filtro").value.toString().substring(5, 7));
    
    let ano = Number.parseInt(document.getElementById("mes-ano-filtro").value.toString().substring(0, 4));
    if(mes === 12){
        mes = 1;
        ano = ano + 1;
    } else {
        mes = mes + 1;
    }

    mes = mes > 9 ? mes : '0' + mes.toString();
    document.getElementById("mes-ano-filtro").value = ano.toString() + '-' + mes.toString();
    filtraListaGastosMes();
}