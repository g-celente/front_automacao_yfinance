export default async (to) => {
  const token = localStorage.getItem("token-auth");
  const role = localStorage.getItem("user-role");

  // Mapeamento de rotas permitidas por tipo de usuário
  const userRoutes = {
    'admin': [
      'AdminDashboard',
      'AdminUsers',
      'AdminCarteiras',
      'CarteiraDashboard' // Rotas permitidas para user_type_id = 1 (admin)
    ], // Rotas permitidas para user_type_id = 1
    'client': [
      'UserDashboard',
      'UserWallet' // Rotas permitidas para user_type_id = 2 (cliente)
    ] // Rotas permitidas para user_type_id = 2
  };

  // Redireciona para o home se estiver logado e tentar acessar a página de login
  if (to.name === "login" && token && role == 'admin') {
    return { name: "AdminDashboard" }; // Redireciona para a página de admin se já estiver logado
  }

  // Verifica se a rota exige autenticação
  if (to.meta.requiresAuth) {
    if (!token) {
      return { name: "login" }; // Redireciona para login se não estiver autenticado
    }

    // Verifica se o tipo de usuário tem permissão para acessar a rota
    const allowedRoutes = userRoutes[role] || [];
    if (!allowedRoutes.includes(to.name)) {
      return { name: "login" }; // Redireciona para uma página de erro de permissão
    }

    return true;
  }

  return true; // Permite navegação para rotas que não exigem autenticação
};