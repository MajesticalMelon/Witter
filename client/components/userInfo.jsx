import * as React from 'react';
import { MdStar } from 'react-icons/md';

const UserInfo = ({ userId }) => {
  const [account, setAccount] = React.useState(undefined);
  const [user, setUser] = React.useState(undefined);
  const [isFollowing, setIsFollowing] = React.useState(undefined);
  const [isAllowed, setIsAllowed] = React.useState(undefined);

  const [quote, setQuote] = React.useState('');

  React.useEffect(() => {
    if (quote === '') {
      fetch(
        "https://type.fit/api/quotes",
        {
          method: 'GET',
          headers: {
            'Cross-Origin': 'anonymous',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      ).then((response) => {
        response.json().then((json) => {
          const randIndex = Math.floor(Math.random() * json.length);
          setQuote(json[randIndex].text);
        })
      })
    }
  }, [quote])

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

  const getIsAllowed = React.useCallback(() => {
    fetch(
      `/allow/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    ).then((response) => {
      response.json().then((data) => {
        setIsAllowed(data.isAllowed);
      });
    });
  }, []);

  React.useEffect(() => {
    if (user === undefined || isFollowing === undefined) {
      fetch(
        '/user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ).then((response) => {
        response.json().then((data) => {
          setAccount(data.user);
        });
      });

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

      fetch(
        `/allow/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ).then((response) => {
        response.json().then((data) => {
          setIsAllowed(data.isAllowed);
        });
      });
    }
  }, [user, isFollowing, isAllowed]);

  if (!user) {
    return <>User could not be found!</>;
  }

  return <div id="infoWithAd">
    <div id="userInfo">
      <div id="userTop">
        <h2>{user.username} {user.premium ? <MdStar /> : <></>}</h2>
        {
          account?.privacy === 'private'
            ? <div id="allowButton" className='userButton' onClick={() => {
              fetch(`/allow/${userId}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
              }).then(() => getIsAllowed());
            }}>{isAllowed ? 'Block' : 'Allow'}</div> : <></>
        }
      </div>
      <p id="userBio">
        {user.description === '' ? 'Welcome to my account!' : user.description}
      </p>
      <div id="followContainer">
        <div id="followTop"><p>Following:</p>{window.location.pathname === '/account'
          ? <></>
          : <div id="followButton" className='userButton' onClick={() => {
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
    </div>

    <div className="advertisement" style={{ display: account?.premium ? 'none' : 'flex' }}>
      <img src='https://picsum.photos/1000/2000?random=2' crossOrigin='anonymous'></img>
      <p>{quote}</p>
    </div>
  </div>;
};

UserInfo.propTypes = {
  userId: '',
};

export default UserInfo;
