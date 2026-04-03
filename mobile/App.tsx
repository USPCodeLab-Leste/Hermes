import React, { useRef, useEffect } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';

const URL = `https://portalhermes.app`

export default function App() {
  const webViewRef = useRef<WebViewType>(null);

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