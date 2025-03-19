'use strict';
(function () {
  const elForm = document.querySelector('form');
  const { action: url, method } = elForm;
  let elError = null;

  const send = async (url, mehod, data) => {
    const res = await fetch(url, {
      method,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    const { status } = res;
    let responseData = await res.json();
    return { status, data: responseData };
  };

  const setError = error => {
    if (!elError) elError = elForm.querySelector('small');
    if (!elError) {
      elError = document.createElement('small');
      elError.style.color = 'red';
      elError.style.display = 'block';
      elError.style.fontWeight = 'bold';
      elForm.appendChild(elError);
    }
    elError.innerText = error;
  };
  const removeError = _ => {
    if (elError) {
      elError.remove();
      elError = null;
    }
  };

  elForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = elForm.email.value;
    const password = elForm.password.value;
    const res = await send(url, 'post', { email, password });
    const { status, data } = res;
    if (status === 200 && data.error === null) {
      console.log('success');
      removeError();
    } else if (status === 401 && !!data.error) {
      setError(data.error);
    }
    console.log(email, password);
  });
})();
