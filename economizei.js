let gastos = [];

//ao iniciar a aplicação obtem-se a lista de gastos armazedos no Local Storage e caso existam 
//filtra-se os gastos para exibir na tela (o default é iniciar exibindo os gastos do mês atual)
onload = () => {
    aux = JSON.parse(localStorage.getItem('gastos'));

    if (aux) {
        gastos = aux;
        if (window.location.pathname === "/index.html") {
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1;
            month = month > 9 ? month : '0' + month.toString();
            var ano = dateObj.getFullYear();
            document.getElementById("mes-ano-filtro").value = ano.toString() + '-' + month.toString();
            filtraListaGastosMes();
        }
    } else {
        calculaTotalMes();
    }
}

//função chamada pelo botão adicionar da tela de cadastro
//obtem-se os valores dos campos do formulario, cria-se o objeto com os dados cadastrados (caso todos campos estejam preenchidos)
//adiciona o objeto na lista de gastos e atualiza a lista armazenada no Local Storage
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
            dia: data.substring(9, 11),
            tipo: tipo
        });
        localStorage.setItem('gastos', JSON.stringify(gastos));
        document.getElementById("descricao").value = null;
        document.getElementById("valor").value = null;
        document.getElementById("data").value = null;
    }
}

//função para criar um identificador unico para cada gasto cadastrado
function criaUUID() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

//obtem o valor do campo de mes e ano exibido na tela inicial e filtra apenas os gastos daquele mes
function filtraListaGastosMes() {
    let mes = document.getElementById("mes-ano-filtro").value.toString().substring(5, 7);
    let ano = document.getElementById("mes-ano-filtro").value.toString().substring(0, 4);
    gastosFiltrada = gastos.filter(gasto => {
        return gasto.mes === mes && gasto.ano === ano;
    });
    montaListaGastos(gastosFiltrada);
    calculaTotalMes(gastosFiltrada);
}

//a partir de uma lista de gastos cria o HTML para exibir na tela todos cards com os gastos da lista recebida por parametro
function montaListaGastos(gastosFiltrada) {
    let i = 0;
    document.getElementById("gastos").innerHTML = '';
    if (gastosFiltrada != null && gastosFiltrada.length > 0) {
        gastosFiltrada.forEach((gasto => {
            let cardGasto = document.createElement('div');
            cardGasto.style.display = 'flex';
            cardGasto.style.alignItems = 'center';
            cardGasto.style.marginBottom = '10px';

            let iconeGasto = document.createElement('div');
            iconeGasto.style.width = '13%';
            iconeGasto.style.display = 'flex';
            iconeGasto.style.alignItems = 'center';
            iconeGasto.style.justifyContent = 'center';
            iconeGasto.style.padding = '7px';

            let imagemGasto = document.createElement('img');
            imagemGasto = calculaImagemDeAcordoComTipoGasto(imagemGasto, gasto);
            imagemGasto.style.width = '2.6rem';
            iconeGasto.appendChild(imagemGasto);

            //div com descrição e valor
            let informacoesGasto = document.createElement('div');
            informacoesGasto.style.width = '60%';
            informacoesGasto.style.display = 'flex';
            informacoesGasto.style.flexFlow = 'column';
            informacoesGasto.style.padding = '2px 0';

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

            cardGasto.appendChild(iconeGasto);
            cardGasto.appendChild(informacoesGasto);
            cardGasto.appendChild(excluir);

            document.getElementById("gastos").appendChild(cardGasto);

            i++;
        }));
    }
}

function calculaImagemDeAcordoComTipoGasto(imagemGasto, gasto){
    if(gasto == null){
        return;
    }

    if(gasto.tipo === 'Lanche'){
        imagemGasto.src = '/assets/lanche.png';
    } else if(gasto.tipo === 'Saúde'){
        imagemGasto.src = '/assets/saude.png';
    } else if(gasto.tipo === 'Supermercado'){
        imagemGasto.src = '/assets/supermercado.png';
    } else if(gasto.tipo === 'Combustível'){
        imagemGasto.src = '/assets/combustivel.png';
    } else {
        imagemGasto.src = '/assets/outros.png';
    }
    return imagemGasto;
}

//recebe uma lista de gasto, soma todos esses gastos e cria o HTML que exibirá esse total na tela principal
function calculaTotalMes(gastosFiltrada) {
    console.log('passou');
    document.getElementById("total").innerHTML = '';
    let total = 0;
    if (gastosFiltrada != null && gastosFiltrada.length > 0) {
        gastosFiltrada.forEach(gasto => {
            total += Number.parseFloat(gasto.valor);
        });
    }
    let gastoTotal = document.createElement('span');
    gastoTotal.style.fontSize = '1.2rem';
    gastoTotal.style.width = '95%';
    gastoTotal.textContent = 'Total: ' + total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById("total").appendChild(gastoTotal);
}

//função chamada pela seta de navegação entre meses (volta um mes a cada clique)
function calculaMesAnterior() {
    let mes = Number.parseInt(document.getElementById("mes-ano-filtro").value.toString().substring(5, 7));

    let ano = Number.parseInt(document.getElementById("mes-ano-filtro").value.toString().substring(0, 4));
    if (mes === 1) {
        mes = 12;
        ano = ano - 1;
    } else {
        mes = mes - 1;
    }

    mes = mes > 9 ? mes : '0' + mes.toString();
    document.getElementById("mes-ano-filtro").value = ano.toString() + '-' + mes.toString();
    filtraListaGastosMes();
}

//função chamada pela seta de navegação entre meses (avança um mes a cada clique)
function calculaMesPosterior() {
    let mes = Number.parseInt(document.getElementById("mes-ano-filtro").value.toString().substring(5, 7));

    let ano = Number.parseInt(document.getElementById("mes-ano-filtro").value.toString().substring(0, 4));
    if (mes === 12) {
        mes = 1;
        ano = ano + 1;
    } else {
        mes = mes + 1;
    }

    mes = mes > 9 ? mes : '0' + mes.toString();
    document.getElementById("mes-ano-filtro").value = ano.toString() + '-' + mes.toString();
    filtraListaGastosMes();
}