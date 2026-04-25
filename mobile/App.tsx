import React, { useRef, useEffect, useState } from 'react';
import { BackHandler, Share, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type WebView as WebViewType, WebView } from 'react-native-webview';

import * as Linking from 'expo-linking';
import * as NavigationBar from 'expo-navigation-bar';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const URL = `https://portalhermes.app`

// configura como as notificacoes irao se comportar quando o app estiver aberti
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, 
    shouldShowList: true,   
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// funcao para registrar e pegar o token
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permissão negada para notificações push!');
      return undefined;
    }
    
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Token gerado:", token);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log('Precisa usar um celular real para Push Notifications');
  }

  return token;
}

export default function App() {
  const webViewRef = useRef<WebViewType>(null);

  const [initialUrl, setInitialUrl] = useState(URL);

  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();

  // efeito para pegar o token ao abrir
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => { setExpoPushToken(token);
    })
  }, []);

  const handleMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === 'share') {
      Share.share({
        message: data.url,
      });
      
    } else if (data.type === 'download-ics') {
      try {
        const ics = data.ics;

        const fileUri = FileSystem.cacheDirectory + `event-${Date.now()}.ics`;

        await FileSystem.writeAsStringAsync(fileUri, ics, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (Platform.OS === 'android') {
          const contentUri = await FileSystem.getContentUriAsync(fileUri);

          await IntentLauncher.startActivityAsync('android.intent.action.VIEW',
            {
              data: contentUri,
              flags: 1,
              type: 'text/calendar',
            }
          );
        } else {
          // fallback (iOS ou erro)
          await Sharing.shareAsync(fileUri);
        }

      } catch (error) {
        console.error('Erro ao abrir ICS:', error);
      }
    }
  }

  useEffect(() => {
    const backAction = () => {
      webViewRef.current?.goBack();
      return true;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      subscription.remove();
  }, []);

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      if (!url) return;

      webViewRef.current?.injectJavaScript(`
        window.location.href = "${url}";
        true;
      `);
    };

    // quando abre o app pelo link (primeira vez)
    Linking.getInitialURL().then((url) => {
      if (url) {
        setInitialUrl(url);
      }
    });

    // quando o app já tá aberto e recebe um link
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const urlDoBackend = response.notification.request.content.data?.url;

      if (urlDoBackend) {
        webViewRef.current?.injectJavaScript(`
          window.location.href = "${urlDoBackend}";
          true;
        `);
      }
    });

    return () => subscription.remove();
  }, []);
  
  // 
  const injectedScript = `
    window.isMobileApp = true;
    window.expoPushToken = ${expoPushToken ? `"${expoPushToken}"` : "null"};
    true;
  `;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top', 'left', 'right']}>
      <WebView
        ref={webViewRef}
        source={{ uri: initialUrl }}
        pullToRefreshEnabled={true}
        injectedJavaScript={injectedScript}
        onMessage={handleMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#373358',
  },
});