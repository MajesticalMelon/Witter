import * as React from 'react';

const UserInfo = ({ userId }) => {
  const [user, setUser] = React.useState(undefined);
  const [isFollowing, setIsFollowing] = React.useState(undefined);

  const getIsFriend = React.useCallback(() => {
    fetch(
      `/follow/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    ).then((response) => {
      response.json().then((data) => {
        setIsFollowing(data.isFollowing);
      });
    });
  }, []);

  React.useEffect(() => {
    if (user === undefined || isFollowing === undefined) {
      fetch(
        `/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ).then((response) => {
        response.json().then((data) => {
          setUser(data.user);
        });
      });

      fetch(
        `/follow/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ).then((response) => {
        response.json().then((data) => {
          setIsFollowing(data.isFollowing);
        });
      });
    }
  }, [user, isFollowing]);

  if (!user) {
    return <>User could not be found!</>;
  }

  console.log(user.following);

  return <div id="userInfo">
    <h2>{user.username}</h2>
    <p id="userBio">
      Welcome to my account!
    </p>
    <div id="followContainer">
      <div id="followTop"><p>Following:</p>{window.location.pathname === '/account'
        ? <></>
        : <div id="followButton" onClick={() => {
          fetch(`/follow/${userId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }).then(() => getIsFriend());
        }}>{isFollowing ? 'Unfollow' : 'Follow'}</div>}</div>
      <div id="followList">
        {user.following.length > 0
          ? user.following.map((f, i) => <a className='userLink followLink' href={`/users/${userId}`} key={i}>@{f.username}</a>)
          : 'None'}
      </div>
    </div>
  </div>;
};

UserInfo.propTypes = {
  userId: '',
};

export default UserInfo;
