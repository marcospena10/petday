// Funções utilitárias compartilhadas entre todas as páginas

// Armazenamento Local
const DB = {
    // Inicializa o banco de dados local se não existir
    init: function() {
        const dbInitialized = localStorage.getItem('dbInitialized');
        
        if (!dbInitialized) {
            // Criar tabelas
            localStorage.setItem('clientes', JSON.stringify([]));
            localStorage.setItem('pets', JSON.stringify([]));
            localStorage.setItem('servicos', JSON.stringify([]));
            localStorage.setItem('agendamentos', JSON.stringify([]));
            localStorage.setItem('produtos', JSON.stringify([]));
            
            // Adicionar alguns dados de exemplo
            this.addExampleData();
            
            localStorage.setItem('dbInitialized', 'true');
        }
    },
    
    // Adiciona dados de exemplo para demonstração
    addExampleData: function() {
        // Clientes de exemplo
        const clientes = [
            {
                id: 1,
                nome: 'João Silva',
                email: 'joao.silva@email.com',
                telefone: '(11) 98765-4321',
                endereco: 'Rua das Flores, 123',
                observacoes: 'Cliente desde 2020'
            },
            {
                id: 2,
                nome: 'Maria Oliveira',
                email: 'maria.oliveira@email.com',
                telefone: '(11) 91234-5678',
                endereco: 'Av. Paulista, 1000',
                observacoes: ''
            }
        ];
        
        // Pets de exemplo
        const pets = [
            {
                id: 1,
                nome: 'Rex',
                especie: 'Cachorro',
                raca: 'Labrador',
                idade: 3,
                peso: 25.5,
                donoId: 1,
                observacoes: 'Alérgico a certos shampoos'
            },
            {
                id: 2,
                nome: 'Miau',
                especie: 'Gato',
                raca: 'Siamês',
                idade: 2,
                peso: 4.2,
                donoId: 2,
                observacoes: ''
            }
        ];
        
        // Serviços de exemplo
        const servicos = [
            {
                id: 1,
                nome: 'Banho',
                descricao: 'Banho completo com shampoo e condicionador',
                preco: 50.00,
                duracao: 60,
                categoria: 'Banho'
            },
            {
                id: 2,
                nome: 'Tosa',
                descricao: 'Tosa higiênica ou tosa da raça',
                preco: 70.00,
                duracao: 90,
                categoria: 'Tosa'
            },
            {
                id: 3,
                nome: 'Banho e Tosa',
                descricao: 'Serviço completo de banho e tosa',
                preco: 100.00,
                duracao: 120,
                categoria: 'Banho e Tosa'
            }
        ];
        
        // Agendamentos de exemplo
        const hoje = new Date();
        const amanha = new Date();
        amanha.setDate(hoje.getDate() + 1);
        
        const agendamentos = [
            {
                id: 1,
                clienteId: 1,
                petId: 1,
                servicoId: 3,
                data: formatDate(hoje),
                hora: '14:30',
                status: 'Agendado',
                observacoes: ''
            },
            {
                id: 2,
                clienteId: 2,
                petId: 2,
                servicoId: 1,
                data: formatDate(amanha),
                hora: '10:00',
                status: 'Confirmado',
                observacoes: 'Cliente pediu para usar shampoo hipoalergênico'
            }
        ];
        
        // Produtos de exemplo
        const produtos = [
            {
                id: 1,
                codigo: 'RA001',
                nome: 'Ração Premium para Cães Adultos',
                descricao: 'Ração de alta qualidade para cães adultos de todas as raças',
                preco: 89.90,
                estoque: 15,
                categoria: 'Alimentação',
                fornecedor: 'PetFood Inc.',
                estoqueMinimo: 5
            },
            {
                id: 2,
                codigo: 'SH002',
                nome: 'Shampoo Hipoalergênico',
                descricao: 'Shampoo especial para pets com pele sensível',
                preco: 35.50,
                estoque: 8,
                categoria: 'Higiene',
                fornecedor: 'PetClean',
                estoqueMinimo: 3
            }
        ];
        
        // Salvar dados de exemplo no localStorage
        localStorage.setItem('clientes', JSON.stringify(clientes));
        localStorage.setItem('pets', JSON.stringify(pets));
        localStorage.setItem('servicos', JSON.stringify(servicos));
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        localStorage.setItem('produtos', JSON.stringify(produtos));
    },
    
    // Métodos genéricos CRUD
    getAll: function(table) {
        return JSON.parse(localStorage.getItem(table)) || [];
    },
    
    getById: function(table, id) {
        const items = this.getAll(table);
        return items.find(item => item.id === id);
    },
    
    save: function(table, item) {
        const items = this.getAll(table);
        
        if (item.id) {
            // Atualizar item existente
            const index = items.findIndex(i => i.id === item.id);
            if (index !== -1) {
                items[index] = { ...items[index], ...item };
            }
        } else {
            // Adicionar novo item
            const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
            items.push({ ...item, id: newId });
        }
        
        localStorage.setItem(table, JSON.stringify(items));
        return item;
    },
    
    delete: function(table, id) {
        let items = this.getAll(table);
        items = items.filter(item => item.id !== id);
        localStorage.setItem(table, JSON.stringify(items));
    },
    
    // Métodos específicos para relacionamentos
    getPetsByClientId: function(clienteId) {
        const pets = this.getAll('pets');
        return pets.filter(pet => pet.donoId === clienteId);
    },
    
    getClienteByPetId: function(petId) {
        const pet = this.getById('pets', petId);
        if (pet) {
            return this.getById('clientes', pet.donoId);
        }
        return null;
    },
    
    getAgendamentosByDate: function(date) {
        const agendamentos = this.getAll('agendamentos');
        return agendamentos.filter(agendamento => agendamento.data === date);
    },
    
    getAgendamentosByClientId: function(clienteId) {
        const agendamentos = this.getAll('agendamentos');
        return agendamentos.filter(agendamento => agendamento.clienteId === clienteId);
    },
    
    getAgendamentosByPetId: function(petId) {
        const agendamentos = this.getAll('agendamentos');
        return agendamentos.filter(agendamento => agendamento.petId === petId);
    }
};

// Funções utilitárias
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateBR(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Funções para manipulação de modais
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Função para gerar um placeholder de logo
function generateLogoPlaceholder() {
    const logoPlaceholder = document.getElementById('logo-placeholder');
    if (logoPlaceholder) {
        logoPlaceholder.innerHTML = '<i class="fas fa-paw"></i>';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o banco de dados local
    DB.init();
    
    // Gerar placeholder de logo
    generateLogoPlaceholder();
    
    // Configurar fechamento de modais
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Fechar modal ao clicar fora do conteúdo
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});
