import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Button from '../../Components/Button';
import Input from '../../Components/Input';

function Login() {
  const navigate = useNavigate();

  const {
    email,
    password,
    disableLoginButton,
    setError,
    setName,
    error,
  } = useContext(AppContext);

  useEffect(() => {
    const request = async () => {
      const hasLogin = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:3001/users');
      const data = await response.json();
      if (hasLogin) {
        const user = data.find((item) => item.email === hasLogin.email);
        if (user) {
          const { role } = user;
          if (role === 'administrator') {
            navigate('/admin/manage');
          } else if (role === 'seller') {
            navigate('/seller/orders');
          } else {
            navigate('/customer/products');
          }
        }
      }
    };
    request();
  }, [navigate, setName, email]);

  const request = async () => {
    const url = 'http://localhost:3001/login';
    const fields = { email, password };
    const body = JSON.stringify(fields);

    const response = await fetch(url, {
      body,
      method: 'post',
      headers: { 'Content-type': 'application/json' },
    });

    const user = await response.json();

    if (response.ok === false) {
      setError({ message: user.message, status: response.status });
    } else {
      setName(user.name);
      const { role } = user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('carrinho', JSON.stringify([]));
      if (role === 'customer') navigate('/customer/products');
      if (role === 'seller') navigate('/seller/orders');
      if (role === 'administrator') navigate('/admin/manage');
    }
  };

  return (
    <div id="LoginComponent">
      <Input
        testId="common_login__input-email"
        placeholder="email@tryber.com"
        lable="Login"
        type="email"
        state={ email }
      />
      <Input
        testId="common_login__input-password"
        placeholder="*********"
        lable="Senha"
        type="password"
        state={ password }
      />
      <Button
        testId="common_login__button-login"
        text="LOGIN"
        disable={ Boolean(disableLoginButton) }
        exec={ request }
      />
      <Button
        testId="common_login__button-register"
        disable={ false }
        text="Ainda não tenho conta"
        exec={ () => navigate('/register') }
      />
      <span data-testid="common_login__element-invalid-email">
        { error.message }
      </span>
    </div>
  );
}

export default Login;
