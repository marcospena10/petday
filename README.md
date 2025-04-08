# PetShop Manager

Um sistema simples em HTML, CSS e JavaScript para gerenciamento de petshops, incluindo cadastro de clientes, pets, serviços, agendamentos e produtos.

## Funcionalidades

- **Dashboard**: Visão geral com estatísticas e agendamentos recentes
- **Clientes**: Cadastro e gerenciamento de clientes
- **Pets**: Cadastro e gerenciamento de pets vinculados aos clientes
- **Serviços**: Cadastro e gerenciamento de serviços oferecidos
- **Agendamentos**: Agendamento de serviços com calendário e listagem
- **Produtos**: Controle de estoque e cadastro de produtos

## Como usar

1. Faça o download ou clone este repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Navegue pelo sistema usando o menu lateral

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- LocalStorage para armazenamento de dados
- Font Awesome para ícones

## Estrutura do projeto

```
petshop-manager/
├── index.html              # Página inicial (Dashboard)
├── css/
│   └── style.css           # Estilos do sistema
├── js/
│   ├── main.js             # Funções compartilhadas e inicialização
│   ├── dashboard.js        # Funcionalidades do dashboard
│   ├── clientes.js         # Funcionalidades de clientes
│   ├── pets.js             # Funcionalidades de pets
│   ├── servicos.js         # Funcionalidades de serviços
│   ├── agendamentos.js     # Funcionalidades de agendamentos
│   └── produtos.js         # Funcionalidades de produtos
├── pages/
│   ├── clientes.html       # Página de gerenciamento de clientes
│   ├── pets.html           # Página de gerenciamento de pets
│   ├── servicos.html       # Página de gerenciamento de serviços
│   ├── agendamentos.html   # Página de gerenciamento de agendamentos
│   └── produtos.html       # Página de gerenciamento de produtos
└── img/
    └── logo.png            # Logo da petshop (substitua pela sua)
```

## Armazenamento de dados

Este sistema utiliza o LocalStorage do navegador para armazenar os dados. Isso significa que:

- Os dados são persistidos apenas no navegador onde foram criados
- Limpar o cache do navegador apagará todos os dados
- Não há sincronização entre diferentes dispositivos ou navegadores

Para uma solução mais robusta em ambiente de produção, seria necessário implementar um backend com banco de dados.

## Personalização

Você pode personalizar este sistema de várias formas:

1. **Logo**: Substitua o arquivo `img/logo.png` pela logo da sua petshop
2. **Cores**: Edite as variáveis CSS no início do arquivo `css/style.css`
3. **Serviços**: Adicione ou modifique os serviços oferecidos pela sua petshop
4. **Categorias de produtos**: Ajuste as categorias de produtos conforme necessário

## Limitações

- Sistema offline (dados armazenados apenas no navegador)
- Sem autenticação de usuários
- Sem backup automático de dados
- Funcionalidades básicas de um sistema completo

## Próximos passos

Para uma versão mais completa, considere implementar:

- Backend com banco de dados
- Sistema de autenticação e controle de acesso
- Relatórios e gráficos avançados
- Sistema de vendas e faturamento
- Notificações por email ou SMS
- Aplicativo móvel para clientes

## Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir conforme necessário.
