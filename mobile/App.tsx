import React, { useRef, useEffect } from 'react';
import { BackHandler, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const URL = `https://portalhermes.app`

export default function App() {
  const webViewRef = useRef<WebViewType>(null);

  const handleMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === 'share') {
      Share.share({
        message: data.url,
      });
      
    } else if (data.type === 'download-ics') {
      const ics = data.ics;
      const fileUri = FileSystem.cacheDirectory + 'event.ics';

      await FileSystem.writeAsStringAsync(fileUri, ics, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri);
      
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
      <WebView
        ref={webViewRef}
        source={{ uri: URL }}
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