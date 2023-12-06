import * as React from 'react';

const UserInfo = ({ userId }) => {
  const [user, setUser] = React.useState(undefined);

  fetch(
    `/user/${userId}`,
    {
      method: 'GET',
      headers: { Accept: 'application/json' },
    },
  ).then((response) => {
    response.json().then((data) => {
      setUser(data.user);
    });
  });

  if (!user) {
    return <>User could not be found!</>;
  }

  return <div id="user">
    <h2>{user.username}</h2>
    <p>Bio</p>
    <div>Friends</div>
  </div>;
};

UserInfo.propTypes = {
  userId: '',
};

export default UserInfo;
