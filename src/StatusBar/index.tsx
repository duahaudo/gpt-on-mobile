import React from 'react';
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

interface Props {
  tokens: string | null;
  loading?: boolean;
}

const CustomStatusBar: React.FC<Props> = ({tokens, loading}) => {
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        {loading && <ActivityIndicator size="small" color="#000" />}
      </View>
      <View style={styles.statusContainer}>
        {tokens && <Text>🙇 {tokens} tokens used</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: StatusBar.currentHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    paddingHorizontal: 10,
  },
  loaderContainer: {
    paddingRight: 10,
  },
});

export default CustomStatusBar;
