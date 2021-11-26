import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch('https://react-http-5552c-default-rtdb.firebaseio.com/movies.json')
      
      if(!response.ok) {
        throw new Error('Something went wrong!');
      }
      
      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }
      
      setMovies(loadedMovies);
      
      //const transformedMovies = data.map(movieData => {
      //  return {
      //    id: movieData.episode_id,
      //    title: movieData.title,
      //    openingText: movieData.opening_crawl,
      //    releaseDate: movieData.release_date
      //  }
      //})
      //setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    
    setIsLoading(false);

    //fetch('https://swapi.dev/api/films/').then(response => {
    //  return response.json(); //자동으로 변환해줌
    //}).then(data => {
    //  const transformedMovies = data.results.map(movieData => {
    //    return {
    //      id: movieData.episode_id,
    //      title: movieData.title,
    //      openingText: movieData.opening_crawl,
    //     releaseDate: movieData.release_date
    //    }
    //  })
    //  setMovies(transformedMovies); //변환된 데이터를 사용할 수 있음
      //지금은 useState를 사용하여 movies에 추출하고 변환한 데이터를 저장해줌
    //});
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-5552c-default-rtdb.firebaseio.com/', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>

  if(movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if(error) {
    content = <p>{error}</p>;
  }

  if(isLoading) {
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;

//fetch는 기본적으로 비동기로 동작하기 때문에 가끔 원하는 순서대로 동작하지 않을 때가 있음
//그럴 때 순서를 보장받기 위해서 async/await를 사용함
//await는 async가 선언된 함수 안에서만 사용 가능하며 promise 값을 기다렸다가 promise 값에서 결과를 추출해줌
//그리고 async를 선언한 함수는 반드시 promise를 리턴함
//이렇게 순서를 보장받을 수 있기 때문에 디버깅, 예외처리가 용이함
//잠재적 에러를 잡기위해서는 .then() - .catch(), async/await - try {모든 코드} catch(error) {}로 함

//response.ok 는 응답의 성공 여부를 알려줌. status도 마찬가지
//if(!response.ok) {
//  throw new Error('Something went wrong!');
//}
//실패한 응답이 있을 시 이 에러를 throw 해줌

//{!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
//{!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
//{isLoading && <p>Loading...</p>}
//{!isLoading && error && <p>{error}</p>}

//유저가 페이지를 방문하자마자 데이터를 보여주고 싶다면 useEffect를 사용할 수 있음
//해당 useEffect의 종속성 배열을 []로 하면 처음 페이지가 로딩될 때만 실행되지만
//함수 안에서 외부 기능을 사용한다면 기능이 바뀔 때마다 재렌더링 해줘야 함. 
//[함수]를 넣어주면 함수의 기능들이 변할 때마다 재실행, 재평가됨
//그러나 이렇게 하면 요소 렌더링 - 기능 변화 - 다시 렌더링... 
//무한 루프를 생성하므로 해당 함수가 불필요하게 재생산되는 것을 막기 위해 useCallback을 사용해줘야 함