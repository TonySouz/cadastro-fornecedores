$(document).ready(function() {
    // Adicionar novo produto
    $('#addProduct').click(function() {
        let newRow = `<tr>
            <td><input type="text" class="form-control" required></td>
            <td><input type="text" class="form-control" required></td>
            <td><input type="number" class="form-control" required></td>
            <td><input type="number" class="form-control" required></td>
            <td><input type="number" class="form-control" readonly></td>
        </tr>`;
        $('#productsTable tbody').append(newRow);
    });

    // Adicionar novo anexo
    $('#addAttachment').click(function() {
        let newRow = `<tr>
            <td><input type="file" class="form-control" required></td>
            <td>
                <button type="button" class="btn btn-danger btn-sm">Excluir</button>
                <button type="button" class="btn btn-info btn-sm">Visualizar</button>
            </td>
        </tr>`;
        $('#attachmentsTable tbody').append(newRow);
    });

    // Calcular valor total
    $('#productsTable').on('input', 'input[type="number"]', function() {
        let row = $(this).closest('tr');
        let quantity = parseFloat(row.find('input:eq(2)').val());
        let unitPrice = parseFloat(row.find('input:eq(3)').val());
        let total = quantity * unitPrice;
        row.find('input:eq(4)').val(total.toFixed(2));
    });

    // Excluir anexo
    $('#attachmentsTable').on('click', '.btn-danger', function() {
        $(this).closest('tr').remove();
    });

    // Visualizar anexo
    $('#attachmentsTable').on('click', '.btn-info', function() {
        let fileInput = $(this).closest('tr').find('input[type="file"]')[0];
        if (fileInput.files.length > 0) {
            let file = fileInput.files[0];
            let url = URL.createObjectURL(file);
            window.open(url, '_blank');
        }
    });

    // Enviar formulário
    $('#supplierForm').submit(function(event) {
        event.preventDefault();
        let formData = new FormData(this);
        let jsonData = {};
        formData.forEach((value, key) => { jsonData[key] = value });
        console.log(JSON.stringify(jsonData));
        alert('Fornecedor salvo com sucesso!');
    });
});
