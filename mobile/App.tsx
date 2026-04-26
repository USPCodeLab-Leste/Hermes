import React, { useRef, useEffect, useState } from 'react';
import { BackHandler, Share, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type WebView as WebViewType, WebView } from 'react-native-webview';

import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import * as Notifications from 'expo-notifications';
import { BASE_URL, normalizeWebViewUrl } from './utils/webviewUrl';
import { registerForPushNotificationsAsync } from './utils/pushNotifications';

// configura como as notificacoes irao se comportar quando o app estiver aberti
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const webViewRef = useRef<WebViewType>(null);

  const [initialUrl, setInitialUrl] = useState(BASE_URL);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();

  // Handlers
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

  // Effects

  // intercepta o botão de voltar do Android para navegar no WebView ao invés de fechar o app
  useEffect(() => {
    const backAction = () => {
      webViewRef.current?.goBack();
      return true;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      subscription.remove();
  }, []);

  // intercepta os deep links para navegar no WebView
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      if (!url) return;

      const webViewUrl = normalizeWebViewUrl(url);
      if (!webViewUrl) return;

      webViewRef.current?.injectJavaScript(`
        window.location.href = "${webViewUrl}";
        true;
      `);
    };

    // quando abre o app pelo link (primeira vez)
    Linking.getInitialURL().then((url) => {
      if (url) {
        const webViewUrl = normalizeWebViewUrl(url);
        if (webViewUrl) {
          setInitialUrl(webViewUrl);
        }
      }
    });

    // quando o app já tá aberto e recebe um link
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  // intercepta as notificações recebidas para navegar no WebView e registra o token de push
  useEffect(() => {
    registerForPushNotificationsAsync().then(setExpoPushToken);

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const urlDoBackend = response.notification.request.content.data?.url as string | undefined;

      if (urlDoBackend) {
        const webViewUrl = normalizeWebViewUrl(urlDoBackend);
        if (!webViewUrl) return;
        
        webViewRef.current?.injectJavaScript(`
          window.location.href = "${webViewUrl}";
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