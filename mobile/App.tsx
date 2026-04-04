import React, { useRef, useEffect, useState } from 'react';
import { BackHandler, Share, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type WebView as WebViewType, WebView } from 'react-native-webview';

import * as Linking from 'expo-linking';
import * as NavigationBar from 'expo-navigation-bar';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const URL = `https://portalhermes.app`

export default function App() {
  const webViewRef = useRef<WebViewType>(null);

  const [initialUrl, setInitialUrl] = useState(URL);

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

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top', 'left', 'right']}>
      <WebView
        ref={webViewRef}
        source={{ uri: initialUrl }}
        pullToRefreshEnabled={true}
        injectedJavaScript={`window.isMobileApp = true; true;`}
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