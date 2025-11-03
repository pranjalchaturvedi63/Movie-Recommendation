import { useState,useEffect } from "react";
import Search from "./components/Search.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_BASE_URL='https://api.themoviedb.org/3';
const API_KEY=import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS={
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

const App=()=>{
  const [searchTerm,setSearchTerm]=useState("");
  const [movieList,setMovieList]=useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [errorMessage,setErrorMessage]=useState("");

  const fetchMovies=async(query="")=>{
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint=query?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response=await fetch(endpoint,API_OPTIONS);
      if(!response.ok){
        throw new Error('failed to fetch movies ');
      }
      const data=await response.json();
      // console.log(data);

      if(data.Response=='False'){
        setErrorMessage(data.error||'Failed to fetch Movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      

    } catch (error) {
      console.error("Error while fetching movies"+error);
      setErrorMessage("Error fetching movies Please Try Later")
    } finally{
      setIsLoading(false);
    }
  }
  useEffect(()=>{
    fetchMovies(searchTerm);
  },[searchTerm]);
  return(
  <main>
      <div className="pattern"/>
      <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="heroBanner" />
            <h1>Find <span className="text-gradient"> Movies</span> you'll Enjoy Without Hassle!! </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>
          <section className="all-movies">
              <h2 className="mt-[40px]">All Movies </h2>
              {isLoading ? (<p className="text-white">Loading...</p>):errorMessage?(
                <p className="text-red-500">{errorMessage}</p>
              ):(<ul>
                {movieList.map((movie)=>(
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>) }
          </section>
      </div>
  </main>
)
}
export default App;