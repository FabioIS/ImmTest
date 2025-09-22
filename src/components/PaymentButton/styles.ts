import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '90%',
  },
  payContainer: {
    backgroundColor: 'blue',
    padding: 12,
    paddingLeft: 20,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    flex: 1,
    gap: 5,
  },
  optionContainer: {
    flex: 0.4,
    backgroundColor: 'darkblue',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  colorWhite: {
    color: 'white',
  },
  bold: {
    fontWeight: 'bold',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  userTypeButton: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});

export default styles;
