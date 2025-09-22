import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 150,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
  },
  button: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
  },
  price: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    backgroundColor: 'black',
    padding: 4,
    borderRadius: 10,
  },
  priceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  imageStyle: { width: '100%', height: '100%', borderRadius: 10 },
  nameAmount: { paddingBottom: 15 },
  badge: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'blue',
    height: 25,
    width: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: 'white', fontWeight: '600' },
});

export default styles;
