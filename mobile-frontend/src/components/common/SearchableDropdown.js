import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchableDropdown = ({
  placeholder = 'Search...',
  onSearch,
  onSelect,
  selectedValue = '',
  style,
  debounceTime = 300,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleSearch = text => {
    setQuery(text);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      if (text.length > 0) {
        try {
          setIsLoading(true);
          setShowDropdown(true);
          const searchResults = await onSearch(text);
          setResults(searchResults);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setShowDropdown(false);
        setResults([]);
      }
    }, debounceTime);

    setDebounceTimer(timer);
  };

  const handleSelect = item => {
    setQuery(item.label);
    setShowDropdown(false);
    setResults([]);
    onSelect(item);
  };

  const clearSelection = () => {
    setQuery('');
    setShowDropdown(false);
    setResults([]);
    onSelect(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.resultText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={selectedValue || query}
          onChangeText={handleSearch}
          onFocus={() => {
            if (query.length > 0) {
              setShowDropdown(true);
            }
          }}
        />

        {selectedValue || query ? (
          <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : (
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
        )}
      </View>

      {showDropdown && (
        <View style={styles.dropdown}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              style={styles.resultsList}
              maxHeight={200}
            />
          ) : query.length > 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#ddd',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  resultsList: {
    maxHeight: 200,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default SearchableDropdown;
