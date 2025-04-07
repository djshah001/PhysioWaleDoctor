import React, { useState, useRef } from 'react';
import { View, Dimensions, StyleSheet, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { blurhash } from '../Utility/Repeatables';
import colors from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ImageCarousel = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Default image if none provided
  const imageData = images?.length > 0 
    ? images 
    : ['https://via.placeholder.com/800x500?text=No+Image+Available'];

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Animated.Image
        source={{ uri: item }}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
        style={styles.image}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
    </View>
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const renderDotIndicator = () => {
    return (
      <View style={styles.dotContainer}>
        {imageData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? colors.white[100] : 'rgba(255,255,255,0.5)' }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={imageData}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {/* {renderDotIndicator()} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: SCREEN_WIDTH,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default ImageCarousel;