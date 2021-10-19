import React, { useState, useEffect, useRef, useReducer } from 'react'

function App() {

  function useSemiPersistantState(key, initialState) {
    const [value, setValue] = useState(
      localStorage.getItem(key) || initialState
    );
  
    useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
  }

  const [searchTerm, setSearchTerm] = useSemiPersistantState('search', 'React');

  const initialStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Clarke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org',
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    }
  ];
  const getAsyncStories = () => 
    new Promise(resolve => setTimeout(() => (resolve(initialStories)), 2000));

  // const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'SET_STORIES':
        return action.payload;
      case 'REMOVE_STORY':
        return state.filter(story => action.payload.objectID !== story.objectID);
      default:
        throw new Error();
    }
  }
  const [stories, dispatchStories] = useReducer(storiesReducer, []);

  useEffect(() => {
    setIsLoading(true);

    getAsyncStories()
    .then(initialStories => {
      dispatchStories({
        type: 'SET_STORIES',
        payload: initialStories,
      });
      setIsLoading(false);
    })
    .catch(() => setIsError(true))
  }, []);

  const handleRemovedStory = item => {
      // const newStories = stories.filter(
      //     story => item.objectID !== story.objectID
      // );
      dispatchStories({
        type: 'REMOVE_STORY',
        payload: item,
      })
  }

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  }

  const searchedStories = stories.filter(story =>
     story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel 
        id='search'
        onInputChange={handleSearch} 
        value={searchTerm}
        isFocused>
          <strong>Searching for...</strong>
      </InputWithLabel>
      <p>Searching for <strong>{searchTerm}</strong></p>
      { isError && <p>Something went wrong...</p> }
      { isLoading ? (<p>Loading...</p>): 
      <List list={searchedStories} onRemoveItem={handleRemovedStory}/>
      } 
    </div>
  )
}

function InputWithLabel({ id, value, type='text', onInputChange, isFocused, children }) {
  const inputRef = useRef();
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return ( 
    <>
      <label htmlFor='id'>{children}</label>
      &nbsp;
      <input
        ref={inputRef} 
        id={id} 
        type={type} 
        value={value} 
        autoFocus={isFocused}
        onChange={onInputChange}/>
    </>
  )
}

function List({ list, onRemoveItem }) {
  return list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>)
}

function Item({ item, onRemoveItem }) {
  return (
    <>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
          <button onClick={() => onRemoveItem(item)}>
              Remove
          </button>
      </span>
    </>
  )
}

export default App;