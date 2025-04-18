import { useState } from 'react';
import { StyleSheet, View, TextInput, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Add transaction function
  const addTransaction = () => {
    const newTransaction = { amount: parseFloat(amount), category, date, type: type.toLowerCase() };
    setTransactions([...transactions, newTransaction]);
    setAmount('');
    setCategory('');
    setDate('');
    setType('');
  };

  // Delete transaction function
  const deleteTransaction = (index) => {
    let newTransactions = [...transactions];
    newTransactions.splice(index, 1);
    setTransactions(newTransactions);
  };

  // Calculate total function
  const calculateTotal = (type) => {
    return transactions
      .filter(transaction => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0)
      .toFixed(2);
  };

  // Summarize the transactions
  const summarizeTransactions = () => {
    const summary = {};

    transactions.forEach(transaction => {
      const monthYear = new Date(transaction.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      const key = `${monthYear} - ${transaction.type.toUpperCase()}`;

      if (!summary[key]) {
        summary[key] = 0;
      }

      summary[key] += transaction.amount;
    });

    return summary;
  };

  const summary = summarizeTransactions();

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.header, styles.headerText]}>Personal Budget Manager</Text>
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />
        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />
        <TextInput
          placeholder="Income or Expense?"
          value={type}
          onChangeText={setType}
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttons} onPress={addTransaction}>
            <Text style={styles.buttonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => setShowSummary(!showSummary)}
          >
            <Text style={styles.buttonText}>{showSummary ? "Show Details" : "Show Summary"}</Text>
          </TouchableOpacity>
        </View>
        {showSummary ? (
          <ScrollView>
            {Object.keys(summary).map((key, index) => (
              <View key={index} style={styles.transaction}>
                <Text>{key}: ${summary[key].toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total Income: ${calculateTotal('income')}</Text>
              <Text style={styles.totalText}>Total Expense: ${calculateTotal('expense')}</Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.display}>
            {transactions.map((transaction, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => deleteTransaction(index)}
                style={styles.transaction}
              >
                <Text>Amount: ${transaction.amount.toFixed(2)}</Text>
                <Text>Category: {transaction.category}</Text>
                <Text>Date: {transaction.date}</Text>
                <Text>Type: {transaction.type}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total Income: ${calculateTotal('income')}</Text>
              <Text style={styles.totalText}>Total Expense: ${calculateTotal('expense')}</Text>
            </View>
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 10,
    marginBottom: 10,
    borderRadius: 30,
    textAlign: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: {
        width: 180,
        alignItems: 'center'
      },
      android: {
        width: 200
      }
    }),
  },
  transaction: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#f8f8f8',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 8,
  },
  header: {
    paddingBottom: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
    ...Platform.select({
      ios: {
        marginTop: 30,
        width: 350
      },
      android: {
        width: 400
      }
    }),
  },
  headerText: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  buttons: {
    alignItems: 'center',
    width: 200,
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  display: {
    width: 300
  },
  totalContainer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
