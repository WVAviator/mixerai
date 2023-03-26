import { FontAwesome5 } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { MainStackParamList } from '.';
import { RootStackParamList } from '../../App';
import OutlineButton from '../../components/OutlineButton/OutlineButton';
import useHeader from '../../hooks/useHeader';
import useTokens from '../../hooks/useTokens/useTokens';
import serverInstance from '../../utilities/serverInstance';

type PurchaseScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'purchase'>,
  NativeStackScreenProps<RootStackParamList, 'main'>
>;

const PurchaseScreen: React.FC<PurchaseScreenProps> = ({ navigation }) => {
  const { tokens } = useTokens();

  useHeader({
    navigation,
    contents: <Text style={styles.text}>Purchase Tokens</Text>,
    props: { padding: 20 },
    dependencies: [],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.text}>Tokens:</Text>
        <View style={styles.total}>
          <Text style={styles.text}>{tokens}</Text>
        </View>
      </View>
      <View style={styles.options}>
        <Text style={styles.text}>Buy More</Text>
        <OutlineButton
          icon={<FontAwesome5 name="coins" size={24} color="white" />}
        >
          10 Tokens ($0.99)
        </OutlineButton>
        <OutlineButton
          icon={<FontAwesome5 name="coins" size={24} color="white" />}
        >
          25 Tokens ($1.99)
        </OutlineButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  summary: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    borderBottomWidth: 1,
    borderColor: '#ffffff',
    margin: 20,
  },
  total: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    marginLeft: 20,
  },
  options: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
    margin: 20,
    paddingVertical: 40,
    paddingHorizontal: 40,
    minHeight: 240,
  },
});

export default PurchaseScreen;
