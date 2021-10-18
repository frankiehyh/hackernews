import React, { useState, useEffect, useRef } from 'react'

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

  const stories = [
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
      <List list={searchedStories} />
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

function List({ list }) {
  return list.map(({objectId, ...item}) => <Item key={item.objectID} {...item} />)
}

function Item({ title, url, author, num_comments, points }) {
  return (
    <>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </>
  )
}

export default App;