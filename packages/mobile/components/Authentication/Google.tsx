import React from 'react';
import GoogleIcon from '../icons/GoogleIcon';
import OutlineButton from '../OutlineButton/OutlineButton';
import * as WebBrowser from 'expo-web-browser';
import * as GoogleAuth from 'expo-auth-session/providers/google';

const Google = () => {
  const [request, response, promptAsync] = GoogleAuth.useAuthRequest({
    expoClientId: 'YOUR_CLIENT_ID',
  });

  return (
    <OutlineButton
      icon={<GoogleIcon />}
      fontSize={18}
      onPress={() => {}}
      containerStyle={{ width: '100%' }}
      width={256}
    ></OutlineButton>
  );
};

export default Google;
