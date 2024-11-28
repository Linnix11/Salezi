const API_URL = 'http://localhost:1337/api';

export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/vendors?filters[email][$eq]=${email}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Error('User not found');
    }

    const user = data.data[0];
    
    // Vérifier le mot de passe
    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    return {
      user: {
        id: user.id,
        name: user.Name,
        email: user.email,
        role: user.role,
        business_name: user.business_name,
        canValidateTransactions: user.can_validate_transactions,
        canManageAllProducts: user.can_manage_all_products,
        canAccessAdmin: user.can_access_admin
      }
    };
  } catch (error) {
    throw new Error('Identifiants invalides');
  }
};

export const checkAuth = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('user');
};