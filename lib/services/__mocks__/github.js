const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;

};

const getGithubProfile = async (token) => {
  console.log(`MOCK_INVOKED: getGithubProfile(${token})`);
  return {
    username: 'fake_github_user',
    avatar: 'https://placecage.com/gif/300/300',
    email: 'not-real@example.com',

  };
};

module.exports = { exchangeCodeForToken, getGithubProfile };
