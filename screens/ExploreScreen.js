import React from 'react';
import { View, StyleSheet } from 'react-native';
import ResizableSplitView from '../components/ResizableSplitView';
import ExploreContent from '../components/ExploreContent';
import BottomContainer from '../components/BottomContainer';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <ResizableSplitView
        topContent={<ExploreContent />}
        bottomContent={<BottomContainer />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
