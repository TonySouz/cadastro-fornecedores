$(document).ready(function() {
    // Função para preencher o endereço automaticamente usando a API do ViaCEP
    $('#cep').on('blur', function() {
        const cep = $(this).val().replace(/\D/g, '');
        if (cep !== "") {
            const validacep = /^[0-9]{8}$/;
            if(validacep.test(cep)) {
                $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function(dados) {
                    if (!("erro" in dados)) {
                        $('#endereco').val(`${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`);
                    } else {
                        alert("CEP não encontrado.");
                    }
                });
            } else {
                alert("Formato de CEP inválido.");
            }
        }
    });

    // Função para calcular o valor total do produto
    $('#produtosContainer').on('input', '.quantidade, .valorUnitario', function() {
        const $row = $(this).closest('.row');
        const quantidade = $row.find('.quantidade').val();
        const valorUnitario = $row.find('.valorUnitario').val();
        const valorTotal = quantidade * valorUnitario;
        $row.find('.valorTotal').val(valorTotal.toFixed(2));
    });

    // Função para adicionar um novo produto
    $('#addProduto').on('click', function() {
        const novoProduto = `
            <div class="row produtoRow">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="descricao">Descrição</label>
                        <input type="text" class="form-control descricao" required>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label for="unidade">Unidade de Medida</label>
                        <input type="text" class="form-control unidade" required>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label for="quantidade">Quantidade em Estoque</label>
                        <input type="number" class="form-control quantidade" required>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label for="valorUnitario">Valor Unitário</label>
                        <input type="number" class="form-control valorUnitario" required>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label for="valorTotal">Valor Total</label>
                        <input type="number" class="form-control valorTotal" readonly>
                    </div>
                </div>
                <div class="col-md-12 mt-2">
                    <button type="button" class="btn btn-danger removerProduto"><i class="bi bi-trash3-fill"></i> Remover Produto</button>
                </div>
            </div>`;
        $('#produtosContainer').append(novoProduto);
    });

    // Função para adicionar um novo anexo
    $('#addAnexo').on('click', function() {
        const novoAnexo = `
            <div class="row">
                <div class="col-md-10">
                    <div class="form-group">
                        <label for="anexo">Anexo</label>
                        <input type="file" class="form-control anexo">
                    </div>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger excluirAnexo"><i class="bi bi-trash3-fill"></i> Excluir</button>
                    <button type="button" class="btn btn-primary visualizarAnexo"><i class="bi bi-eye"></i> Visualizar</button>
                </div>
            </div>`;
        $('#anexosContainer').append(novoAnexo);
    });
    

    // Função para remover um produto
    $('#produtosContainer').on('click', '.removerProduto', function() {
        $(this).closest('.produtoRow').remove();
    });

    // Função para manipulação de anexos
    $('#anexosContainer').on('change', '.anexo', function() {
        const files = $(this).prop('files');
        const fileList = [];
        for (let i = 0; i < files.length; i++) {
            fileList.push(files[i]);
        }
        $(this).data('files', fileList);
    });

    $('#anexosContainer').on('click', '.excluirAnexo', function() {
        $(this).closest('.row').remove();
        // Opcional: Verifica se há anexos restantes e exibe uma mensagem ou mantém o botão visível
    });

    $('#anexosContainer').on('click', '.visualizarAnexo', function() {
        const files = $(this).closest('.row').find('.anexo').data('files');
        if (files && files.length > 0) {
            const fileURL = URL.createObjectURL(files[0]);
            window.open(fileURL);
        } else {
            alert('Nenhum documento anexado.');
        }
    });

    

    // Função para manipular o envio do formulário
    $('#fornecedorForm').on('submit', function(e) {
        e.preventDefault();

        const produtos = [];
        $('#produtosContainer .produtoRow').each(function() {
            const descricao = $(this).find('.descricao').val();
            const unidade = $(this).find('.unidade').val();
            const quantidade = $(this).find('.quantidade').val();
            const valorUnitario = $(this).find('.valorUnitario').val();
            const valorTotal = $(this).find('.valorTotal').val();
            produtos.push({ descricao, unidade, quantidade, valorUnitario, valorTotal });
        });

        const anexos = [];
        $('#anexosContainer .row').each(function() {
            const files = $(this).find('.anexo').data('files');
            if (files && files.length > 0) {
                anexos.push(files[0].name); // Somente o nome do arquivo como exemplo
            }
        });

        const formData = {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
            endereco: $('#endereco').val(),
            nomeContato: $('#nomeContato').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val(),
            produtos,
            anexos
        };

        console.log(formData);
        alert('Dados enviados com sucesso!');

        // Simulação de envio e exibição do JSON
        const json = JSON.stringify(formData, null, 2);
        console.log(json);
        alert('JSON gerado:\n' + json);
    });
});
