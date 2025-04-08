// Pets.js - Funcionalidades específicas para a página de pets

document.addEventListener('DOMContentLoaded', function() {
    // Carregar lista de pets
    loadPets();
    
    // Carregar lista de clientes para o select
    loadClientesSelect();
    
    // Configurar eventos
    setupEventListeners();
    
    // Verificar se há ação na URL (para abrir modal de novo pet)
    checkUrlAction();
});

// Função para carregar a lista de pets
function loadPets() {
    const pets = DB.getAll('pets');
    const clientes = DB.getAll('clientes');
    const tableBody = document.querySelector('#tabela-pets tbody');
    tableBody.innerHTML = '';
    
    if (pets.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-table">Nenhum pet cadastrado</td></tr>';
        return;
    }
    
    pets.forEach(pet => {
        const dono = clientes.find(cliente => cliente.id === pet.donoId);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pet.id}</td>
            <td>${pet.nome}</td>
            <td>${pet.especie}</td>
            <td>${pet.raca || '-'}</td>
            <td>${dono ? dono.nome : 'N/A'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-view" data-id="${pet.id}" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" data-id="${pet.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" data-id="${pet.id}" title="Excluir">
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

// Função para carregar a lista de clientes no select
function loadClientesSelect() {
    const clientes = DB.getAll('clientes');
    const selectDono = document.getElementById('pet-dono');
    
    // Limpar opções existentes, mantendo apenas a primeira
    while (selectDono.options.length > 1) {
        selectDono.remove(1);
    }
    
    // Adicionar opções de clientes
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nome;
        selectDono.appendChild(option);
    });
}

// Função para configurar os event listeners
function setupEventListeners() {
    // Botão para abrir modal de novo pet
    const btnNovoPet = document.getElementById('btn-novo-pet');
    if (btnNovoPet) {
        btnNovoPet.addEventListener('click', () => {
            openPetModal();
        });
    }
    
    // Botão para buscar pet
    const btnBuscarPet = document.getElementById('btn-buscar-pet');
    if (btnBuscarPet) {
        btnBuscarPet.addEventListener('click', searchPets);
    }
    
    // Campo de busca (pesquisar ao pressionar Enter)
    const buscaPet = document.getElementById('busca-pet');
    if (buscaPet) {
        buscaPet.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchPets();
            }
        });
    }
    
    // Formulário de pet
    const formPet = document.getElementById('form-pet');
    if (formPet) {
        formPet.addEventListener('submit', savePet);
    }
    
    // Botão para cancelar formulário
    const btnCancelarPet = document.getElementById('btn-cancelar-pet');
    if (btnCancelarPet) {
        btnCancelarPet.addEventListener('click', () => {
            closeModal('modal-pet');
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
        btnConfirmarExclusao.addEventListener('click', deletePet);
    }
}

// Função para adicionar eventos aos botões de ação da tabela
function addActionButtonsEvents() {
    // Botões de visualização
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const petId = parseInt(button.getAttribute('data-id'));
            viewPet(petId);
        });
    });
    
    // Botões de edição
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const petId = parseInt(button.getAttribute('data-id'));
            editPet(petId);
        });
    });
    
    // Botões de exclusão
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const petId = parseInt(button.getAttribute('data-id'));
            confirmDeletePet(petId);
        });
    });
}

// Função para abrir o modal de pet (novo ou edição)
function openPetModal(pet = null) {
    // Limpar formulário
    document.getElementById('form-pet').reset();
    document.getElementById('pet-id').value = '';
    
    // Definir título do modal
    const modalTitulo = document.getElementById('modal-pet-titulo');
    
    if (pet) {
        // Modo de edição
        modalTitulo.textContent = 'Editar Pet';
        
        // Preencher formulário com dados do pet
        document.getElementById('pet-id').value = pet.id;
        document.getElementById('pet-nome').value = pet.nome;
        document.getElementById('pet-especie').value = pet.especie;
        document.getElementById('pet-raca').value = pet.raca || '';
        document.getElementById('pet-idade').value = pet.idade || '';
        document.getElementById('pet-peso').value = pet.peso || '';
        document.getElementById('pet-dono').value = pet.donoId;
        document.getElementById('pet-observacoes').value = pet.observacoes || '';
    } else {
        // Modo de novo pet
        modalTitulo.textContent = 'Novo Pet';
    }
    
    // Abrir modal
    openModal('modal-pet');
}

// Função para visualizar detalhes do pet
function viewPet(petId) {
    // Buscar pet
    const pet = DB.getById('pets', petId);
    
    if (pet) {
        // Abrir modal de edição em modo somente leitura
        openPetModal(pet);
        
        // Desabilitar campos
        document.getElementById('pet-nome').disabled = true;
        document.getElementById('pet-especie').disabled = true;
        document.getElementById('pet-raca').disabled = true;
        document.getElementById('pet-idade').disabled = true;
        document.getElementById('pet-peso').disabled = true;
        document.getElementById('pet-dono').disabled = true;
        document.getElementById('pet-observacoes').disabled = true;
        
        // Esconder botão de salvar
        const btnSalvar = document.querySelector('#form-pet button[type="submit"]');
        btnSalvar.style.display = 'none';
        
        // Mudar texto do botão cancelar
        const btnCancelar = document.getElementById('btn-cancelar-pet');
        btnCancelar.textContent = 'Fechar';
        
        // Mudar título do modal
        document.getElementById('modal-pet-titulo').textContent = 'Detalhes do Pet';
    }
}

// Função para editar pet
function editPet(petId) {
    // Buscar pet
    const pet = DB.getById('pets', petId);
    
    if (pet) {
        // Abrir modal de edição
        openPetModal(pet);
        
        // Habilitar campos
        document.getElementById('pet-nome').disabled = false;
        document.getElementById('pet-especie').disabled = false;
        document.getElementById('pet-raca').disabled = false;
        document.getElementById('pet-idade').disabled = false;
        document.getElementById('pet-peso').disabled = false;
        document.getElementById('pet-dono').disabled = false;
        document.getElementById('pet-observacoes').disabled = false;
        
        // Mostrar botão de salvar
        const btnSalvar = document.querySelector('#form-pet button[type="submit"]');
        btnSalvar.style.display = 'block';
        
        // Restaurar texto do botão cancelar
        const btnCancelar = document.getElementById('btn-cancelar-pet');
        btnCancelar.textContent = 'Cancelar';
    }
}

// Função para confirmar exclusão de pet
function confirmDeletePet(petId) {
    // Armazenar ID do pet a ser excluído
    document.getElementById('btn-confirmar-exclusao').setAttribute('data-id', petId);
    
    // Abrir modal de confirmação
    openModal('modal-confirmar-exclusao');
}

// Função para excluir pet
function deletePet() {
    const petId = parseInt(document.getElementById('btn-confirmar-exclusao').getAttribute('data-id'));
    
    // Verificar se o pet tem agendamentos
    const agendamentos = DB.getAgendamentosByPetId(petId);
    if (agendamentos.length > 0) {
        alert('Este pet possui agendamentos. Exclua os agendamentos primeiro.');
        closeModal('modal-confirmar-exclusao');
        return;
    }
    
    // Excluir pet
    DB.delete('pets', petId);
    
    // Fechar modal
    closeModal('modal-confirmar-exclusao');
    
    // Recarregar lista de pets
    loadPets();
}

// Função para salvar pet (novo ou edição)
function savePet(event) {
    event.preventDefault();
    
    // Obter dados do formulário
    const petId = document.getElementById('pet-id').value;
    const pet = {
        id: petId ? parseInt(petId) : null,
        nome: document.getElementById('pet-nome').value,
        especie: document.getElementById('pet-especie').value,
        raca: document.getElementById('pet-raca').value,
        idade: document.getElementById('pet-idade').value ? parseInt(document.getElementById('pet-idade').value) : null,
        peso: document.getElementById('pet-peso').value ? parseFloat(document.getElementById('pet-peso').value) : null,
        donoId: parseInt(document.getElementById('pet-dono').value),
        observacoes: document.getElementById('pet-observacoes').value
    };
    
    // Salvar pet
    DB.save('pets', pet);
    
    // Fechar modal
    closeModal('modal-pet');
    
    // Recarregar lista de pets
    loadPets();
}

// Função para buscar pets
function searchPets() {
    const searchTerm = document.getElementById('busca-pet').value.toLowerCase();
    
    if (!searchTerm) {
        loadPets();
        return;
    }
    
    const pets = DB.getAll('pets');
    const clientes = DB.getAll('clientes');
    
    const filteredPets = pets.filter(pet => {
        const dono = clientes.find(cliente => cliente.id === pet.donoId);
        return pet.nome.toLowerCase().includes(searchTerm) ||
               pet.especie.toLowerCase().includes(searchTerm) ||
               (pet.raca && pet.raca.toLowerCase().includes(searchTerm)) ||
               (dono && dono.nome.toLowerCase().includes(searchTerm));
    });
    
    const tableBody = document.querySelector('#tabela-pets tbody');
    tableBody.innerHTML = '';
    
    if (filteredPets.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-table">Nenhum pet encontrado</td></tr>';
        return;
    }
    
    filteredPets.forEach(pet => {
        const dono = clientes.find(cliente => cliente.id === pet.donoId);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pet.id}</td>
            <td>${pet.nome}</td>
            <td>${pet.especie}</td>
            <td>${pet.raca || '-'}</td>
            <td>${dono ? dono.nome : 'N/A'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-view" data-id="${pet.id}" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" data-id="${pet.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" data-id="${pet.id}" title="Excluir">
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

// Verificar se há ação na URL (para abrir modal de novo pet)
function checkUrlAction() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'new') {
        openPetModal();
    }
}
