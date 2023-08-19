const url = 'https://cycle-api.azurewebsites.net';

export async function rentCycle(props) {
  let response = await fetch(`${url}/cycles/${props.cycleid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token,
    },
  });
  let data = await response.json();
  let userid = data.stdid;
  if (!response.ok) {
    throw new Error(data.message || 'Could not Rent Cycle');
  }

  if (props.role === 'student' && data.status === 'rented') {
    throw new Error('Cycle already Rented');
  }

  if (props.role === 'guard' && data.status === '') {
    throw new Error('Cycle not Rented Yet');
  }

  let cycleid;
  if (props.role === 'student') {
    cycleid = props.cycleid;
  }
  if (props.role === 'guard') {
    cycleid = '';
  }

  if (props.role === 'student') userid = props.userid;
  response = await fetch(`${url}/users/${userid}`, {
    method: 'PATCH',
    body: JSON.stringify({ cycleid }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token,
    },
  });

  data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not Rent Cycle.');
  }

  let user;
  if (props.role === 'student') user = props.userid;
  if (props.role === 'guard') user = '';

  let name;
  if (props.role === 'student') name = props.name;
  if (props.role === 'guard') name = '';

  let stat;
  if (props.role === 'student') stat = 'rented';
  if (props.role === 'guard') stat = '';

  // console.log({ status: stat, stdid: user, stdname: name });

  response = await fetch(`${url}/cycles/${props.cycleid}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: stat, stdid: user, stdname: name }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token,
    },
  });

  data = await response.json();

  if (!response.ok) {
    // console.log(response);
    throw new Error(data.message || 'Could not Rent Cycle.');
  }

  return 'Cycle Rented';
}

//

export async function addStudent(props) {
  let response = await fetch(`${url}/users/signup`, {
    method: 'POST',
    body: JSON.stringify(props.student),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token,
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not Add Student.');
  }

  return 'Student Added';
}

//

export async function deleteStudent(props) {
  let response = await fetch(`${url}/users/${props.student.email}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token,
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not Delete Student.');
  }

  return 'Student Deleted';
}

//

export async function addCycle(props) {
  let response = await fetch(`${url}/cycles/add`, {
    method: 'POST',
    body: JSON.stringify(props.cycle),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token,
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not Add Cycle.');
  }

  return 'Student Added';
}

export async function deleteCycle(props) {
  let response = await fetch(`${url}/cycles/${props.cycleid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token,
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not Delete Cycle');
  }

  return 'Cycle Deleted';
}

//

export async function checkUser(props) {
  const response = await fetch(`${url}/users/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: props.email,
      password: props.password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not Rent Cycle.');
  }

  console.log(data);
  return data;
}

//

export async function getCycles(props) {
  let response = await fetch(`${url}/cycles/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token,
    },
  });
  let data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch Cycles.');
  }

  return data;
}
