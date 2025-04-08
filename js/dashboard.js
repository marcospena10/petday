// Dashboard.js - Funcionalidades específicas para a página de dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Atualizar contadores
    updateCounters();
    
    // Carregar agendamentos recentes
    loadRecentAppointments();
});

// Função para atualizar os contadores do dashboard
function updateCounters() {
    // Contador de clientes
    const clientes = DB.getAll('clientes');
    document.getElementById('total-clientes').textContent = clientes.length;
    
    // Contador de pets
    const pets = DB.getAll('pets');
    document.getElementById('total-pets').textContent = pets.length;
    
    // Contador de agendamentos para hoje
    const hoje = formatDate(new Date());
    const agendamentosHoje = DB.getAgendamentosByDate(hoje);
    document.getElementById('agendamentos-hoje').textContent = agendamentosHoje.length;
    
    // Calcular faturamento mensal
    const faturamentoMensal = calcularFaturamentoMensal();
    document.getElementById('faturamento-mensal').textContent = formatCurrency(faturamentoMensal);
}

// Função para calcular o faturamento mensal
function calcularFaturamentoMensal() {
    const agendamentos = DB.getAll('agendamentos');
    const servicos = DB.getAll('servicos');
    
    // Obter o mês atual
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();
    
    // Filtrar agendamentos do mês atual com status "Concluído"
    const agendamentosConcluidos = agendamentos.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.data);
        return dataAgendamento.getMonth() + 1 === mesAtual && 
               dataAgendamento.getFullYear() === anoAtual && 
               agendamento.status === 'Concluído';
    });
    
    // Calcular o valor total
    let total = 0;
    agendamentosConcluidos.forEach(agendamento => {
        const servico = servicos.find(s => s.id === agendamento.servicoId);
        if (servico) {
            total += servico.preco;
        }
    });
    
    return total;
}

// Função para carregar os agendamentos recentes
function loadRecentAppointments() {
    const agendamentos = DB.getAll('agendamentos');
    const clientes = DB.getAll('clientes');
    const pets = DB.getAll('pets');
    const servicos = DB.getAll('servicos');
    
    // Ordenar agendamentos por data (mais recentes primeiro)
    agendamentos.sort((a, b) => {
        const dateA = new Date(a.data + 'T' + a.hora);
        const dateB = new Date(b.data + 'T' + b.hora);
        return dateB - dateA;
    });
    
    // Pegar os 5 agendamentos mais recentes
    const recentAgendamentos = agendamentos.slice(0, 5);
    
    const tableBody = document.querySelector('#tabela-agendamentos-recentes tbody');
    tableBody.innerHTML = '';
    
    if (recentAgendamentos.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="empty-table">Nenhum agendamento recente</td></tr>';
        return;
    }
    
    recentAgendamentos.forEach(agendamento => {
        const cliente = clientes.find(c => c.id === agendamento.clienteId);
        const pet = pets.find(p => p.id === agendamento.petId);
        const servico = servicos.find(s => s.id === agendamento.servicoId);
        
        const tr = document.createElement('tr');
        
        // Formatar a data para exibição
        const dataFormatada = formatDateBR(agendamento.data);
        
        tr.innerHTML = `
            <td>${dataFormatada} ${agendamento.hora}</td>
            <td>${cliente ? cliente.nome : 'N/A'}</td>
            <td>${pet ? pet.nome : 'N/A'}</td>
            <td>${servico ? servico.nome : 'N/A'}</td>
            <td><span class="status status-${agendamento.status.toLowerCase()}">${agendamento.status}</span></td>
        `;
        
        tableBody.appendChild(tr);
    });
}
