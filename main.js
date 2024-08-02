$(document).ready(function() {
    // Função para buscar e preencher o endereço automaticamente
    $('#buscarEndereco').on('click', function() {
        const cep = $('#endereco').val().replace(/\D/g, '');
        if (cep.length === 8) {
            $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function(data) {
                if (!data.erro) {
                    $('#endereco').val(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
                } else {
                    alert('CEP não encontrado');
                }
            });
        } else {
            alert('CEP inválido');
        }
    });

    // Função para calcular o valor total dos produtos
    $('#productsTable').on('input', '.product-quantity, .product-unit-price', function() {
        const $row = $(this).closest('tr');
        const quantity = parseFloat($row.find('.product-quantity').val()) || 0;
        const unitPrice = parseFloat($row.find('.product-unit-price').val()) || 0;
        const total = quantity * unitPrice;
        $row.find('.product-total').val(total.toFixed(2));
    });

    // Adicionar nova linha na tabela de produtos
    $('#addProduct').on('click', function() {
        $('#productsTable tbody').append(`
            <tr>
                <td><input type="text" class="form-control product-description" required></td>
                <td><input type="text" class="form-control product-unit" required></td>
                <td><input type="number" class="form-control product-quantity" required></td>
                <td><input type="number" class="form-control product-unit-price" required></td>
                <td><input type="text" class="form-control product-total" readonly></td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm remove-product">Remover</button>
                </td>
            </tr>
        `);
    });

    // Remover produto da tabela
    $('#productsTable').on('click', '.remove-product', function() {
        $(this).closest('tr').remove();
    });

    // Gerenciar anexos
    $('#fileUpload').on('change', function() {
        const files = $(this)[0].files;
        const $tableBody = $('#attachmentsTable tbody');
        $tableBody.empty();
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const fileData = event.target.result;
                const fileName = file.name;
                const fileUrl = URL.createObjectURL(file);
                $tableBody.append(`
                    <tr>
                        <td>${fileName}</td>
                        <td>
                            <button type="button" class="btn btn-danger btn-sm delete-attachment" data-file-url="${fileUrl}">Excluir</button>
                            <a href="${fileUrl}" download class="btn btn-info btn-sm">Visualizar</a>
                        </td>
                    </tr>
                `);
            };
            reader.readAsDataURL(file);
        });
    });

    // Excluir anexo
    $('#attachmentsTable').on('click', '.delete-attachment', function() {
        $(this).closest('tr').remove();
    });

    // Salvar fornecedor e gerar JSON
    $('#registrationForm').on('submit', function(event) {
        event.preventDefault(); // Previne o envio padrão do formulário

        // Exibir modal de loading
        $('#loadingModal').modal('show');

        // Coleta os dados do formulário
        const formData = {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
            endereco: $('#endereco').val(),
            contato: $('#contato').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val(),
            produtos: [],
            anexos: []
        };

        // Coleta dados dos produtos
        $('#productsTable tbody tr').each(function() {
            const $row = $(this);
            formData.produtos.push({
                descricao: $row.find('.product-description').val(),
                unidade: $row.find('.product-unit').val(),
                quantidade: $row.find('.product-quantity').val(),
                valorUnitario: $row.find('.product-unit-price').val(),
                valorTotal: $row.find('.product-total').val()
            });
        });

        // Coleta dados dos anexos
        $('#attachmentsTable tbody tr').each(function() {
            formData.anexos.push({
                nome: $(this).find('td:first').text(),
                url: $(this).find('.delete-attachment').data('file-url')
            });
        });

        // Exemplo de como gerar JSON e exibir no console
        console.log(JSON.stringify(formData, null, 2));

        // Ocultar modal de loading
        $('#loadingModal').modal('hide');
    });
});
