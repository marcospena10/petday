// Clientes.js - Funcionalidades específicas para a página de clientes

document.addEventListener('DOMContentLoaded', function() {
    // Carregar lista de clientes
    loadClientes();
    
    // Configurar eventos
    setupEventListeners();
    
    // Verificar se há ação na URL (para abrir modal de novo cliente)
    checkUrlAction();
});

// Função para carregar a lista de clientes
function loadClientes() {
    const clientes = DB.getAll('clientes');
    const tableBody = document.querySelector('#tabela-clientes tbody');
    tableBody.innerHTML = '';
    
    if (clientes.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-table">Nenhum cliente cadastrado</td></tr>';
        return;
    }
    
    clientes.forEach(cliente => {
        const pets = DB.getPetsByClientId(cliente.id);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>${pets.length}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-view" data-id="${cliente.id}" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" data-id="${cliente.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" data-id="${cliente.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Adicionar eventos aos botões de ação
    addActionButtonsEvents();
}

// Função para configurar os event listeners
function setupEventListeners() {
    // Botão para abrir modal de novo cliente
    const btnNovoCliente = document.getElementById('btn-novo-cliente');
    if (btnNovoCliente) {
        btnNovoCliente.addEventListener('click', () => {
            openClienteModal();
        });
    }
    
    // Botão para buscar cliente
    const btnBuscarCliente = document.getElementById('btn-buscar-cliente');
    if (btnBuscarCliente) {
        btnBuscarCliente.addEventListener('click', searchClientes);
    }
    
    // Campo de busca (pesquisar ao pressionar Enter)
    const buscaCliente = document.getElementById('busca-cliente');
    if (buscaCliente) {
        buscaCliente.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchClientes();
            }
        });
    }
    
    // Formulário de cliente
    const formCliente = document.getElementById('form-cliente');
    if (formCliente) {
        formCliente.addEventListener('submit', saveCliente);
    }
    
    // Botão para cancelar formulário
    const btnCancelarCliente = document.getElementById('btn-cancelar-cliente');
    if (btnCancelarCliente) {
        btnCancelarCliente.addEventListener('click', () => {
            closeModal('modal-cliente');
        });
    }
    
    // Botões de confirmação de exclusão
    const btnCancelarExclusao = document.getElementById('btn-cancelar-exclusao');
    if (btnCancelarExclusao) {
        btnCancelarExclusao.addEventListener('click', () => {
            closeModal('modal-confirmar-exclusao');
        });
    }
    
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');
    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', deleteCliente);
    }
}

// Função para adicionar eventos aos botões de ação da tabela
function addActionButtonsEvents() {
    // Botões de visualização
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const clienteId = parseInt(button.getAttribute('data-id'));
            viewCliente(clienteId);
        });
    });
    
    // Botões de edição
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const clienteId = parseInt(button.getAttribute('data-id'));
            editCliente(clienteId);
        });
    });
    
    // Botões de exclusão
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const clienteId = parseInt(button.getAttribute('data-id'));
            confirmDeleteCliente(clienteId);
        });
    });
}

// Função para abrir o modal de cliente (novo ou edição)
function openClienteModal(cliente = null) {
    // Limpar formulário
    document.getElementById('form-cliente').reset();
    document.getElementById('cliente-id').value = '';
    
    // Definir título do modal
    const modalTitulo = document.getElementById('modal-cliente-titulo');
    
    if (cliente) {
        // Modo de edição
        modalTitulo.textContent = 'Editar Cliente';
        
        // Preencher formulário com dados do cliente
        document.getElementById('cliente-id').value = cliente.id;
        document.getElementById('cliente-nome').value = cliente.nome;
        document.getElementById('cliente-email').value = cliente.email;
        document.getElementById('cliente-telefone').value = cliente.telefone;
        document.getElementById('cliente-endereco').value = cliente.endereco || '';
        document.getElementById('cliente-observacoes').value = cliente.observacoes || '';
    } else {
        // Modo de novo cliente
        modalTitulo.textContent = 'Novo Cliente';
    }
    
    // Abrir modal
    openModal('modal-cliente');
}

// Função para visualizar detalhes do cliente
function viewCliente(clienteId) {
    // Buscar cliente
    const cliente = DB.getById('clientes', clienteId);
    
    if (cliente) {
        // Abrir modal de edição em modo somente leitura
        openClienteModal(cliente);
        
        // Desabilitar campos
        document.getElementById('cliente-nome').disabled = true;
        document.getElementById('cliente-email').disabled = true;
        document.getElementById('cliente-telefone').disabled = true;
        document.getElementById('cliente-endereco').disabled = true;
        document.getElementById('cliente-observacoes').disabled = true;
        
        // Esconder botão de salvar
        const btnSalvar = document.querySelector('#form-cliente button[type="submit"]');
        btnSalvar.style.display = 'none';
        
        // Mudar texto do botão cancelar
        const btnCancelar = document.getElementById('btn-cancelar-cliente');
        btnCancelar.textContent = 'Fechar';
        
        // Mudar título do modal
        document.getElementById('modal-cliente-titulo').textContent = 'Detalhes do Cliente';
    }
}

// Função para editar cliente
function editCliente(clienteId) {
    // Buscar cliente
    const cliente = DB.getById('clientes', clienteId);
    
    if (cliente) {
        // Abrir modal de edição
        openClienteModal(cliente);
        
        // Habilitar campos
        document.getElementById('cliente-nome').disabled = false;
        document.getElementById('cliente-email').disabled = false;
        document.getElementById('cliente-telefone').disabled = false;
        document.getElementById('cliente-endereco').disabled = false;
        document.getElementById('cliente-observacoes').disabled = false;
        
        // Mostrar botão de salvar
        const btnSalvar = document.querySelector('#form-cliente button[type="submit"]');
        btnSalvar.style.display = 'block';
        
        // Restaurar texto do botão cancelar
        const btnCancelar = document.getElementById('btn-cancelar-cliente');
        btnCancelar.textContent = 'Cancelar';
    }
}

// Função para confirmar exclusão de cliente
function confirmDeleteCliente(clienteId) {
    // Armazenar ID do cliente a ser excluído
    document.getElementById('btn-confirmar-exclusao').setAttribute('data-id', clienteId);
    
    // Abrir modal de confirmação
    openModal('modal-confirmar-exclusao');
}

// Função para excluir cliente
function deleteCliente() {
    const clienteId = parseInt(document.getElementById('btn-confirmar-exclusao').getAttribute('data-id'));
    
    // Verificar se o cliente tem pets cadastrados
    const pets = DB.getPetsByClientId(clienteId);
    if (pets.length > 0) {
        alert('Este cliente possui pets cadastrados. Exclua os pets primeiro.');
        closeModal('modal-confirmar-exclusao');
        return;
    }
    
    // Verificar se o cliente tem agendamentos
    const agendamentos = DB.getAgendamentosByClientId(clienteId);
    if (agendamentos.length > 0) {
        alert('Este cliente possui agendamentos. Exclua os agendamentos primeiro.');
        closeModal('modal-confirmar-exclusao');
        return;
    }
    
    // Excluir cliente
    DB.delete('clientes', clienteId);
    
    // Fechar modal
    closeModal('modal-confirmar-exclusao');
    
    // Recarregar lista de clientes
    loadClientes();
}

// Função para salvar cliente (novo ou edição)
function saveCliente(event) {
    event.preventDefault();
    
    // Obter dados do formulário
    const clienteId = document.getElementById('cliente-id').value;
    const cliente = {
        id: clienteId ? parseInt(clienteId) : null,
        nome: document.getElementById('cliente-nome').value,
        email: document.getElementById('cliente-email').value,
        telefone: document.getElementById('cliente-telefone').value,
        endereco: document.getElementById('cliente-endereco').value,
        observacoes: document.getElementById('cliente-observacoes').value
    };
    
    // Salvar cliente
    DB.save('clientes', cliente);
    
    // Fechar modal
    closeModal('modal-cliente');
    
    // Recarregar lista de clientes
    loadClientes();
}

// Função para buscar clientes
function searchClientes() {
    const searchTerm = document.getElementById('busca-cliente').value.toLowerCase();
    
    if (!searchTerm) {
        loadClientes();
        return;
    }
    
    const clientes = DB.getAll('clientes');
    const filteredClientes = clientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm) ||
        cliente.email.toLowerCase().includes(searchTerm) ||
        cliente.telefone.toLowerCase().includes(searchTerm)
    );
    
    const tableBody = document.querySelector('#tabela-clientes tbody');
    tableBody.innerHTML = '';
    
    if (filteredClientes.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-table">Nenhum cliente encontrado</td></tr>';
        return;
    }
    
    filteredClientes.forEach(cliente => {
        const pets = DB.getPetsByClientId(cliente.id);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>${pets.length}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-view" data-id="${cliente.id}" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" data-id="${cliente.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" data-id="${cliente.id}" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Adicionar eventos aos botões de ação
    addActionButtonsEvents();
}

// Verificar se há ação na URL (para abrir modal de novo cliente)
function checkUrlAction() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'new') {
        openClienteModal();
    }
}
