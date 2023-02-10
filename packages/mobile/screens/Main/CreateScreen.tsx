import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MainStackParamList } from '.';
import { RootStackParamList } from '../../App';
import OutlineButton from '../../components/OutlineButton/OutlineButton';
import serverInstance from '../../utilities/serverInstance';

type CreateScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'create'>,
  NativeStackScreenProps<RootStackParamList, 'main'>
>;

const CreateScreen: React.FC<CreateScreenProps> = ({ navigation }) => {
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const response = await serverInstance.post('/recipe', {
      prompt: text,
    });

    if (response.status !== 201) {
      // TODO: Handle error and advise user to try again
      setLoading(false);
      return;
    }

    const recipe = response.data;
    setLoading(false);

    navigation.replace('recipe', { id: recipe.id });
  };

  const promptForm = (
    <>
      <Text style={styles.text}>
        Enter a prompt or theme below to generate a new custom cocktail recipe
        with AI!
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={(newText) => {
            if (newText.length > 100) {
              return;
            }
            setText(newText);
          }}
        />
      </View>
      <OutlineButton onPress={() => onSubmit()}>Generate</OutlineButton>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {loading ? <Text style={styles.text}>Loading...</Text> : promptForm}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  inner: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 32,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    height: 48,
    width: '100%',
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  input: {
    marginVertical: 16,
    color: '#fff',
    height: '100%',
    width: '100%',
    fontSize: 18,
  },
});

export default CreateScreen;
